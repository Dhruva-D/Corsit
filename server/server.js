const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { processFileUpload } = require("./utils/fileStorage");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: ['https://corsit.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// For Vercel, we need to handle file uploads differently
// Configure storage for file uploads
const storage = multer.memoryStorage(); // Use memory storage for Vercel

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Serve static files - this won't work in Vercel's serverless environment
// We'll need to use a different approach for file storage
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    instagram: { type: String },
    designation: { type: String, default: 'Member' },
    profilePhoto: { type: String },
    linkedin: { type: String },
    github: { type: String },
    projectPhoto: { type: String },
    projectTitle: { type: String },
    projectDescription: { type: String },
    abstractDoc: { type: String },
    adminAuthenticated: { type: String, default: 'no' },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// Routes
app.get("/", (req, res) => {
    res.send("CORSIT API is running");
});

// Register/Login Route
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create and assign token
        const token = jwt.sign(
            { _id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const isAdmin = user.email === "admin@corsit.com";
        
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin,
                adminAuthenticated: user.adminAuthenticated
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Protected Routes
app.get("/api/user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.put("/api/user/password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.post("/change-password", authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        // Verify current password
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update Profile
app.put("/api/user/profile", authMiddleware, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'projectPhoto', maxCount: 1 },
    { name: 'abstractDoc', maxCount: 1 }
]), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        const updateFields = ['name', 'phone', 'instagram', 'linkedin', 'github', 'projectTitle', 'projectDescription', 'designation'];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        // Process file uploads using our utility
        if (req.files) {
            if (req.files.profilePhoto) {
                user.profilePhoto = processFileUpload(req.files.profilePhoto[0]);
            }
            if (req.files.projectPhoto) {
                user.projectPhoto = processFileUpload(req.files.projectPhoto[0]);
            }
            if (req.files.abstractDoc) {
                user.abstractDoc = processFileUpload(req.files.abstractDoc[0]);
            }
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.post("/edit-profile", authMiddleware, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'projectPhoto', maxCount: 1 },
    { name: 'abstractDoc', maxCount: 1 }
]), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        const updateFields = ['name', 'phone', 'instagram', 'linkedin', 'github', 'projectTitle', 'projectDescription', 'designation'];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        // Process file uploads using our utility
        if (req.files) {
            if (req.files.profilePhoto) {
                user.profilePhoto = processFileUpload(req.files.profilePhoto[0]);
            }
            if (req.files.projectPhoto) {
                user.projectPhoto = processFileUpload(req.files.projectPhoto[0]);
            }
            if (req.files.abstractDoc) {
                user.abstractDoc = processFileUpload(req.files.abstractDoc[0]);
            }
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin Routes
app.get("/api/admin/users", authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.user._id);
        if (user.email !== "admin@corsit.com") {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.get("/admin/users", authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.put("/api/admin/user/:id", authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const adminUser = await User.findById(req.user._id);
        if (adminUser.email !== "admin@corsit.com") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { designation, adminAuthenticated } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (designation) user.designation = designation;
        if (adminAuthenticated) user.adminAuthenticated = adminAuthenticated;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.put("/admin/users/:userId", authMiddleware, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'projectPhoto', maxCount: 1 },
    { name: 'abstractDoc', maxCount: 1 }
]), async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        const { userId } = req.params;
        const updateData = req.body;
        
        // Process file uploads using our utility
        if (req.files) {
            if (req.files.profilePhoto) {
                updateData.profilePhoto = processFileUpload(req.files.profilePhoto[0]);
            }
            if (req.files.projectPhoto) {
                updateData.projectPhoto = processFileUpload(req.files.projectPhoto[0]);
            }
            if (req.files.abstractDoc) {
                updateData.abstractDoc = processFileUpload(req.files.abstractDoc[0]);
            }
        }

        // Always set adminAuthenticated to 'yes' when admin updates a user
        updateData.adminAuthenticated = 'yes';
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.delete("/admin/users/:userId", authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin Authentication Route
app.post("/api/admin/auth", authMiddleware, async (req, res) => {
    try {
        const { adminSecret } = req.body;
        
        // Check if the provided secret matches the one in .env
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }
        
        // Return success
        res.json({ 
            message: "Admin authentication successful",
            isAdmin: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.post("/admin/auth", authMiddleware, async (req, res) => {
    try {
        const { adminSecret } = req.body;
        
        // Check if the provided secret matches the one in .env
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }
        
        // Return success
        res.json({ 
            message: "Admin authentication successful",
            isAdmin: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Team Data Route
app.get("/api/team", async (req, res) => {
    try {
        const teamData = await User.find({ adminAuthenticated: 'yes' });
        res.json(teamData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Legacy route for backward compatibility
app.get("/team", async (req, res) => {
    try {
        const teamData = await User.find({ adminAuthenticated: 'yes' });
        res.json(teamData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Signup with secret key
app.post("/api/signup-with-key", async (req, res) => {
    try {
        const { name, email, password, secretKey } = req.body;

        // Verify secret key
        if (secretKey !== process.env.CORSIT_SECRET_KEY) {
            return res.status(400).json({ message: "Invalid secret key" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Legacy route for backward compatibility
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, secretKey } = req.body;

        // Verify secret key
        if (secretKey !== process.env.CORSIT_SECRET_KEY) {
            return res.status(400).json({ message: "Invalid secret key" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// For Vercel, we need to export the Express app
const PORT = process.env.PORT || 5000;

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express API for Vercel
module.exports = app;

