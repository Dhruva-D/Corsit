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

const WorkshopFeedbackReg = () => {
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
      const response = await axios.get(`${config.apiBaseUrl}/workshop-feedbacks`, {
        headers: {
          Authorization: token,
          isAdmin: 'true'
        }
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching workshop feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!feedbackToDelete) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiBaseUrl}/workshop-feedback/${feedbackToDelete._id}`, {
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
    
    try {
        doc.addImage(corsitLogo, 'PNG', 15, 15, imgWidth, imgHeight);
    } catch (e) {
        console.error("Logo failed to load for PDF", e);
    }

    doc.setFontSize(18);
    doc.setTextColor(237, 90, 45);
    doc.text('Workshop Feedback Report', 55, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const currentDate = new Date().toLocaleString();
    doc.text(`Generated on: ${currentDate}`, 55, 35);

    const tableData = feedbacks.map((feedback, index) => [
      index + 1,
      feedback.name || 'Anonymous',
      feedback.email || 'Not provided',
      feedback.workshopRating ?? '-',
      feedback.feedbackText || '-',
      feedback.favoriteTopic || '-',
      new Date(feedback.submittedAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: 50,
      head: [[
        'S.No',
        'Name',
        'Email',
        'Rating',
        'Feedback',
        'Favorite Topic',
        'Submitted On'
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [237, 90, 45] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 50 }
    });

    doc.save('workshop-feedback.pdf');
  };

  const exportToExcel = () => {
    const worksheetData = feedbacks.map((feedback, index) => ({
      'S.No': index + 1,
      'Name': feedback.name || 'Anonymous',
      'Email': feedback.email || 'Not provided',
      'Rating': feedback.workshopRating ?? '-',
      'Feedback': feedback.feedbackText || '-',
      'Favorite Topic': feedback.favoriteTopic || '-',
      'Suggestions': feedback.suggestions || '-',
      'Submitted On': new Date(feedback.submittedAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Workshop Feedback');
    XLSX.writeFile(workbook, 'workshop-feedback.xlsx');
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
      <div className="min-h-screen bg-[#080514] flex items-center justify-center text-white">
        <div className="text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080514] text-white px-4 pt-20 pb-10 sm:px-6 lg:px-8 lg:pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ed5a2d] mb-2">
              Workshop Feedback
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Total Feedbacks: <span className="font-semibold text-[#ed5a2d]">{feedbacks.length}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
            >
              Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
            >
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
                <table className="w-full table-auto text-sm text-left">
                  <thead className="bg-[#ed5a2d] text-white uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">S.No</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Favorite Topic</th>
                      <th className="px-4 py-3">Feedback</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {feedbacks.length > 0 ? (
                      feedbacks.map((feedback, index) => (
                        <tr key={feedback._id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-4 py-4 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-white">{feedback.name}</p>
                            <p className="text-xs text-gray-500">{feedback.email}</p>
                          </td>
                          <td className="px-4 py-4 text-yellow-400">★ {feedback.workshopRating}/5</td>
                          <td className="px-4 py-4 text-gray-300">{feedback.favoriteTopic}</td>
                          <td className="px-4 py-4 text-gray-300 max-w-xs">{feedback.feedbackText}</td>
                          <td className="px-4 py-4 text-gray-400">
                            {new Date(feedback.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => {
                                setFeedbackToDelete(feedback);
                                setShowDeleteModal(true);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-10 text-center text-gray-400">
                          No feedback submitted yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="xl:hidden space-y-4">
              {feedbacks.map((feedback, index) => (
                <div key={feedback._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{feedback.name}</h3>
                      <p className="text-yellow-400 text-sm">Rating: ★ {feedback.workshopRating}/5</p>
                    </div>
                    <button
                      onClick={() => {
                        setFeedbackToDelete(feedback);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-500 uppercase text-xs block">Favorite Topic</span> {feedback.favoriteTopic}</p>
                    <p><span className="text-gray-500 uppercase text-xs block">Feedback</span> {feedback.feedbackText}</p>
                    {feedback.suggestions && <p><span className="text-gray-500 uppercase text-xs block">Suggestions</span> {feedback.suggestions}</p>}
                    <p className="text-xs text-gray-500 mt-2">{new Date(feedback.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700"
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              >
                <h3 className="text-xl font-bold mb-4">Delete Feedback?</h3>
                <p className="text-gray-300 mb-6">Are you sure you want to delete {feedbackToDelete?.name}'s feedback?</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-700 rounded transition-all">Cancel</button>
                  <button onClick={handleDeleteFeedback} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-all" disabled={actionLoading}>
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

export default WorkshopFeedbackReg;
