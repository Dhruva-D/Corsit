import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

const RecruitmentFeedback = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [exportingPdf, setExportingPdf] = useState(false);

    useEffect(() => {
        // Check if user is authenticated as admin
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/profile');
        } else {
            fetchCandidates();
        }
    }, [navigate]);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.apiBaseUrl}/recruitments-2025`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    isAdmin: 'true'
                }
            });
            setCandidates(response.data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            setError('Failed to load candidates. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPdf = async (candidate) => {
        try {
            setExportingPdf(true);
            setSelectedCandidate(candidate._id);
            
            const response = await axios.get(
                `${config.apiBaseUrl}/recruitments-2025/feedback-pdf/${candidate._id}`,
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        isAdmin: 'true'
                    },
                    responseType: 'blob'
                }
            );

            // Create a blob from the PDF Stream
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = `recruitment_feedback_${candidate.name.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setExportingPdf(false);
            setSelectedCandidate(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080514] flex items-center justify-center">
                <div className="text-[#ed5a2d] text-xl">Loading candidates...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080514] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#ed5a2d] mb-4">
                        CORSIT Recruitment 2025 - Candidate Feedback Forms
                    </h1>
                    <p className="text-gray-300">
                        Export interview feedback forms for candidates in PDF format
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                <div className="bg-[#1a1625] rounded-lg shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#2a2435] border-b border-[#ed5a2d]/20">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#ed5a2d]">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#ed5a2d]">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#ed5a2d]">
                                        Phone
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#ed5a2d]">
                                        Year
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#ed5a2d]">
                                        Branch
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#ed5a2d]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ed5a2d]/10">
                                {candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                                            No candidates found
                                        </td>
                                    </tr>
                                ) : (
                                    candidates.map((candidate) => (
                                        <tr 
                                            key={candidate._id} 
                                            className="hover:bg-[#2a2435] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {candidate.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {candidate.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {candidate.phone}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {candidate.year}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {candidate.branch}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleExportPdf(candidate)}
                                                    disabled={exportingPdf && selectedCandidate === candidate._id}
                                                    className="bg-[#ed5a2d] text-white px-4 py-2 rounded-lg hover:bg-[#ff6b3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                                >
                                                    {exportingPdf && selectedCandidate === candidate._id 
                                                        ? 'Exporting...' 
                                                        : 'Export PDF'
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Admin Panel
                    </button>
                    <div className="text-gray-400 text-sm">
                        Total Candidates: {candidates.length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentFeedback;
