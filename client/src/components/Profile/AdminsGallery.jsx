import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import config from '../../config';
import AdminAuth from './AdminAuth';
// Import the logo directly from assets folder - this is the most reliable way
import corsitLogo from '../../assets/logo.png';

const AdminsGallery = () => {
    const navigate = useNavigate();
    const [showAdminModal, setShowAdminModal] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'registeredAt', direction: 'desc' });

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
            setRegistrations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setLoading(false);
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedRegistrations = React.useMemo(() => {
        let sortableItems = [...registrations];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [registrations, sortConfig]);

    const filteredRegistrations = sortedRegistrations.filter(
        (registration) =>
            registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.usn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            
            // Colors matching the CORSIT logo (maroon/purple tones)
            const primaryMaroon = [145, 25, 33]; // Darker maroon from the logo (#912119)
            const secondaryPurple = [70, 45, 70]; // Dark purple from the logo (#462D46)
            const accentMaroon = [170, 40, 45]; // Lighter maroon (#AA282D)
            
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
            doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, 60);
            
            // Add decorative element - maroon line
            doc.setDrawColor(accentMaroon[0], accentMaroon[1], accentMaroon[2]);
            doc.setLineWidth(1.5);
            doc.line(14, 62, 196, 62);
            
            // Add table with registrations
            const tableColumn = ["Name", "Email", "Phone", "USN", "Year", "Date", "Payment Status"];
            const tableRows = [];
            
            filteredRegistrations.forEach(registration => {
                const registeredDate = new Date(registration.registeredAt).toLocaleDateString();
                const registrationData = [
                    registration.name,
                    registration.email,
                    registration.phone,
                    registration.usn,
                    registration.year,
                    registeredDate,
                    registration.payment_status || 'Unpaid'
                ];
                tableRows.push(registrationData);
            });
            
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 70,
                styles: { 
                    fontSize: 10,
                    cellPadding: 3,
                    lineColor: [220, 220, 220]
                },
                headStyles: {
                    fillColor: primaryMaroon, // Maroon header
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [250, 245, 245] // Very light pink/beige for alternate rows
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
        const worksheetData = filteredRegistrations.map(registration => ({
            Name: registration.name,
            Email: registration.email,
            Phone: registration.phone,
            USN: registration.usn,
            Year: registration.year,
            "Registration Date": new Date(registration.registeredAt).toLocaleDateString(),
            "Payment Status": registration.payment_status || 'Unpaid',
            "UTR Number": registration.utr_number || '-'
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        
        // Add header rows for title
        XLSX.utils.sheet_add_aoa(worksheet, [
            ["CORSIT - Club of Robotics"],
            ["Workshop Registrations 2025"],
            [""],  // Empty row
        ], { origin: "A1" });
        
        // Apply styles for header (this only affects cell contents, not styling)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, "Registrations");
        
        // Generate Excel file
        XLSX.writeFile(wb, "corsit_workshop_registrations.xlsx");
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
        <div className="min-h-screen bg-gray-900 text-gray-200 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2 text-[#ed5a2d]">
                            Workshop Registrations
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Manage and view candidate registrations for CORSIT workshops
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        {/* Search bar */}
                        <div className="relative flex-grow max-w-md">
                            <input
                                type="text"
                                placeholder="Search by name, email or USN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-700 border border-gray-600 text-gray-100 w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] transition-all"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

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
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-sm">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-12 h-12 border-t-4 border-[#ed5a2d] border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : filteredRegistrations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                                <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-400 text-lg">
                                    {searchTerm ? 'No registrations match your search criteria' : 'No workshop registrations found'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-700 text-left">
                                            <th 
                                                className="px-6 py-3 text-gray-300 font-medium text-sm cursor-pointer hover:bg-gray-600 transition-colors"
                                                onClick={() => requestSort('name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Name
                                                    {sortConfig.key === 'name' && (
                                                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-gray-300 font-medium text-sm">Email</th>
                                            <th className="px-6 py-3 text-gray-300 font-medium text-sm">Phone</th>
                                            <th className="px-6 py-3 text-gray-300 font-medium text-sm">USN</th>
                                            <th 
                                                className="px-6 py-3 text-gray-300 font-medium text-sm cursor-pointer hover:bg-gray-600 transition-colors"
                                                onClick={() => requestSort('year')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Year
                                                    {sortConfig.key === 'year' && (
                                                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-gray-300 font-medium text-sm cursor-pointer hover:bg-gray-600 transition-colors"
                                                onClick={() => requestSort('registeredAt')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Registered On
                                                    {sortConfig.key === 'registeredAt' && (
                                                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-gray-300 font-medium text-sm cursor-pointer hover:bg-gray-600 transition-colors"
                                                onClick={() => requestSort('payment_status')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Payment Status
                                                    {sortConfig.key === 'payment_status' && (
                                                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-gray-300 font-medium text-sm">Payment Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegistrations.map((registration, index) => (
                                            <tr 
                                                key={registration._id || index}
                                                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-100">{registration.name}</td>
                                                <td className="px-6 py-4 text-gray-300">{registration.email}</td>
                                                <td className="px-6 py-4 text-gray-300">{registration.phone}</td>
                                                <td className="px-6 py-4 font-mono text-gray-300">{registration.usn}</td>
                                                <td className="px-6 py-4 text-gray-300">{`${registration.year}${getYearSuffix(registration.year)} Year`}</td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {new Date(registration.registeredAt).toLocaleDateString('en-GB', { 
                                                        day: '2-digit', 
                                                        month: 'short', 
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        registration.payment_status === 'Paid' 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {registration.payment_status || 'Unpaid'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {registration.payment_status === 'Paid' ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-300 text-sm">
                                                                <span className="font-semibold">UTR:</span> {registration.utr_number}
                                                            </span>
                                                            {registration.payment_screenshot && (
                                                                <button 
                                                                    onClick={() => window.open(`${config.apiBaseUrl}/${registration.payment_screenshot.replace(/\\/g, '/')}`, '_blank')}
                                                                    className="mt-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                                                >
                                                                    View Receipt
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No payment made</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                    {/* Stats summary */}
                    {!loading && filteredRegistrations.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <StatCard 
                                title="Total Registrations" 
                                value={registrations.length} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                            />
                            
                            <StatCard 
                                title="Paid Registrations" 
                                value={registrations.filter(r => r.payment_status === 'Paid').length} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                            />
                            
                            <StatCard 
                                title="Unpaid Registrations" 
                                value={registrations.filter(r => r.payment_status !== 'Paid').length} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />
                            
                            <StatCard 
                                title="First Years" 
                                value={registrations.filter(r => r.year === '1').length} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                            />
                            
                            <StatCard 
                                title="Second Years" 
                                value={registrations.filter(r => r.year === '2').length} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                }
                            />
                            
                            <StatCard 
                                title="Third Years" 
                                value={registrations.filter(r => r.year === '3').length} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                }
                            />
                            
                            <StatCard 
                                title="Fourth Years" 
                                value={registrations.filter(r => r.year === '4').length} 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                }
                            />
                            
                            <StatCard 
                                title="Latest Registration" 
                                value={
                                    registrations.length > 0 
                                        ? new Date(
                                            Math.max(
                                                ...registrations.map(r => new Date(r.registeredAt).getTime())
                                            )
                                          ).toLocaleDateString() 
                                        : 'N/A'
                                } 
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper component for stats cards
const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-sm">
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

// Helper function for ordinal suffixes
const getYearSuffix = (year) => {
    const yearNum = parseInt(year);
    if (yearNum === 1) return "st";
    if (yearNum === 2) return "nd";
    if (yearNum === 3) return "rd";
    return "th";
};

export default AdminsGallery;