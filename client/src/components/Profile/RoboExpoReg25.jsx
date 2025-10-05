import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import config from '../../config';
import AdminAuth from './AdminAuth';
import corsitLogo from '../../assets/logo.png';

const RoboExpoReg25 = () => {
    const navigate = useNavigate();
    const [showAdminModal, setShowAdminModal] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [registrationToDelete, setRegistrationToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

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
            const response = await axios.get(`${config.apiBaseUrl}/roboexpo-registrations`, {
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

    const handleDeleteRegistration = async (registrationId) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${config.apiBaseUrl}/roboexpo-registrations/${registrationId}`, {
                headers: {
                    Authorization: token,
                    isAdmin: 'true'
                }
            });
            
            // Remove the deleted registration from the state
            setRegistrations(prev => prev.filter(reg => reg._id !== registrationId));
            setShowDeleteModal(false);
            setRegistrationToDelete(null);
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Error deleting registration. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Add logo
        const imgWidth = 30;
        const imgHeight = 30;
        doc.addImage(corsitLogo, 'PNG', 15, 15, imgWidth, imgHeight);
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(237, 90, 45); // Orange color
        doc.text('RoboExpo 2025 - Registration Report', 55, 25);
        
        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100);
        const currentDate = new Date().toLocaleDateString();
        doc.text(`Generated on: ${currentDate}`, 55, 35);
        
        // Prepare table data
        const tableData = registrations.map((reg, index) => [
            index + 1,
            reg.name,
            reg.usn.toUpperCase(),
            reg.phone,
            reg.email,
            reg.branch,
            new Date(reg.createdAt).toLocaleDateString()
        ]);
        
        // Add table
        autoTable(doc, {
            startY: 50,
            head: [['S.No', 'Name', 'USN', 'Phone', 'Email', 'Branch', 'Registered On']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [237, 90, 45] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 50 }
        });
        
        doc.save('roboexpo-registrations-2025.pdf');
    };

    const exportToExcel = () => {
        const worksheetData = registrations.map((reg, index) => ({
            'S.No': index + 1,
            'Name': reg.name,
            'USN': reg.usn.toUpperCase(),
            'Phone': reg.phone,
            'Email': reg.email,
            'Branch': reg.branch,
            'Registered On': new Date(reg.createdAt).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'RoboExpo Registrations');
        XLSX.writeFile(workbook, 'roboexpo-registrations-2025.xlsx');
    };

    const handleAdminAuth = (success) => {
        if (success) {
            setIsAuthenticated(true);
            setShowAdminModal(false);
            fetchRegistrations();
        } else {
            navigate('/');
        }
    };

    if (showAdminModal) {
        return <AdminAuth onAuth={handleAdminAuth} />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#080514] flex items-center justify-center">
                <div className="text-white text-xl">Access Denied</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080514] text-white p-30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#ed5a2d] mb-2">RoboExpo 2025 Registrations</h1>
                        <p className="text-gray-300">
                            Total Registrations: <span className="font-semibold text-[#ed5a2d]">{registrations.length}</span>
                        </p>
                    </div>
                    
                    {/* Export buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={exportToPDF}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed5a2d]"></div>
                    </div>
                ) : (
                    <>
                        {/* Registrations Table */}
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead className="bg-[#ed5a2d]">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">S.No</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">USN</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Phone</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Branch</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Registered On</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {registrations.length > 0 ? (
                                            registrations.map((registration, index) => (
                                                <tr key={registration._id} className="hover:bg-gray-700 transition-colors">
                                                    <td className="px-4 py-4 text-sm text-gray-300">{index + 1}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-white">{registration.name}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-300 font-mono">{registration.usn.toUpperCase()}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-300">{registration.phone}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-300">{registration.email}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-300">{registration.branch}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-300">
                                                        {new Date(registration.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <button
                                                            onClick={() => {
                                                                setRegistrationToDelete(registration);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-all"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                                                    No registrations found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
                                <p className="text-gray-300 mb-6">
                                    Are you sure you want to delete the registration for{' '}
                                    <span className="font-semibold text-[#ed5a2d]">
                                        {registrationToDelete?.name}
                                    </span>
                                    ? This action cannot be undone.
                                </p>
                                <div className="flex gap-4 justify-end">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setRegistrationToDelete(null);
                                        }}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-all"
                                        disabled={actionLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRegistration(registrationToDelete._id)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all disabled:opacity-50"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RoboExpoReg25;