const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

// Import Cloudinary configuration and upload routes
const cloudinary = require('./config/cloudinary');
const uploadRoutes = require('./config/routes');
const { uploadProfile, uploadPayment, uploadProject, uploadAbstract } = require('./config/storage');

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Register upload routes
app.use('/api', uploadRoutes);

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

// Workshop Registration Schema
const workshopRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    usn: { type: String, required: true },
    year: { type: String, required: true },
    utr_number: { type: String },
    payment_screenshot: { type: String },
    payment_status: { type: String, default: 'Unpaid', enum: ['Paid', 'Unpaid'] },
    payment_verified: { type: Boolean, default: false },
    registeredAt: { type: Date, default: Date.now }
});
const WorkshopRegistration = mongoose.model("WorkshopRegistration", workshopRegistrationSchema);

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

// Register/Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        // Return success response
        res.json({ 
            message: "Login successful", 
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            } 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Change Password Route
app.post("/change-password", authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "New password is required" });

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
});

// Update Profile - Now using Cloudinary
app.post("/edit-profile", authMiddleware, uploadProfile.fields([
    { name: "profilePhoto", maxCount: 1 }, 
    { name: "projectPhoto", maxCount: 1 }, 
    { name: "abstractDoc", maxCount: 1 }
]), async (req, res) => {
    const { name, designation, linkedin, github, projectTitle, projectDescription, phone, instagram } = req.body;
    const updateData = { 
        name, 
        designation, 
        linkedin, 
        github, 
        projectTitle, 
        projectDescription,
        phone,
        instagram
    };

    if (req.files && req.files.profilePhoto) updateData.profilePhoto = req.files.profilePhoto[0].path;
    if (req.files && req.files.projectPhoto) updateData.projectPhoto = req.files.projectPhoto[0].path;
    if (req.files && req.files.abstractDoc) updateData.abstractDoc = req.files.abstractDoc[0].path;

    await User.findByIdAndUpdate(req.user.id, updateData);
    res.json({ message: "Profile and project details updated" });
});

// Get Profile
app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Admin Authentication Route
app.post("/admin/auth", authMiddleware, async (req, res) => {
    try {
        const { adminSecret } = req.body;
        
        // Check if the provided secret matches the one in .env
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }
        
        // Get the user
        const user = await User.findById(req.user.id);
        
        // Update user with admin role or return success
        res.json({ 
            message: "Admin authentication successful",
            isAdmin: true
        });
    } catch (error) {
        console.error("Admin auth error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get Team Data
app.get("/team", async (req, res) => {
    const teamData = await User.find({ adminAuthenticated: 'yes' });
    res.json(teamData);
});

// Get All Users for Admin
app.get("/admin/users", authMiddleware, async (req, res) => {
    try {
        // Check if user is admin (has the isAdmin flag in the request)
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        const allUsers = await User.find();
        res.json(allUsers);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User by Admin - Now using Cloudinary
app.put("/admin/users/:userId", authMiddleware, uploadProfile.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "projectPhoto", maxCount: 1 },
    { name: "abstractDoc", maxCount: 1 }
]), async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        const { userId } = req.params;
        const updateData = req.body;
        
        // Handle file uploads
        if (req.files) {
            if (req.files.profilePhoto) {
                updateData.profilePhoto = req.files.profilePhoto[0].path;
            }
            if (req.files.projectPhoto) {
                updateData.projectPhoto = req.files.projectPhoto[0].path;
            }
            if (req.files.abstractDoc) {
                updateData.abstractDoc = req.files.abstractDoc[0].path;
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
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete User by Admin
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
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, secretKey } = req.body;

        // Verify secret key
        if (secretKey !== process.env.CORSIT_SECRET_KEY) {
            return res.status(401).json({ message: 'Invalid secret key' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            adminAuthenticated: 'no',
            profilePhoto: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1/profile_uploads/default-profile.png`,
            projectPhoto: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1/project_uploads/default-project.png`,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Workshop Registration endpoint - Now using Cloudinary
app.post('/workshop-register', async (req, res) => {
    try {
        const { name, email, phone, usn, year, utr_number, payment_status, payment_screenshot } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !usn || !year) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate payment details if payment_status is Paid
        if (payment_status === 'Paid' && (!utr_number || !payment_screenshot)) {
            return res.status(400).json({ message: 'UTR number and payment screenshot are required for payment' });
        }

        // Create new workshop registration
        const registration = new WorkshopRegistration({
            name,
            email,
            phone,
            usn,
            year,
            payment_status,
            utr_number: utr_number || null,
            payment_screenshot: payment_screenshot || null
        });

        await registration.save();

        res.status(201).json({ 
            message: 'Registration successful',
            registration: {
                name,
                email,
                phone,
                usn,
                year,
                payment_status
            }
        });
    } catch (error) {
        console.error('Workshop registration error:', error);
        res.status(500).json({ message: 'Error registering for workshop' });
    }
});

// Get Workshop Registrations for Admin
app.get('/workshop-registrations', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        const registrations = await WorkshopRegistration.find().sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching workshop registrations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update payment verification status
app.put('/workshop-registrations/:registrationId/verify', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        const { registrationId } = req.params;
        const { payment_verified } = req.body;
        
        const updatedRegistration = await WorkshopRegistration.findByIdAndUpdate(
            registrationId,
            { payment_verified },
            { new: true }
        );
        
        if (!updatedRegistration) {
            return res.status(404).json({ message: "Registration not found" });
        }
        
        res.json({ 
            message: `Payment verification ${payment_verified ? 'confirmed' : 'removed'}`,
            registration: updatedRegistration
        });
    } catch (error) {
        console.error('Error updating payment verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete workshop registration
app.delete('/workshop-registrations/:registrationId', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        const { registrationId } = req.params;
        const deletedRegistration = await WorkshopRegistration.findByIdAndDelete(registrationId);
        
        if (!deletedRegistration) {
            return res.status(404).json({ message: "Registration not found" });
        }
        
        res.json({ message: "Registration deleted successfully" });
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
