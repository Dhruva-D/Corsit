import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAuth from './AdminAuth';

const AdminsGallery = () => {
    const navigate = useNavigate();
    const [showAdminModal, setShowAdminModal] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            setShowAdminModal(true);
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
            setShowAdminModal(false);
        }
    }, []);

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
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-2xl p-12 text-center relative overflow-hidden">
                    {/* Background Animation */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ed5a2d] to-[#ff6b3d] opacity-10 animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2VkNWEyZCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] animate-[grain_8s_steps(10)_infinite]"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold text-[#ed5a2d] mb-8 animate-fadeIn">
                            Admins Gallery
                        </h1>
                        <div className="relative">
                            <div className="flex flex-col items-center justify-center space-y-8">
                                {/* Animated Construction Icon */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#ed5a2d] to-[#ff6b3d] opacity-20 animate-ping absolute inset-0"></div>
                                    <div className="w-32 h-32 rounded-full border-4 border-[#ed5a2d] relative flex items-center justify-center">
                                        <svg className="w-16 h-16 text-[#ed5a2d] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-4 animate-fadeInUp">
                                    <p className="text-3xl font-bold text-gray-300 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
                                        Under Construction
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#ed5a2d] to-[#ff6b3d] animate-progressBar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add custom keyframes for animations */}
            <style jsx>{`
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0) }
                    10% { transform: translate(-5%, -5%) }
                    20% { transform: translate(-10%, 5%) }
                    30% { transform: translate(5%, -10%) }
                    40% { transform: translate(-5%, 15%) }
                    50% { transform: translate(-10%, 5%) }
                    60% { transform: translate(15%, 0) }
                    70% { transform: translate(0, 10%) }
                    80% { transform: translate(-15%, 0) }
                    90% { transform: translate(10%, 5%) }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes progressBar {
                    0% { width: 0; }
                    50% { width: 70%; }
                    100% { width: 90%; }
                }
            `}</style>
        </div>
    );
};

export default AdminsGallery; 