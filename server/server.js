const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

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

// Utility to handle errors
const handleError = (res, message, status = 500) => {
    console.error(message);
    res.status(status).json({ message });
};

// Multer Setup
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Helper function to update user data with file handling
const updateUserDataWithFiles = (req, res, updateData) => {
    const files = req.files || {};
    if (files.profilePhoto) updateData.profilePhoto = files.profilePhoto[0].path;
    if (files.projectPhoto) updateData.projectPhoto = files.projectPhoto[0].path;
    if (files.abstractDoc) updateData.abstractDoc = files.abstractDoc[0].path;
    return updateData;
};

// Register/Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        handleError(res, "Login error", 500);
    }
});

// Change Password Route
app.post("/change-password", authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "New password is required" });

    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        handleError(res, "Error updating password", 500);
    }
});

// Update Profile
app.post("/edit-profile", authMiddleware, upload.fields([
    { name: "profilePhoto" }, { name: "projectPhoto" }, { name: "abstractDoc" }
]), async (req, res) => {
    const { name, designation, linkedin, github, projectTitle, projectDescription, phone, instagram } = req.body;
    const updateData = { name, designation, linkedin, github, projectTitle, projectDescription, phone, instagram };
    const finalUpdateData = updateUserDataWithFiles(req, res, updateData);

    try {
        await User.findByIdAndUpdate(req.user.id, finalUpdateData);
        res.json({ message: "Profile and project details updated" });
    } catch (error) {
        handleError(res, "Error updating profile", 500);
    }
});

// Get Profile
app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        handleError(res, "Error fetching profile", 500);
    }
});

// Admin Authentication Route
app.post("/admin/auth", authMiddleware, async (req, res) => {
    const { adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ message: "Invalid admin credentials" });

    try {
        await User.findById(req.user.id);
        res.json({ message: "Admin authentication successful", isAdmin: true });
    } catch (error) {
        handleError(res, "Error during admin authentication", 500);
    }
});

// Get Team Data
app.get("/team", async (req, res) => {
    try {
        const teamData = await User.find({ adminAuthenticated: 'yes' });
        res.json(teamData);
    } catch (error) {
        handleError(res, "Error fetching team data", 500);
    }
});

// Get All Users for Admin
app.get("/admin/users", authMiddleware, async (req, res) => {
    try {
        const isAdmin = req.header("isAdmin");
        if (isAdmin !== 'true') return res.status(403).json({ message: "Access denied. Admin privileges required." });

        const allUsers = await User.find();
        res.json(allUsers);
    } catch (error) {
        handleError(res, "Error fetching all users", 500);
    }
});

// Update User by Admin
app.put("/admin/users/:userId", authMiddleware, upload.fields([
    { name: "profilePhoto" }, { name: "projectPhoto" }, { name: "abstractDoc" }
]), async (req, res) => {
    try {
        const isAdmin = req.header("isAdmin");
        if (isAdmin !== 'true') return res.status(403).json({ message: "Access denied. Admin privileges required." });

        const { userId } = req.params;
        let updateData = req.body;
        updateData = updateUserDataWithFiles(req, res, updateData);
        updateData.adminAuthenticated = 'yes';

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        handleError(res, "Error updating user", 500);
    }
});

// Delete User by Admin
app.delete("/admin/users/:userId", authMiddleware, async (req, res) => {
    try {
        const isAdmin = req.header("isAdmin");
        if (isAdmin !== 'true') return res.status(403).json({ message: "Access denied. Admin privileges required." });

        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        handleError(res, "Error deleting user", 500);
    }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, secretKey } = req.body;
        if (secretKey !== process.env.CORSIT_SECRET_KEY) return res.status(401).json({ message: 'Invalid secret key' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, adminAuthenticated: 'no', profilePhoto: 'uploads/default-profile.png', projectPhoto: 'uploads/default-project.png' });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        handleError(res, "Error registering user", 500);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
