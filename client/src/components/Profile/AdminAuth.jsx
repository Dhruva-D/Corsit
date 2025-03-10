import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const AdminAuth = ({ isOpen, onClose, onSuccess }) => {
    const [adminSecret, setAdminSecret] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${config.apiBaseUrl}/admin/auth`,
                { adminSecret },
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            );

            if (response.data.isAdmin) {
                localStorage.setItem('isAdmin', 'true');
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error('Admin auth error:', error);
            setError(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fadeIn">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-[#ed5a2d] mb-6">Admin Authentication</h2>
                
                {error && (
                    <div className="bg-red-900 bg-opacity-50 border border-red-700 text-white px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="adminSecret" className="block text-gray-300 mb-2">
                            Enter Admin Secret Code
                        </label>
                        <input
                            type="password"
                            id="adminSecret"
                            value={adminSecret}
                            onChange={(e) => setAdminSecret(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                            placeholder="Enter secret code"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#ed5a2d] hover:bg-[#ff6b3d] text-white font-bold py-3 px-4 rounded-lg transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </span>
                        ) : (
                            'Authenticate'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth; 