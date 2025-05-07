const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

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
    
    // Team number (2-digit identifier starting from 01)
    team_number: { type: String, required: true },
    
    // Fields for team members
    member2_name: { type: String, default: "None" },
    member2_email: { type: String, default: "None" },
    member2_phone: { type: String, default: "None" },
    member2_usn: { type: String, default: "None" },
    member2_year: { type: String, default: "None" },
    
    member3_name: { type: String, default: "None" },
    member3_email: { type: String, default: "None" },
    member3_phone: { type: String, default: "None" },
    member3_usn: { type: String, default: "None" },
    member3_year: { type: String, default: "None" },
    
    member4_name: { type: String, default: "None" },
    member4_email: { type: String, default: "None" },
    member4_phone: { type: String, default: "None" },
    member4_usn: { type: String, default: "None" },
    member4_year: { type: String, default: "None" },
    
    // Track the number of team members (1-4)
    members_count: { type: Number, default: 1, min: 1, max: 4 },
    
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
    try {
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

        // Handle file uploads through Cloudinary and use the full URLs
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

        await User.findByIdAndUpdate(req.user.id, updateData);
        res.json({ message: "Profile and project details updated" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
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
        
        // Handle file uploads through Cloudinary
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

        // Create new user with default values
        const user = new User({
            name,
            email,
            password: hashedPassword,
            adminAuthenticated: 'no',
            // Default social media URLs
            linkedin: 'https://linkedin.com',
            github: 'https://github.com',
            instagram: 'https://instagram.com',
            // Use Cloudinary default images
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

// Workshop Registration
app.post("/workshop-register", async (req, res) => {
    try {
        const { 
            name, email, phone, usn, year, 
            payment_status, utr_number, payment_screenshot,
            member2_name, member2_email, member2_phone, member2_usn, member2_year,
            member3_name, member3_email, member3_phone, member3_usn, member3_year,
            member4_name, member4_email, member4_phone, member4_usn, member4_year
        } = req.body;

        // Validate primary registrant's information
        if (!name || !email || !phone || !usn || !year) {
            return res.status(400).json({ message: 'All primary team member fields are required' });
        }

        // Calculate the number of members
        let members_count = 1; // Start with primary member
        if (member2_name && member2_email && member2_phone && member2_usn && member2_year) {
            members_count++;
        }
        if (member3_name && member3_email && member3_phone && member3_usn && member3_year) {
            members_count++;
        }
        if (member4_name && member4_email && member4_phone && member4_usn && member4_year) {
            members_count++;
        }
        
        // Get the last registration to determine the next team number
        const lastRegistration = await WorkshopRegistration.findOne().sort({ team_number: -1 });
        
        // Determine team number (starting from "01" and incrementing)
        let nextTeamNumber = 1; // Default start if no previous registrations
        
        if (lastRegistration && lastRegistration.team_number) {
            // Parse the last team number and increment
            nextTeamNumber = parseInt(lastRegistration.team_number, 10) + 1;
        }
        
        // Format as 2-digit string (e.g., "01", "02", ... "99")
        const team_number = nextTeamNumber.toString().padStart(2, "0");

        // Create a new registration
        const registration = new WorkshopRegistration({
            name, email, phone, usn, year,
            payment_status,
            utr_number: utr_number || null,
            payment_screenshot: payment_screenshot || null,
            
            // Team number
            team_number,
            
            // Team member fields
            member2_name: member2_name || "None",
            member2_email: member2_email || "None",
            member2_phone: member2_phone || "None",
            member2_usn: member2_usn || "None",
            member2_year: member2_year || "None",
            
            member3_name: member3_name || "None",
            member3_email: member3_email || "None",
            member3_phone: member3_phone || "None",
            member3_usn: member3_usn || "None",
            member3_year: member3_year || "None",
            
            member4_name: member4_name || "None",
            member4_email: member4_email || "None",
            member4_phone: member4_phone || "None",
            member4_usn: member4_usn || "None",
            member4_year: member4_year || "None",
            
            // Set the members count
            members_count
        });

        await registration.save();

        res.status(201).json({ 
            message: 'Team registration successful! Your team number is ' + team_number,
            registration: {
                name,
                email,
                phone,
                usn,
                year,
                team_number,
                payment_status,
                members_count
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
        
        // Get workshop registrations (team-based)
        const workshopRegistrations = await WorkshopRegistration.find().sort({ registeredAt: -1 });
        
        // Get regular users (existing individual users)
        const regularUsers = await User.find().sort({ createdAt: -1 });
        
        // Structure registrations with teams based on members_count
        const structuredRegistrations = {
            teams: {},
            individual: [] // Add this to maintain compatibility
        };
        
        // Process workshop registrations and use the team_number from the database
        workshopRegistrations.forEach(registration => {
            const teamNumber = registration.team_number;
            
            // Create an entry for this team if it doesn't exist
            if (!structuredRegistrations.teams[teamNumber]) {
                structuredRegistrations.teams[teamNumber] = [];
            }
            
            // Add the team lead
            structuredRegistrations.teams[teamNumber].push({
                _id: registration._id,
                name: registration.name,
                email: registration.email,
                phone: registration.phone,
                usn: registration.usn,
                year: registration.year,
                payment_status: registration.payment_status,
                payment_verified: registration.payment_verified,
                utr_number: registration.utr_number,
                payment_screenshot: registration.payment_screenshot,
                registeredAt: registration.registeredAt,
                isTeamHeader: true,
                teamNo: teamNumber,
                membersCount: registration.members_count
            });
            
            // Add member 2 if exists
            if (registration.member2_name && registration.member2_name !== "None") {
                structuredRegistrations.teams[teamNumber].push({
                    name: registration.member2_name,
                    email: registration.member2_email,
                    phone: registration.member2_phone,
                    usn: registration.member2_usn,
                    year: registration.member2_year,
                    isTeamMember: true,
                    teamNo: teamNumber
                });
            }
            
            // Add member 3 if exists
            if (registration.member3_name && registration.member3_name !== "None") {
                structuredRegistrations.teams[teamNumber].push({
                    name: registration.member3_name,
                    email: registration.member3_email,
                    phone: registration.member3_phone,
                    usn: registration.member3_usn,
                    year: registration.member3_year,
                    isTeamMember: true,
                    teamNo: teamNumber
                });
            }
            
            // Add member 4 if exists
            if (registration.member4_name && registration.member4_name !== "None") {
                structuredRegistrations.teams[teamNumber].push({
                    name: registration.member4_name,
                    email: registration.member4_email,
                    phone: registration.member4_phone,
                    usn: registration.member4_usn,
                    year: registration.member4_year,
                    isTeamMember: true,
                    teamNo: teamNumber
                });
            }
        });
        
        
        
        res.json(structuredRegistrations);
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

// Generate registration PDF for admin
app.get('/workshop-registrations/export/:registrationId', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        const { registrationId } = req.params;
        const registration = await WorkshopRegistration.findById(registrationId);
        
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }
        
        // Create a PDF document
        const doc = new PDFDocument();
        const filename = `registration-${registration._id}.pdf`;
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Pipe the PDF to the response
        doc.pipe(res);
        
        // Add content to the PDF
        doc.fontSize(20).text('Workshop Registration Details', { align: 'center' });
        doc.moveDown();
        
        // Team information
        doc.fontSize(14).fillColor('#E74C3C').text(`Team Information:`);
        doc.fontSize(12).fillColor('#34495E').text(`Team Size: ${registration.members_count} members`);
        doc.moveDown();
        
        // Primary registrant information (Team Leader)
        doc.fontSize(16).fillColor('#2C3E50').text('Team Leader:');
        doc.fontSize(12).fillColor('#34495E');
        doc.text(`Name: ${registration.name}`);
        doc.text(`Email: ${registration.email}`);
        doc.text(`Phone: ${registration.phone}`);
        doc.text(`USN: ${registration.usn}`);
        doc.text(`Year: ${registration.year}`);
        doc.moveDown();
        
        // Payment information
        doc.fontSize(14).fillColor('#E74C3C').text('Payment Information:');
        doc.fontSize(12).fillColor('#34495E');
        doc.text(`Payment Status: ${registration.payment_status}`);
        doc.text(`Payment Verified: ${registration.payment_verified ? 'Yes' : 'No'}`);
        if (registration.payment_status === 'Paid') {
            doc.text(`UTR Number: ${registration.utr_number}`);
        }
        doc.moveDown();
        
        // Team members information
        if (registration.members_count > 1) {
            doc.fontSize(16).fillColor('#2C3E50').text('Team Members:');
            
            // Member 2
            if (registration.member2_name) {
                doc.fontSize(14).fillColor('#2980B9').text(`Member 2:`);
                doc.fontSize(12).fillColor('#34495E');
                doc.text(`Name: ${registration.member2_name}`);
                doc.text(`Email: ${registration.member2_email}`);
                doc.text(`Phone: ${registration.member2_phone}`);
                doc.text(`USN: ${registration.member2_usn}`);
                doc.text(`Year: ${registration.member2_year}`);
                doc.moveDown();
            }
            
            // Member 3
            if (registration.member3_name) {
                doc.fontSize(14).fillColor('#2980B9').text(`Member 3:`);
                doc.fontSize(12).fillColor('#34495E');
                doc.text(`Name: ${registration.member3_name}`);
                doc.text(`Email: ${registration.member3_email}`);
                doc.text(`Phone: ${registration.member3_phone}`);
                doc.text(`USN: ${registration.member3_usn}`);
                doc.text(`Year: ${registration.member3_year}`);
                doc.moveDown();
            }
            
            // Member 4
            if (registration.member4_name) {
                doc.fontSize(14).fillColor('#2980B9').text(`Member 4:`);
                doc.fontSize(12).fillColor('#34495E');
                doc.text(`Name: ${registration.member4_name}`);
                doc.text(`Email: ${registration.member4_email}`);
                doc.text(`Phone: ${registration.member4_phone}`);
                doc.text(`USN: ${registration.member4_usn}`);
                doc.text(`Year: ${registration.member4_year}`);
                doc.moveDown();
            }
        }
        
        // Registration date
        doc.fontSize(12).fillColor('#7F8C8D');
        doc.text(`Registered on: ${new Date(registration.registeredAt).toLocaleDateString()}`);
        
        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
});

// Export all workshop registrations as CSV
app.get('/workshop-registrations/export-all', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const isAdmin = req.header("isAdmin");
        if (!isAdmin || isAdmin !== 'true') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        const registrations = await WorkshopRegistration.find().sort({ registeredAt: -1 });
        
        // Create CSV content with the new structure
        let csvContent = 'Team No,Role,Name,Email,Phone,USN,Year,Payment Status,Payment Verified,UTR Number,Registered At\n';
        
        // Add each registration with sequential team numbers
        registrations.forEach((reg, index) => {
            const teamNo = index + 1;
            
            // Add team leader (primary registrant)
            csvContent += `${teamNo},Leader,${reg.name},${reg.email},${reg.phone},${reg.usn},${reg.year},${reg.payment_status},${reg.payment_verified ? 'Yes' : 'No'},${reg.utr_number || ''},${new Date(reg.registeredAt).toLocaleDateString()}\n`;
            
            // Add member 2 if exists
            if (reg.member2_name) {
                csvContent += `${teamNo},Member,${reg.member2_name},${reg.member2_email},${reg.member2_phone},${reg.member2_usn},${reg.member2_year},,,,\n`;
            }
            
            // Add member 3 if exists
            if (reg.member3_name) {
                csvContent += `${teamNo},Member,${reg.member3_name},${reg.member3_email},${reg.member3_phone},${reg.member3_usn},${reg.member3_year},,,,\n`;
            }
            
            // Add member 4 if exists
            if (reg.member4_name) {
                csvContent += `${teamNo},Member,${reg.member4_name},${reg.member4_email},${reg.member4_phone},${reg.member4_usn},${reg.member4_year},,,,\n`;
            }
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="workshop-registrations.csv"');
        
        // Send the CSV
        res.send(csvContent);
    } catch (error) {
        console.error('Error exporting registrations:', error);
        res.status(500).json({ message: 'Error exporting registrations' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
