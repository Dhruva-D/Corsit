import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import config from '../../config';
import AdminAuth from './AdminAuth';
// Import the logo directly from assets folder - this is the most reliable way
import corsitLogo from '../../assets/logo.png';

// Helper function for ordinal suffixes
const getYearSuffix = (year) => {
    const yearNum = parseInt(year);
    if (yearNum === 1) return "st";
    if (yearNum === 2) return "nd";
    if (yearNum === 3) return "rd";
    return "th";
};

// Function to get day suffix (1st, 2nd, 3rd, etc.)
const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const AdminsGallery = () => {
    const navigate = useNavigate();
    const [showAdminModal, setShowAdminModal] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [registrationToDelete, setRegistrationToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    // State to track which teams are expanded
    const [expandedTeams, setExpandedTeams] = useState({});

    // Toggle team expansion
    const toggleTeamExpansion = (teamNo) => {
        setExpandedTeams(prev => {
            const newState = {
                ...prev,
                [teamNo]: !prev[teamNo]
            };
            console.log("Toggled team expansion for team", teamNo, "New expanded state:", newState);
            return newState;
        });
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            setShowAdminModal(true);
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
            setShowAdminModal(false);
            fetchRegistrations();
        }
    }, []);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.apiBaseUrl}/workshop-registrations`, {
                headers: {
                    Authorization: token,
                    isAdmin: 'true'
                }
            });
            console.log("API Response:", response.data);
            setRegistrations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setLoading(false);
        }
    };

    const handleVerifyPayment = async (registrationId, currentStatus) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${config.apiBaseUrl}/workshop-registrations/${registrationId}/verify`, 
                { payment_verified: !currentStatus },
                {
                    headers: {
                        Authorization: token,
                        isAdmin: 'true'
                    }
                }
            );
            
            console.log("Payment verification updated for:", registrationId, "New status:", !currentStatus);
            
            // Update the local state with the new processed structure
            setRegistrations(prev => {
                // Create a deep copy of the previous state
                const updatedRegistrations = { ...prev };
                
                // Check if it's in individual registrations
                const individualIndex = updatedRegistrations.individual.findIndex(reg => reg._id === registrationId);
                if (individualIndex !== -1) {
                    updatedRegistrations.individual[individualIndex].payment_verified = !currentStatus;
                    return updatedRegistrations;
                }
                
                // If not in individuals, check in teams
                if (updatedRegistrations.teams) {
                    // Look through each team
                    Object.keys(updatedRegistrations.teams).forEach(teamNo => {
                        const teamMembers = updatedRegistrations.teams[teamNo];
                        const memberIndex = teamMembers.findIndex(reg => reg._id === registrationId);
                        
                        if (memberIndex !== -1) {
                            updatedRegistrations.teams[teamNo][memberIndex].payment_verified = !currentStatus;
                        }
                    });
                }
                
                return updatedRegistrations;
            });
        } catch (error) {
            console.error('Error updating payment verification:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteModal = (registration) => {
        setRegistrationToDelete(registration);
        setShowDeleteModal(true);
    };

    const handleDeleteRegistration = async () => {
        if (!registrationToDelete) return;
        
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Check if this is a team leader - if so, we need to delete all team members
            const isTeamLeader = registrationToDelete.isTeamHeader === true;
            const teamNo = registrationToDelete.teamNo;
            
            // If it's a team leader, let's get all team members and delete them too
            if (isTeamLeader && teamNo) {
                // First, delete the team leader
            await axios.delete(
                `${config.apiBaseUrl}/workshop-registrations/${registrationToDelete._id}`,
                {
                    headers: {
                        Authorization: token,
                        isAdmin: 'true'
                    }
                }
            );
            
                // Find all team members
                if (registrations.teams && registrations.teams[teamNo]) {
                    // Delete all team members except the leader (who we just deleted)
                    const teamMembers = registrations.teams[teamNo].slice(1);
                    
                    // Delete each team member
                    for (const member of teamMembers) {
                        await axios.delete(
                            `${config.apiBaseUrl}/workshop-registrations/${member._id}`,
                            {
                                headers: {
                                    Authorization: token,
                                    isAdmin: 'true'
                                }
                            }
                        );
                    }
                }
                
                // Remove entire team from local state
                setRegistrations(prev => {
                    const updatedRegistrations = { ...prev };
                    
                    if (updatedRegistrations.teams && updatedRegistrations.teams[teamNo]) {
                        delete updatedRegistrations.teams[teamNo];
                    }
                    
                    return updatedRegistrations;
                });
            } else {
                // Individual registration - just delete this one
                await axios.delete(
                    `${config.apiBaseUrl}/workshop-registrations/${registrationToDelete._id}`,
                    {
                        headers: {
                            Authorization: token,
                            isAdmin: 'true'
                        }
                    }
                );
                
                // Remove from local state
            setRegistrations(prev => {
                // Create a deep copy of the previous state
                const updatedRegistrations = { ...prev };
                
                // Check if it's in individual registrations
                updatedRegistrations.individual = updatedRegistrations.individual.filter(
                    reg => reg._id !== registrationToDelete._id
                );
                
                // If it could be in teams, filter there too
                if (updatedRegistrations.teams) {
                    // Look through each team
                    Object.keys(updatedRegistrations.teams).forEach(teamNo => {
                        updatedRegistrations.teams[teamNo] = updatedRegistrations.teams[teamNo].filter(
                            reg => reg._id !== registrationToDelete._id
                        );
                        
                        // If team is now empty, remove the team entry
                        if (updatedRegistrations.teams[teamNo].length === 0) {
                            delete updatedRegistrations.teams[teamNo];
                        }
                    });
                }
                
                return updatedRegistrations;
            });
            }
            
            setShowDeleteModal(false);
            setRegistrationToDelete(null);
        } catch (error) {
            console.error('Error deleting registration:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const openImageModal = (imageUrl) => {
        setCurrentImage(imageUrl);
        setShowImageModal(true);
    };

    // Function to group registrations by team for new collapsed display
    const processRegistrationsByTeams = React.useMemo(() => {
        // Structure to hold the result
        const result = {
            teams: {},
            individuals: []
        };
        
        if (!registrations || !registrations.teams) {
            return result;
        }
        
        console.log("Raw registrations data:", registrations);
        
        // Process individual registrations if they exist
        if (registrations.individual && Array.isArray(registrations.individual)) {
            registrations.individual.forEach(reg => {
                result.individuals.push({
                    ...reg,
                    isTeamHeader: false,
                    isTeamMember: false
                });
            });
        }
        
        // Process team registrations
        if (registrations.teams) {
            Object.entries(registrations.teams).forEach(([teamNo, members]) => {
                // Check if this is a valid team number (not 00, undefined, null, etc.)
                const isValidTeam = teamNo && teamNo !== "00" && teamNo !== "undefined" && /^\d+$/.test(teamNo) && teamNo !== "0";
                
                if (Array.isArray(members) && members.length > 0) {
                    if (isValidTeam) {
                        // Valid team - process as a team
                        // Get team leader (first member)
                        const teamLead = members[0];
                        
                        // Create search text for the team
                        const teamSearchText = `Team ${teamNo}`;
                        
                        // Create team entry with leader's info and remaining members
                        result.teams[teamNo] = {
                            teamLead: {
                                ...teamLead,
                                isTeamHeader: true,
                                isTeamMember: false,
                                teamNo: teamNo, // Add teamNo directly to team lead
                                teamDisplay: teamSearchText,
                                searchableText: `${teamSearchText} ${teamLead.name} ${teamLead.email} ${teamLead.usn || ''} ${teamLead.phone || ''}`,
                                membersCount: members.length // Total members count
                            },
                            members: members.slice(1).map(member => ({
                                ...member,
                                isTeamHeader: false,
                                isTeamMember: true,
                                teamNo: teamNo, // Add teamNo to each member for consistency
                                teamDisplay: teamSearchText,
                                searchableText: `${teamSearchText} ${member.name} ${member.email} ${member.usn || ''} ${member.phone || ''}`
                            }))
                        };
                    } else {
                        // Invalid team - treat all members as individual entries
                        members.forEach(member => {
                            result.individuals.push({
                                ...member,
                                isTeamHeader: false,
                                isTeamMember: false
                            });
                        });
                    }
                }
            });
        }
        
        console.log("Processed team data:", result);
        console.log("Teams structure:", result.teams);
        return result;
    }, [registrations]);

    // Get flattened registrations for the table with collapsed teams
    const processedRegistrations = React.useMemo(() => {
        const result = [];
        
        // Start with all individual registrations if they exist
        if (processRegistrationsByTeams.individuals && processRegistrationsByTeams.individuals.length > 0) {
            result.push(...processRegistrationsByTeams.individuals);
        }
        
        // Process team registrations (ensuring each team lead has appropriate properties for searching/filtering)
        if (processRegistrationsByTeams.teams) {
            Object.entries(processRegistrationsByTeams.teams).forEach(([teamNo, teamData]) => {
                if (!teamData || !teamData.teamLead) return;
                
                // Add team lead with special properties
                const teamLead = { 
                    ...teamData.teamLead,
                    teamNo: teamNo,
                    teamDisplay: `Team ${teamNo}`, // For search purposes
                    searchableText: `Team ${teamNo} ${teamData.teamLead.name} ${teamData.teamLead.email} ${teamData.teamLead.usn || ''} ${teamData.teamLead.phone || ''}`
                };
                
                    result.push(teamLead);
            });
        }
        
        return result;
    }, [processRegistrationsByTeams]);

    // Helper function to count all registrations
    const getTotalRegistrationsCount = () => {
        if (!registrations || !registrations.individual) {
            return 0;
        }
        
        let count = registrations.individual.length;
        
        // Add team registrations if they exist
        if (registrations.teams) {
            Object.values(registrations.teams).forEach(teamMembers => {
                if (Array.isArray(teamMembers)) {
                    count += teamMembers.length;
                }
            });
        }
        
        return count;
    };
    
    // Helper to get all registrations as a flat array
    const getAllRegistrationsFlat = React.useMemo(() => {
        if (!registrations || !registrations.individual) {
            return [];
        }
        
        let allRegistrations = [...registrations.individual];
        
        // Add team registrations if they exist
        if (registrations.teams) {
            Object.values(registrations.teams).forEach(teamMembers => {
                if (Array.isArray(teamMembers)) {
                    allRegistrations = [...allRegistrations, ...teamMembers];
                }
            });
        }
        
        return allRegistrations;
    }, [registrations]);
    
    // Helper to count registrations by criteria
    const countRegistrationsBy = (criteria, value) => {
        return getAllRegistrationsFlat.filter(r => r[criteria] === value).length;
    };
    
    // Helper to get the latest registration date
    const getLatestRegistrationDate = () => {
        if (getAllRegistrationsFlat.length === 0) {
            return 'N/A';
        }
        
        const latestDate = new Date(Math.max(...getAllRegistrationsFlat.map(r => new Date(r.registeredAt).getTime())));
        const day = latestDate.getDate();
        const daySuffix = getDaySuffix(day);
        return latestDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).replace(
            day.toString(),
            `${day}${daySuffix}`
        );
    };

    // First, let's fix the PDF export function to match the new table structure
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            
            // Colors matching the CORSIT logo (maroon/purple tones)
            const primaryMaroon = [145, 25, 33]; // Darker maroon from the logo (#912119)
            const secondaryPurple = [70, 45, 70]; // Dark purple from the logo (#462D46)
            const accentMaroon = [170, 40, 45]; // Lighter maroon (#AA282D)
            const green = [39, 174, 96]; // Success green
            const orange = [230, 126, 34]; // Warning orange
            const red = [231, 76, 60]; // Error red
            const blue = [41, 128, 185]; // Team blue
            const individualOrange = [230, 80, 10]; // Orange for individual entries
            
            // Add maroon border around page
            doc.setDrawColor(primaryMaroon[0], primaryMaroon[1], primaryMaroon[2]);
            doc.setLineWidth(5);
            doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);
            
            // Keep background white
            doc.setFillColor(255, 255, 255);
            doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, 'F');
            
            // Position logo in top left with some padding
            try {
                const logoWidth = 30;
                const logoHeight = 30;
                const logoX = 14; // Left side positioning
                const logoY = 15; // 15 units from top
                
                // Use the directly imported logo
                doc.addImage(corsitLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);
                console.log('Logo added to PDF successfully');
            } catch (logoError) {
                console.warn('Could not add CORSIT logo to PDF:', logoError);
                // Continue without logo
            }
            
            // Add CORSIT and Club of Robotics on the same line
            doc.setFontSize(24); 
            doc.setTextColor(primaryMaroon[0], primaryMaroon[1], primaryMaroon[2]); // Maroon color
            doc.setFont(undefined, 'bold');
            const mainTitle = "CORSIT - Club of Robotics";
            doc.text(mainTitle, 50, 30); // Positioned to the right of logo
            
            // Add workshop title with bold font
            doc.setFontSize(20);
            doc.setTextColor(accentMaroon[0], accentMaroon[1], accentMaroon[2]); // Accent maroon
            doc.setFont(undefined, 'bold'); // Keep bold for the workshop title
            const workshopTitle = "Workshop Registrations 2025";
            const workshopTitleWidth = doc.getStringUnitWidth(workshopTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const workshopTitleX = (doc.internal.pageSize.width - workshopTitleWidth) / 2;
            doc.text(workshopTitle, workshopTitleX, 50); // Center aligned below main heading
            
            // Add creation date
            const today = new Date();
            doc.setFontSize(10);
            doc.setTextColor(accentMaroon[0], accentMaroon[1], accentMaroon[2]); // Accent maroon for date
            doc.setFont(undefined, 'normal'); // Reset to normal font for the date
            
            // Format date to show in words (e.g., "6th May, 2025")
            const formattedDate = today.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            // Add ordinal suffix to day
            const day = today.getDate();
            const daySuffix = getDaySuffix(day);
            const dateWithOrdinal = formattedDate.replace(
                day.toString(), 
                `${day}${daySuffix}`
            );
            
            doc.text(`Generated on: ${dateWithOrdinal}`, 14, 60);
            
            // Add dashboard summary statistics
            doc.setFontSize(14);
            doc.setTextColor(secondaryPurple[0], secondaryPurple[1], secondaryPurple[2]); 
            doc.setFont(undefined, 'bold');
            doc.text("Registration Summary", 14, 75);
            
            // Stats summary - create a simple table for statistics
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            // Count team registrations
            const teamCount = Object.keys(processRegistrationsByTeams.teams).length;
            const individualCount = processRegistrationsByTeams.individuals.length;
            
            // Create two columns of stats for better layout
            const leftColumnStats = [
                [
                    { content: 'Total Registrations:', styles: { fontStyle: 'bold' } }, 
                    { content: `${getTotalRegistrationsCount()}`, styles: {} }
                ],
                [
                    { content: 'Individual Registrations:', styles: { fontStyle: 'bold' } }, 
                    { content: `${individualCount}`, styles: {} }
                ],
                [
                    { content: 'Team Registrations:', styles: { fontStyle: 'bold' } }, 
                    { content: `${teamCount} teams`, styles: {} }
                ],
                [
                    { content: 'Paid Registrations:', styles: { fontStyle: 'bold' } }, 
                    { content: `${countRegistrationsBy('payment_status', 'Paid')}`, styles: {} }
                ],
                [
                    { content: 'Verified Payments:', styles: { fontStyle: 'bold' } }, 
                    { content: `${countRegistrationsBy('payment_verified', true)}`, styles: {} }
                ],
                [
                    { content: 'Unpaid Registrations:', styles: { fontStyle: 'bold' } }, 
                    { content: `${countRegistrationsBy('payment_status', 'Unpaid')}`, styles: {} }
                ]
            ];
            
            const rightColumnStats = [
                [
                    { content: 'First Year Students:', styles: { fontStyle: 'bold' } }, 
                    { content: `${countRegistrationsBy('year', '1')}`, styles: {} }
                ],
                [
                    { content: 'Second Year Students:', styles: { fontStyle: 'bold' } }, 
                    { content: `${countRegistrationsBy('year', '2')}`, styles: {} }
                ],
                [
                    { content: 'Third Year Students:', styles: { fontStyle: 'bold' } }, 
                    { content: `${countRegistrationsBy('year', '3')}`, styles: {} }
                ],
                [
                    { content: 'Fourth Year Students:', styles: { fontStyle: 'bold' } }, 
                    { content: `${countRegistrationsBy('year', '4')}`, styles: {} }
                ],
                
            ];
            
            // Set stats columns width
            const statsWidth = 75;
            
            // Custom stats table rendering - left column
            autoTable(doc, {
                startY: 80,
                body: leftColumnStats,
                theme: 'plain',
                tableWidth: statsWidth,
                margin: { left: 14 },
                styles: { 
                    fontSize: 9,
                    cellPadding: 1
                },
                columnStyles: {
                    0: { 
                        cellWidth: 50,
                        textColor: [70, 45, 70]
                    },
                    1: { 
                        cellWidth: 25, 
                        halign: 'right',
                        textColor: [85, 85, 85]
                    }
                }
            });
            
            // Custom stats table rendering - right column (positioned to the right of left column)
            autoTable(doc, {
                startY: 80,
                body: rightColumnStats,
                theme: 'plain',
                tableWidth: statsWidth,
                margin: { left: 110 }, // Position to the right of the first column
                styles: { 
                    fontSize: 9,
                    cellPadding: 1
                },
                columnStyles: {
                    0: { 
                        cellWidth: 50,
                        textColor: [70, 45, 70]
                    },
                    1: { 
                        cellWidth: 25, 
                        halign: 'right',
                        textColor: [85, 85, 85]
                    }
                }
            });
            
            // Add decorative element - maroon line
            // Determine the max Y position from both tables to ensure the line is below both
            const leftColumnEndY = doc.previousAutoTable ? doc.previousAutoTable.finalY : 110;
            doc.setDrawColor(accentMaroon[0], accentMaroon[1], accentMaroon[2]);
            doc.setLineWidth(1.5);
            const statsEndY = leftColumnEndY + 10;
            doc.line(14, statsEndY, 196, statsEndY);
            
            // Process registrations to create a table that includes team information
            // First, create a formatted array for the table
            const tableData = [];
            
            // Process registrations data in the same structure as our UI
            // First add team registrations
            Object.entries(processRegistrationsByTeams.teams).forEach(([teamNo, teamData]) => {
                if (!teamData || !teamData.teamLead) return;
                
                const teamMembers = [teamData.teamLead, ...(teamData.members || [])];
                
                // First add team leader with team designation
                const leader = teamData.teamLead;
                
                // Format leader registration date
                const leaderRegDate = new Date(leader.registeredAt);
                const leaderRegDay = leaderRegDate.getDate();
                const leaderRegDaySuffix = getDaySuffix(leaderRegDay);
                const formattedLeaderRegDate = leaderRegDate.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).replace(
                    leaderRegDay.toString(),
                    `${leaderRegDay}${leaderRegDaySuffix}`
                );
                
                // Create leader payment status cell
                const leaderPaymentStatus = leader.payment_status || 'Unpaid';
                const leaderPaymentStatusCell = {
                    content: leaderPaymentStatus,
                    styles: {
                        fillColor: leaderPaymentStatus === 'Paid' ? [200, 250, 200] : [255, 240, 200],
                        textColor: leaderPaymentStatus === 'Paid' ? [39, 174, 96] : [230, 126, 34],
                        fontStyle: 'bold'
                    }
                };
                
                // Create leader verification status cell
                const leaderVerificationStatus = leader.payment_verified ? 'Yes' : 'No';
                const leaderVerificationStatusCell = {
                    content: leaderVerificationStatus,
                    styles: {
                        fillColor: leader.payment_verified ? [200, 250, 200] : [250, 220, 220],
                        textColor: leader.payment_verified ? [39, 174, 96] : [231, 76, 60],
                        fontStyle: 'bold'
                    }
                };
                
                // Add leader row with team styling
                const leaderRow = [
                    { 
                        content: `Team ${teamNo} (Leader)`, 
                        styles: { 
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175],
                            fontStyle: 'bold'
                        } 
                    },
                    { 
                        content: leader.name, 
                        styles: { 
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175],
                            fontStyle: 'bold'
                        } 
                    },
                    {
                        content: leader.email,
                        styles: {
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175]
                        }
                    },
                    {
                        content: leader.phone,
                        styles: {
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175]
                        }
                    },
                    {
                        content: leader.usn,
                        styles: {
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175]
                        }
                    },
                    {
                        content: `${leader.year}${getYearSuffix(leader.year)} Year`,
                        styles: {
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175]
                        }
                    },
                    {
                        content: formattedLeaderRegDate,
                        styles: {
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175]
                        }
                    },
                    leaderPaymentStatusCell,
                    leaderVerificationStatusCell,
                    {
                        content: leader.utr_number || '-',
                        styles: {
                            fillColor: [230, 240, 255],
                            textColor: [30, 64, 175]
                        }
                    }
                ];
                
                tableData.push(leaderRow);
                
                // Add team members with slightly different styling
                teamData.members.forEach(member => {
                    const memberRow = [
                        { 
                            content: `Team ${teamNo} (Member)`, 
                            styles: { 
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139]
                            } 
                        },
                        { 
                            content: member.name, 
                            styles: { 
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139]
                            } 
                        },
                        {
                            content: member.email,
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139]
                            }
                        },
                        {
                            content: member.phone,
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139]
                            }
                        },
                        {
                            content: member.usn,
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139]
                            }
                        },
                        {
                            content: `${member.year}${getYearSuffix(member.year)} Year`,
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139]
                            }
                        },
                        {
                            content: "-",
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139]
                            }
                        },
                        {
                            content: "↑", // Use an arrow to indicate same as leader
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139],
                                fontStyle: 'bold',
                                halign: 'center'
                            }
                        },
                        {
                            content: "↑", // Use an arrow to indicate same as leader
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139],
                                fontStyle: 'bold',
                                halign: 'center'
                            }
                        },
                        {
                            content: "↑", // Use an arrow to indicate same as leader
                            styles: {
                                fillColor: [245, 247, 250],
                                textColor: [100, 116, 139],
                                fontStyle: 'bold',
                                halign: 'center'
                            }
                        }
                    ];
                    
                    tableData.push(memberRow);
                });
            });
            
            // Add individual registrations
            processRegistrationsByTeams.individuals.forEach(registration => {
                // Format registration date
                const regDate = new Date(registration.registeredAt);
                const regDay = regDate.getDate();
                const regDaySuffix = getDaySuffix(regDay);
                const formattedRegDate = regDate.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).replace(
                    regDay.toString(),
                    `${regDay}${regDaySuffix}`
                );
                
                // Create a styled payment status cell
                const paymentStatus = registration.payment_status || 'Unpaid';
                const paymentStatusCell = {
                    content: paymentStatus,
                    styles: {
                        fillColor: paymentStatus === 'Paid' ? [200, 250, 200] : [255, 240, 200],
                        textColor: paymentStatus === 'Paid' ? [39, 174, 96] : [230, 126, 34],
                        fontStyle: 'bold'
                    }
                };
                
                // Create a styled verification status cell
                const verificationStatus = registration.payment_verified ? 'Yes' : 'No';
                const verificationStatusCell = {
                    content: verificationStatus,
                    styles: {
                        fillColor: registration.payment_verified ? [200, 250, 200] : [250, 220, 220],
                        textColor: registration.payment_verified ? [39, 174, 96] : [231, 76, 60],
                        fontStyle: 'bold'
                    }
                };
                
                const tableRow = [
                    { 
                        content: "Individual", 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: individualOrange,
                            fontStyle: 'bold'
                        } 
                    },
                    { 
                        content: registration.name, 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: [80, 80, 80] 
                        } 
                    },
                    { 
                        content: registration.email, 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: [80, 80, 80] 
                        } 
                    },
                    { 
                        content: registration.phone, 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: [80, 80, 80] 
                        } 
                    },
                    { 
                        content: registration.usn, 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: [80, 80, 80] 
                        } 
                    },
                    { 
                        content: `${registration.year}${getYearSuffix(registration.year)} Year`, 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: [80, 80, 80] 
                        } 
                    },
                    { 
                        content: formattedRegDate, 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: [80, 80, 80] 
                        } 
                    },
                    paymentStatusCell,
                    verificationStatusCell,
                    { 
                        content: registration.utr_number || '-', 
                        styles: { 
                            fillColor: [255, 244, 230], 
                            textColor: [80, 80, 80] 
                        } 
                    }
                ];
                
                tableData.push(tableRow);
            });
            
            // Configure the main table with adjusted column widths and spacing
            autoTable(doc, {
                startY: statsEndY + 10,
                head: [['Type', 'Name', 'Email', 'Phone', 'USN', 'Year', 'Date', 'Status', 'Verified', 'UTR']],
                body: tableData,
                styles: { 
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak', // Handle text overflow with line breaks
                    lineWidth: 0.5 // Thinner borders for better appearance
                },
                columnStyles: {
                    0: { cellWidth: 22 }, // Type (Team/Individual)
                    1: { cellWidth: 28 }, // Name
                    2: { cellWidth: 35 }, // Email
                    3: { cellWidth: 18 }, // Phone
                    4: { cellWidth: 18 }, // USN
                    5: { cellWidth: 15 }, // Year
                    6: { cellWidth: 22 }, // Date
                    7: { cellWidth: 15 }, // Status
                    8: { cellWidth: 12 }, // Verified
                    9: { cellWidth: 15 }  // UTR
                },
                margin: { left: 5, right: 5 },
                headStyles: {
                    fillColor: primaryMaroon,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [250, 245, 245]
                },
                // Add special theme that includes proper borders
                didDrawCell: (data) => {
                    // Add cell borders to make the table more readable
                    const doc = data.doc;
                    const rows = data.table.body;
                    
                    if (data.row.index === 0 && data.column.index === 0) {
                        // We're at the first cell of a row
                        doc.setDrawColor(200, 200, 200); // Light gray borders
                        doc.setLineWidth(0.1); // Thin lines
                    }
                }
            });
            
            // Add a footer with CORSIT branding
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(secondaryPurple[0], secondaryPurple[1], secondaryPurple[2]);
                doc.text('CORSIT - Powered by Club of Robotics', 14, doc.internal.pageSize.height - 10);
                doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
            }
            
            doc.save("corsit_workshop_registrations.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("There was an error generating the PDF. Please try again.");
        }
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        
        // Prepare data with better team grouping
        const rows = [];
        
        // Helper function to create a merged cell style
        const getMergedStyle = (rowspan) => ({ rowspan });
        
        // Add team registrations first with proper grouping
        Object.entries(processRegistrationsByTeams.teams).forEach(([teamNo, team]) => {
            const teamSize = team.members.length + 1; // Leader + members
            
            // Add team leader with merged cells for team-specific info
            rows.push({
                "Registration Type": { v: "Team", s: getMergedStyle(teamSize) },
                "Team Number": { v: teamNo, s: getMergedStyle(teamSize) },
                "Team Role": "Leader",
                "Name": team.teamLead.name,
                "Email": team.teamLead.email,
                "Phone": team.teamLead.phone,
                "USN": team.teamLead.usn,
                "Year": `${team.teamLead.year}${getYearSuffix(team.teamLead.year)} Year`,
                "Payment Status": { v: team.teamLead.payment_status, s: getMergedStyle(teamSize) },
                "Payment Verified": { v: team.teamLead.payment_verified ? 'Yes' : 'No', s: getMergedStyle(teamSize) },
                "UTR Number": { v: team.teamLead.utr_number || 'N/A', s: getMergedStyle(teamSize) },
                "Registered On": { v: new Date(team.teamLead.registeredAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }), s: getMergedStyle(teamSize) }
            });
            
            // Add team members
            team.members.forEach(member => {
                rows.push({
                    "Registration Type": { v: "Team", s: { display: 'none' } },
                    "Team Number": { v: teamNo, s: { display: 'none' } },
                    "Team Role": "Member",
                    "Name": member.name,
                    "Email": member.email,
                    "Phone": member.phone,
                    "USN": member.usn,
                    "Year": `${member.year}${getYearSuffix(member.year)} Year`,
                    "Payment Status": { v: "↑", s: { display: 'none' } },
                    "Payment Verified": { v: "↑", s: { display: 'none' } },
                    "UTR Number": { v: "↑", s: { display: 'none' } },
                    "Registered On": { v: "-", s: { display: 'none' } }
                });
            });
            
            // Add a blank row after each team for better readability
            rows.push({
                "Registration Type": "",
                "Team Number": "",
                "Team Role": "",
                "Name": "",
                "Email": "",
                "Phone": "",
                "USN": "",
                "Year": "",
                "Payment Status": "",
                "Payment Verified": "",
                "UTR Number": "",
                "Registered On": ""
            });
        });
        
        // Add individual registrations
        processRegistrationsByTeams.individuals.forEach(reg => {
            rows.push({
                "Registration Type": "Individual",
                "Team Number": "N/A",
                "Team Role": "N/A",
                "Name": reg.name,
                "Email": reg.email,
                "Phone": reg.phone,
                "USN": reg.usn,
                "Year": `${reg.year}${getYearSuffix(reg.year)} Year`,
                "Payment Status": reg.payment_status,
                "Payment Verified": reg.payment_verified ? 'Yes' : 'No',
                "UTR Number": reg.utr_number || 'N/A',
                "Registered On": new Date(reg.registeredAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            });
        });
        
        // Convert to worksheet with merged cells
        const worksheet = XLSX.utils.json_to_sheet(rows, { cellStyles: true });
        
        // Set column widths for better readability
        const columnWidths = [
            { wch: 15 }, // Registration Type
            { wch: 12 }, // Team Number
            { wch: 10 }, // Team Role
            { wch: 20 }, // Name
            { wch: 30 }, // Email
            { wch: 15 }, // Phone
            { wch: 12 }, // USN
            { wch: 12 }, // Year
            { wch: 15 }, // Payment Status
            { wch: 15 }, // Payment Verified
            { wch: 20 }, // UTR Number
            { wch: 20 }, // Registered On
        ];
        worksheet['!cols'] = columnWidths;
        
        // Add to workbook and download
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Workshop Registrations');
        XLSX.writeFile(workbook, 'workshop-registrations.xlsx');
    };

    if (!isAuthenticated) {
        return (
            <AdminAuth 
                isOpen={showAdminModal} 
                onClose={() => {
                    setShowAdminModal(false);
                    navigate('/profile');
                }}
                onSuccess={() => {
                    setIsAuthenticated(true);
                    setShowAdminModal(false);
                    fetchRegistrations();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-1000 text-gray-200 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-900 rounded-lg shadow-md p-6 md:p-8 border border-gray-800">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2 text-[#ed5a2d]">
                            Workshop Registrations
                        </h1>
                        <p className="text-gray-200 text-lg">
                            Manage and view candidate registrations for CORSIT workshops
                        </p>
                    </div>

                    <div className="bg-gray-900 flex flex-wrap items-center justify-end gap-4 mb-6">
                        {/* Export buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={exportToPDF}
                                className="flex items-center gap-2 bg-[#ed5a2d] text-white px-4 py-2 rounded-md hover:bg-[#d54a1d] transition-colors shadow-md"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors shadow-md"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Registrations Table */}
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-sm">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-12 h-12 border-t-4 border-[#ed5a2d] border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : registrations.individual && registrations.individual.length === 0 && (!registrations.teams || Object.keys(registrations.teams).length === 0) ? (
                            <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                                <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-400 text-lg">
                                    No workshop registrations found
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ WebkitOverflowScrolling: 'touch' }}>
                                <div style={{ minWidth: '1400px' }}>
                                    <table className="w-full border-collapse">
                                        <thead className="sticky top-0 z-[20]">
                                            <tr className="bg-gray-800 text-left">
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Team Number</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Name</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Email</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Phone</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">USN</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Year</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Registration Date</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Payment Status</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">UTN Number</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Receipt</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Verified</th>
                                                <th className="px-4 py-4 text-gray-200 font-medium text-sm">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody className="relative">
                                            {/* Update all iterations to use registrations directly */}
                                            {/* Group registrations by teams */}
                                            {Object.entries(processRegistrationsByTeams.teams || {}).map(([teamNo, teamData], teamIndex) => {
                                                if (!teamData || !teamData.teamLead) return null;
                                                
                                                // Only render valid teams - invalid teams are already moved to individuals array
                                                const teamMembers = [teamData.teamLead, ...(teamData.members || [])];
                                                const membersCount = teamMembers.length;
                                                
                                                return (
                                                    <React.Fragment key={`team-${teamNo}`}>
                                                        {/* Add a small gap before each team except the first one */}
                                                        {teamIndex > 0 && (
                                                            <tr className="h-2 bg-gray-950">
                                                                <td colSpan="12" className="border-0"></td>
                                                            </tr>
                                                        )}
                                                        {teamMembers.map((member, memberIndex) => {
                                                            const isFirstMember = memberIndex === 0;
                                                            const isLastMember = memberIndex === teamMembers.length - 1;
                                                            
                                                            // Standardize time formatting in 12-hour format
                                                            const dateObj = new Date(member.registeredAt);
                                                            const dateFormatted = dateObj.toLocaleDateString('en-GB', { 
                                                                day: '2-digit', 
                                                                month: 'short', 
                                                                year: 'numeric'
                                                            });
                                                            const timeFormatted = dateObj.toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            });
                                                            
                                                            // Fixed border styling for team members - ensure top border is visible
                                                            let borderClass = '';
                                                            if (isFirstMember && isLastMember) {
                                                                // Single member team (complete border all around)
                                                                borderClass = 'border-[3px] border-blue-500 rounded-lg relative z-[15] bg-clip-padding';
                                                            } else if (isFirstMember) {
                                                                // First member (top, left, right borders with rounded top)
                                                                borderClass = 'border-[3px] border-blue-500 border-b-0 rounded-t-lg relative z-[15] bg-clip-padding';
                                                            } else if (isLastMember) {
                                                                // Last member (bottom, left, right borders with rounded bottom)
                                                                borderClass = 'border-[3px] border-blue-500 border-t-0 rounded-b-lg relative z-[15] bg-clip-padding';
                                                            } else {
                                                                // Middle members (left, right borders only)
                                                                borderClass = 'border-x-[3px] border-blue-500 relative z-[15] bg-clip-padding';
                                                            }
                                                            
                                                            const rowClass = `
                                                                ${borderClass}
                                                                ${!isLastMember && !isFirstMember ? 'border-b border-gray-700/30' : ''}
                                                                ${!isFirstMember ? 'border-t border-gray-700/30' : ''}
                                                                h-18 min-h-[4.5rem] 
                                                                ${isFirstMember ? 'bg-gray-900/80' : 'bg-gray-900/50'}
                                                                isolate
                                                            `;
                                                            
                                                            return (
                                                                <tr key={member._id || `team-${teamNo}-member-${memberIndex}`} 
                                                                    className={rowClass}>
                                                                    
                                                                    {/* Team Number - only show on first row with rowspan */}
                                                                    {isFirstMember ? (
                                                                        <td rowSpan={membersCount} 
                                                                            className="px-4 py-4 text-gray-300 align-middle relative z-[16] bg-clip-padding">
                                                                            <div className="relative">
                                                                                <span className="px-3 py-1 rounded-full text-base font-medium bg-blue-500/20 text-blue-400 whitespace-nowrap">
                                                                                    Team {teamNo}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                    ) : null}
                                                                    
                                                                    {/* Name */}
                                                                    <td className="px-4 py-4 text-gray-300 relative z-[16] bg-clip-padding">
                                                                        <div className="break-words">{member.name}</div>
                                                                    </td>
                                                                    
                                                                    {/* Email */}
                                                                    <td className="px-4 py-4 text-gray-300 relative z-[16] bg-clip-padding">
                                                                        <div className="break-words overflow-x-hidden">{member.email}</div>
                                                                    </td>
                                                                    
                                                                    {/* Phone */}
                                                                    <td className="px-4 py-4 text-gray-300 relative z-[16] bg-clip-padding">
                                                                        <div className="break-words">{member.phone}</div>
                                                                    </td>
                                                                    
                                                                    {/* USN */}
                                                                    <td className="px-4 py-4 font-mono text-gray-300 relative z-[16] bg-clip-padding">
                                                                        <div className="break-words">{member.usn}</div>
                                                                    </td>
                                                                    
                                                                    {/* Year */}
                                                                    <td className="px-4 py-4 text-gray-300 relative z-[16] bg-clip-padding">
                                                                        <div className="break-words">{`${member.year}${getYearSuffix(member.year)} Year`}</div>
                                                                    </td>
                                                                    
                                                                    {/* Registration Date - only show on first row with rowspan */}
                                                                    {isFirstMember ? (
                                                                        <td rowSpan={membersCount} className="px-4 py-4 text-gray-300 align-middle bg-gray-900/50 relative z-[16] bg-clip-padding">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-base">{dateFormatted}</span>
                                                                                <span className="text-sm text-gray-400">{timeFormatted}</span>
                                                                            </div>
                                                                        </td>
                                                                    ) : null}
                                                                    
                                                                    {/* Payment Status - only show on first row with rowspan */}
                                                                    {isFirstMember ? (
                                                                        <td rowSpan={membersCount} className="px-4 py-4 align-middle bg-gray-900/50 relative z-[16]">
                                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                                teamData.teamLead.payment_status === 'Paid' 
                                                                                    ? 'bg-green-500/20 text-green-400' 
                                                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                                            }`}>
                                                                                {teamData.teamLead.payment_status || 'Unpaid'}
                                                                            </span>
                                                                        </td>
                                                                    ) : null}
                                                                    
                                                                    {/* UTN Number - only show on first row with rowspan */}
                                                                    {isFirstMember ? (
                                                                        <td rowSpan={membersCount} className="px-4 py-4 text-gray-300 font-mono text-sm align-middle border-r border-gray-700 bg-gray-900/50">
                                                                            <div className="flex flex-col">
                                                                                <span className="break-words">{teamData.teamLead.utr_number || '-'}</span>
                                                                                
                                                                                {teamData.teamLead.payment_screenshot && (
                                                                                    <a 
                                                                                        href={teamData.teamLead.payment_screenshot}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                                        </svg>
                                                                                        <span className="break-words">View Receipt</span>
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                    ) : null}
                                                                    
                                                                    {/* Receipt - only show on first row with rowspan */}
                                                                    {isFirstMember ? (
                                                                        <td rowSpan={membersCount} className="px-4 py-4 align-middle border-r border-gray-700 bg-gray-900/50">
                                                                            {teamData.teamLead.payment_screenshot ? (
                                                                                <div 
                                                                                    className="w-12 h-12 rounded border border-gray-600 bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation(); 
                                                                                        openImageModal(teamData.teamLead.payment_screenshot);
                                                                                    }}
                                                                                >
                                                                                    <img 
                                                                                        src={teamData.teamLead.payment_screenshot} 
                                                                                        alt="Payment Receipt" 
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-gray-500 text-sm">No receipt</span>
                                                                            )}
                                                                        </td>
                                                                    ) : null}
                                                                    
                                                                    {/* Verified - only show on first row with rowspan */}
                                                                    {isFirstMember ? (
                                                                        <td rowSpan={membersCount} className="px-4 py-4 align-middle border-r border-gray-700 bg-gray-900/50">
                                                                            <div className="flex justify-center">
                                                                                <button 
                                                                                    className="relative flex items-center justify-center"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleVerifyPayment(teamData.teamLead._id, teamData.teamLead.payment_verified);
                                                                                    }}
                                                                                    disabled={actionLoading}
                                                                                    aria-label={teamData.teamLead.payment_verified ? "Unverify payment" : "Verify payment"}
                                                                                >
                                                                                    <div className={`w-6 h-6 rounded-md border transition-all duration-300 ${
                                                                                        teamData.teamLead.payment_verified 
                                                                                            ? 'bg-green-500 border-green-600' 
                                                                                            : 'bg-gray-700 border-gray-600 hover:border-green-400'
                                                                                    }`}>
                                                                                        {teamData.teamLead.payment_verified && (
                                                                                            <motion.svg
                                                                                                className="w-6 h-6 text-white"
                                                                                                initial={{ scale: 0 }}
                                                                                                animate={{ scale: 1 }}
                                                                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                                                viewBox="0 0 24 24"
                                                                                                fill="none"
                                                                                                stroke="currentColor"
                                                                                                strokeWidth="3"
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                            >
                                                                                                <polyline points="20 6 9 17 4 12" />
                                                                                            </motion.svg>
                                                                                        )}
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    ) : null}
                                                                    
                                                                    {/* Delete - only show on first row with rowspan */}
                                                                    {isFirstMember ? (
                                                                        <td rowSpan={membersCount} className="px-4 py-4 align-middle bg-gray-900/50">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    openDeleteModal(teamData.teamLead);
                                                                                }}
                                                                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded transition-colors"
                                                                                aria-label="Delete team registration"
                                                                                disabled={actionLoading}
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                            </button>
                                                                        </td>
                                                                    ) : null}
                                                                </tr>
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                );
                                            })}
                                            
                                            {/* Individual registrations with gap between teams and individuals */}
                                            {processRegistrationsByTeams.individuals && processRegistrationsByTeams.individuals.length > 0 && Object.keys(processRegistrationsByTeams.teams || {}).length > 0 && (
                                                <tr className="h-4 bg-gray-950">
                                                    <td colSpan="12" className="border-0"></td>
                                                </tr>
                                            )}
                                            
                                            {/* Individual registrations */}
                                            {processRegistrationsByTeams.individuals && processRegistrationsByTeams.individuals.map((registration, idx) => {
                                                // Add gap between individual registrations
                                                const fragments = [];
                                                
                                                if (idx > 0) {
                                                    fragments.push(
                                                        <tr key={`gap-${registration._id}`} className="h-2 bg-gray-950">
                                                            <td colSpan="12" className="border-0"></td>
                                                        </tr>
                                                    );
                                                }
                                                
                                                // Standardize time formatting in 12-hour format
                                                const dateObj = new Date(registration.registeredAt);
                                                const dateFormatted = dateObj.toLocaleDateString('en-GB', { 
                                                    day: '2-digit', 
                                                    month: 'short', 
                                                    year: 'numeric'
                                                });
                                                const timeFormatted = dateObj.toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                });
                                                
                                                fragments.push(
                                                    <tr key={registration._id} className="border-2 border-orange-500 h-18 min-h-[4.5rem] bg-gray-900/50 mb-2">
                                                        <td className="px-4 py-4 text-gray-300 border-r border-gray-700">
                                                            <span className="px-3 py-1 rounded-full text-base font-medium bg-orange-500/20 text-orange-400 whitespace-nowrap">
                                                                Individual
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-300 border-r border-gray-700">
                                                            <div className="break-words">{registration.name}</div>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-300 border-r border-gray-700">
                                                            <div className="break-words overflow-x-hidden">{registration.email}</div>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-300 border-r border-gray-700">
                                                            <div className="break-words">{registration.phone}</div>
                                                        </td>
                                                        <td className="px-4 py-4 font-mono text-gray-300 border-r border-gray-700">
                                                            <div className="break-words">{registration.usn}</div>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-300 border-r border-gray-700">
                                                            <div className="break-words">{`${registration.year}${getYearSuffix(registration.year)} Year`}</div>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-300 border-r border-gray-700 bg-gray-900/50">
                                                            <div className="flex flex-col">
                                                                <span className="text-base">{dateFormatted}</span>
                                                                <span className="text-sm text-gray-400">{timeFormatted}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 border-r border-gray-700 bg-gray-900/50">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                registration.payment_status === 'Paid' 
                                                                    ? 'bg-green-500/20 text-green-400' 
                                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                                {registration.payment_status || 'Unpaid'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-300 font-mono text-sm border-r border-gray-700 bg-gray-900/50">
                                                            <div className="flex flex-col">
                                                                <span className="break-words">{registration.utr_number || '-'}</span>
                                                                
                                                                {registration.payment_screenshot && (
                                                                    <a 
                                                                        href={registration.payment_screenshot}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                        </svg>
                                                                        <span className="break-words">View Receipt</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 border-r border-gray-700 bg-gray-900/50">
                                                            {registration.payment_screenshot ? (
                                                                <div 
                                                                    className="w-12 h-12 rounded border border-gray-600 bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); 
                                                                        openImageModal(registration.payment_screenshot);
                                                                    }}
                                                                >
                                                                    <img 
                                                                        src={registration.payment_screenshot} 
                                                                        alt="Payment Receipt" 
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 text-sm">No receipt</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 border-r border-gray-700 bg-gray-900/50">
                                                            <div className="flex justify-center">
                                                                <button 
                                                                    className="relative flex items-center justify-center"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleVerifyPayment(registration._id, registration.payment_verified);
                                                                    }}
                                                                    disabled={actionLoading}
                                                                    aria-label={registration.payment_verified ? "Unverify payment" : "Verify payment"}
                                                                >
                                                                    <div className={`w-6 h-6 rounded-md border transition-all duration-300 ${
                                                                        registration.payment_verified 
                                                                            ? 'bg-green-500 border-green-600' 
                                                                            : 'bg-gray-700 border-gray-600 hover:border-green-400'
                                                                    }`}>
                                                                        {registration.payment_verified && (
                                                                            <motion.svg
                                                                                className="w-6 h-6 text-white"
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 1 }}
                                                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="3"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            >
                                                                                <polyline points="20 6 9 17 4 12" />
                                                                            </motion.svg>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 bg-gray-900/50">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openDeleteModal(registration);
                                                                }}
                                                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded transition-colors"
                                                                aria-label="Delete registration"
                                                                disabled={actionLoading}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                                
                                                return fragments;
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Stats summary */}
                    {!loading && (registrations.individual?.length > 0 || Object.keys(registrations.teams || {}).length > 0) && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <StatCard 
                                title="Total Registrations" 
                                value={getTotalRegistrationsCount()} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                            <StatCard 
                                title="Paid Registrations" 
                                value={countRegistrationsBy('payment_status', 'Paid')} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                            <StatCard 
                                title="Verified Payments" 
                                value={countRegistrationsBy('payment_verified', true)} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                            <StatCard 
                                title="Unpaid Registrations" 
                                value={countRegistrationsBy('payment_status', 'Unpaid')} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                            <StatCard 
                                title="First Years" 
                                value={countRegistrationsBy('year', '1')} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                            <StatCard 
                                title="Second Years" 
                                value={countRegistrationsBy('year', '2')} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                            <StatCard 
                                title="Third Years" 
                                value={countRegistrationsBy('year', '3')} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                            <StatCard 
                                title="Fourth Years" 
                                value={countRegistrationsBy('year', '4')} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                }
                                bgColor="bg-gray-800"
                                borderColor="border-gray-700"
                            />
                            
                           
                        </div>
                    )}
                </div>
            </div>

            {/* Update the image modal styling for consistency */}
            <AnimatePresence>
                {showImageModal && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowImageModal(false)}
                    >
                        <motion.div 
                            className="relative max-w-4xl max-h-[90vh] rounded-lg overflow-hidden shadow-2xl border border-gray-700"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img 
                                src={currentImage} 
                                alt="Payment Receipt" 
                                className="max-h-[90vh] max-w-full object-contain bg-gray-900"
                            />
                            <button 
                                className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all border border-gray-700"
                                onClick={() => setShowImageModal(false)}
                                aria-label="Close image preview"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Update the delete modal styling for consistency */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl max-w-lg w-full mx-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                            <div className="flex items-center mb-4 text-[#ed5a2d]">
                                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-xl font-semibold">Confirm Deletion</h3>
                            </div>
                            
                            <p className="mb-6 text-gray-300">
                                {registrationToDelete?.isTeamHeader ? (
                                    <>Are you sure you want to delete <span className="font-semibold text-white">Team {registrationToDelete.teamNo}</span> led by <span className="font-semibold text-white">{registrationToDelete?.name}</span>? This will delete all team members. This action cannot be undone.</>
                                ) : (
                                    <>Are you sure you want to delete the registration for <span className="font-semibold text-white">{registrationToDelete?.name}</span>? This action cannot be undone.</>
                                )}
                            </p>
                            
                            <div className="flex flex-wrap gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteRegistration}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Registration'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper component for stats cards
const StatCard = ({ title, value, icon, bgColor = "bg-gray-800", borderColor = "border-gray-700" }) => {
    return (
        <div className={`${bgColor} border ${borderColor} rounded-lg p-4 shadow-sm`}>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-900 text-[#ed5a2d] mr-4">
                    {icon}
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-xl font-semibold text-gray-100 mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminsGallery;