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
.catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    linkedin: String,
    github: String,
    profilePhoto: String,
    projectTitle: String,
    projectPhoto: String,
    abstractDoc: String,
    projectDescription: String,
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

// Register/Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });
    
    let user = await User.findOne({ email });
    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            email,
            password: hashedPassword,
            name: "YOUR NAME",
            designation: "Member",
            linkedin: "https://www.linkedin.com/",
            github: "https://github.com/",
            profilePhoto: "./uploads/default.png",
            projectTitle: "Project Title",
            projectPhoto: "./uploads/default_project.jpeg",
            abstractDoc: "",
            projectDescription: "ADD YOUR PROJECT DESCRIPTION HERE",
        });

        await user.save();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, user });
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

// Multer Setup
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// Update Profile
app.post("/edit-profile", authMiddleware, upload.fields([
    { name: "profilePhoto" }, 
    { name: "projectPhoto" }, 
    { name: "abstractDoc" }
]), async (req, res) => {
    const { name, designation, linkedin, github, projectTitle, projectDescription } = req.body;
    const updateData = { name, designation, linkedin, github, projectTitle, projectDescription };

    if (req.files.profilePhoto) updateData.profilePhoto = req.files.profilePhoto[0].path;
    if (req.files.projectPhoto) updateData.projectPhoto = req.files.projectPhoto[0].path;
    if (req.files.abstractDoc) updateData.abstractDoc = req.files.abstractDoc[0].path;

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

// Get Team Data
app.get("/team", async (req, res) => {
    const teamData = await User.find();
    res.json(teamData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

