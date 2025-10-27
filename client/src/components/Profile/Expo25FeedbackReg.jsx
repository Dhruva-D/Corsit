import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import config from '../../config';
import AdminAuth from './AdminAuth';
import corsitLogo from '../../assets/logo.png';

const Expo25FeedbackReg = () => {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      setShowAdminModal(true);
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      setShowAdminModal(false);
      fetchFeedbacks();
    }
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.apiBaseUrl}/expo25-feedback`, {
        headers: {
          Authorization: token,
          isAdmin: 'true'
        }
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!feedbackToDelete) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiBaseUrl}/expo25-feedback/${feedbackToDelete._id}`, {
        headers: {
          Authorization: token,
          isAdmin: 'true'
        }
      });
      setFeedbacks((prev) => prev.filter((item) => item._id !== feedbackToDelete._id));
      setShowDeleteModal(false);
      setFeedbackToDelete(null);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete the feedback. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    const imgWidth = 30;
    const imgHeight = 30;
    doc.addImage(corsitLogo, 'PNG', 15, 15, imgWidth, imgHeight);

    doc.setFontSize(18);
    doc.setTextColor(237, 90, 45);
    doc.text('RoboExpo 2025 Feedback', 55, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const currentDate = new Date().toLocaleString();
    doc.text(`Generated on: ${currentDate}`, 55, 35);

    const tableData = feedbacks.map((feedback, index) => [
      index + 1,
      feedback.branch ?? '-',
      feedback.eventRating ?? '-',
      feedback.favoriteProject ?? '-',
      feedback.howHeard ?? '-',
      (feedback.suggestions || '-').substring(0, 50) + (feedback.suggestions?.length > 50 ? '...' : ''),
      new Date(feedback.submittedAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: 50,
      head: [[
        'S.No',
        'Branch',
        'Rating',
        'Favorite Project',
        'How Heard',
        'Suggestions',
        'Submitted On'
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [237, 90, 45] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 50 }
    });

    doc.save('roboexpo-2025-feedback.pdf');
  };

  const exportToExcel = () => {
    const worksheetData = feedbacks.map((feedback, index) => ({
      'S.No': index + 1,
      'Branch': feedback.branch ?? '-',
      'Rating': feedback.eventRating ?? '-',
      'Favorite Project': feedback.favoriteProject ?? '-',
      'How Heard': feedback.howHeard ?? '-',
      'Suggestions': feedback.suggestions || '-',
      'Submitted On': new Date(feedback.submittedAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RoboExpo 2025 Feedback');
    XLSX.writeFile(workbook, 'roboexpo-2025-feedback.xlsx');
  };

  const handleAdminAuth = (success) => {
    if (success) {
      setIsAuthenticated(true);
      setShowAdminModal(false);
      fetchFeedbacks();
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
    <div className="min-h-screen bg-[#080514] text-white px-4 pt-20 pb-10 sm:px-6 lg:px-8 lg:pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ed5a2d] mb-2">
              RoboExpo 2025 Feedback
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Total Feedback: <span className="font-semibold text-[#ed5a2d]">{feedbacks.length}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed5a2d]"></div>
          </div>
        ) : (
          <>
            <div className="hidden xl:block bg-gray-800/60 rounded-lg shadow-xl overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-[#ed5a2d]">
                    <tr>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">S.No</th>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">Branch</th>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">Rating</th>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">Favorite Project</th>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">How Heard</th>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">Suggestions</th>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">Submitted</th>
                      <th className="px-3 py-3 text-left font-semibold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {feedbacks.length > 0 ? (
                      feedbacks.map((feedback, index) => (
                        <tr key={feedback._id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-3 py-4 text-gray-300">{index + 1}</td>
                          <td className="px-3 py-4 text-white font-medium">{feedback.branch}</td>
                          <td className="px-3 py-4 text-gray-300">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span>{feedback.eventRating}/5</span>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-gray-300">{feedback.favoriteProject}</td>
                          <td className="px-3 py-4 text-gray-300">{feedback.howHeard}</td>
                          <td className="px-3 py-4 text-gray-300 max-w-xs truncate">
                            {feedback.suggestions || 'No suggestions'}
                          </td>
                          <td className="px-3 py-4 text-gray-300">
                            {new Date(feedback.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-4">
                            <button
                              onClick={() => {
                                setFeedbackToDelete(feedback);
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
                        <td colSpan="8" className="px-3 py-10 text-center text-gray-400">
                          No feedback found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="xl:hidden space-y-4">
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{feedback.branch}</h3>
                        <p className="text-[#ed5a2d] text-sm font-medium">#{index + 1}</p>
                      </div>
                      <button
                        onClick={() => {
                          setFeedbackToDelete(feedback);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-all"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400 uppercase tracking-wide text-xs">Rating</span>
                        <p className="text-white font-medium flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          {feedback.eventRating}/5
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase tracking-wide text-xs">Favorite Project</span>
                        <p className="text-white font-medium">{feedback.favoriteProject}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase tracking-wide text-xs">How Heard</span>
                        <p className="text-white font-medium">{feedback.howHeard}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase tracking-wide text-xs">Submitted</span>
                        <p className="text-white font-medium">
                          {new Date(feedback.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-400 uppercase tracking-wide text-xs">Suggestions</span>
                        <p className="text-white font-medium">{feedback.suggestions || 'No suggestions'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
                  No feedback found
                </div>
              )}
            </div>
          </>
        )}

        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 rounded-lg p-6 sm:p-8 w-full max-w-md border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Delete Feedback</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this feedback from{' '}
                  <span className="text-[#ed5a2d] font-semibold">{feedbackToDelete?.branch}</span>? This action cannot be
                  undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setFeedbackToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-all"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteFeedback}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all disabled:opacity-60"
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

export default Expo25FeedbackReg;
