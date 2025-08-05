import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '../common/LoadingSpinner';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';

const DESIGNATION_ORDER = {
    'First Year': 1,
    'Second Year': 2,
    'Third Year': 3,
    'Fourth Year': 4,
    'Digital Lead': 5,
    'Photoshop Lead': 6,
    'Tech Lead': 7,
    'Android Dev Lead': 8,
    'Web Dev Lead': 9,
    'Treasurer': 10,
    'Vice-Chairman': 11,
    'Chairman': 12
};

const DESIGNATION_OPTIONS = Object.keys(DESIGNATION_ORDER);

const Admin = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewImages, setPreviewImages] = useState({});
    const fileInputRefs = {
        profilePhoto: useRef(),
        projectPhoto: useRef(),
        abstractDoc: useRef()
    };
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated as admin
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/profile');
        } else {
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.apiBaseUrl}/admin/users`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    isAdmin: 'true'
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            instagram: user.instagram || '',
            designation: user.designation || 'Member',
            linkedin: user.linkedin || '',
            github: user.github || '',
            projectTitle: user.projectTitle || '',
            projectDescription: user.projectDescription || '',
        });
        setPreviewImages({
            profilePhoto: user.profilePhoto || null,
            projectPhoto: user.projectPhoto || null,
            abstractDoc: user.abstractDoc || null
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Set local preview
        setPreviewImages(prev => ({
            ...prev,
            [type]: URL.createObjectURL(file)
        }));
        
        // Create form data for this specific file
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            // Determine upload endpoint based on field type
            let uploadEndpoint = 'profile';
            if (type === 'projectPhoto') uploadEndpoint = 'project';
            if (type === 'abstractDoc') uploadEndpoint = 'abstract';
            
            // Upload file to Cloudinary through our API
            const response = await axios.post(
                `${config.apiBaseUrl}/api/upload/${uploadEndpoint}`, 
                formData, 
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            
            // Store the Cloudinary URL
            setFormData(prev => ({
                ...prev,
                [type]: response.data.imageUrl
            }));
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            setError(`Failed to upload ${type}. Please try again.`);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            // We're using formData object directly as we've already uploaded images to Cloudinary
            const response = await axios.put(
                `${config.apiBaseUrl}/admin/users/${editingUser._id}`,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        isAdmin: 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            setUsers(users.map(user => 
                user._id === editingUser._id ? response.data.user : user
            ));
            
            setSuccess('User updated successfully');
            setEditingUser(null);
            
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user. Please try again.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (userId) => {
        try {
            setLoading(true);
            await axios.put(
                `${config.apiBaseUrl}/admin/users/${userId}`,
                { adminAuthenticated: 'yes' },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        isAdmin: 'true'
                    }
                }
            );
            
            fetchUsers();
            setSuccess('User accepted successfully');
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (error) {
            console.error('Error accepting user:', error);
            setError('Failed to accept user. Please try again.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                setLoading(true);
                await axios.delete(
                    `${config.apiBaseUrl}/admin/users/${userId}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                            isAdmin: 'true'
                        }
                    }
                );
                
                setUsers(users.filter(user => user._id !== userId));
                setSuccess('User deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
                
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Failed to delete user. Please try again.');
                setTimeout(() => setError(''), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        const orderA = DESIGNATION_ORDER[a.designation || 'Member'] || 999;
        const orderB = DESIGNATION_ORDER[b.designation || 'Member'] || 999;
        return orderA - orderB;
    });

    const renderSocialLinks = (user) => (
        <div className="flex space-x-4 mt-2">
            {user.instagram && (
                <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400 transition-colors">
                    <FaInstagram size={20} />
                </a>
            )}
            {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
                    <FaLinkedin size={20} />
                </a>
            )}
            {user.github && (
                <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub size={20} />
                </a>
            )}
            {user.phone && (
                <a href={`tel:${user.phone}`} className="text-green-500 hover:text-green-400 transition-colors">
                    <FaPhone size={20} />
                </a>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 mb-8">
                    <h1 className="text-3xl font-bold text-[#ed5a2d] mb-2">Admin Dashboard</h1>
                    <p className="text-gray-300 mb-4">Welcome to the admin area. You have access to manage users and site content.</p>
                    
                    {error && (
                        <div className="bg-red-900 bg-opacity-50 border border-red-700 text-white px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-900 bg-opacity-50 border border-green-700 text-white px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-700 rounded-lg p-4 shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Total Users</h3>
                            <p className="text-3xl font-bold text-[#ed5a2d]">{users.length}</p>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4 shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Authenticated Users</h3>
                            <p className="text-3xl font-bold text-[#ed5a2d]">
                                {users.filter(user => user.adminAuthenticated === 'yes').length}
                            </p>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4 shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Pending Users</h3>
                            <p className="text-3xl font-bold text-[#ed5a2d]">
                                {users.filter(user => user.adminAuthenticated === 'no').length}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-800 rounded-lg p-6 shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-[#ed5a2d]">Members</h2>
                        
                        {loading && !editingUser ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedUsers.map((user) => (
                                    <div 
                                        key={user._id} 
                                        className={`bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] ${user.adminAuthenticated === 'yes' ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}
                                    >
                                        <div className="p-5">
                                            <div className="flex items-center mb-4">
                                                <img 
                                                    src={user.profilePhoto || config.defaultProfileImage} 
                                                    alt={user.name} 
                                                    className="w-16 h-16 rounded-full border-2 border-[#ed5a2d] mr-4 object-cover"
                                                    onError={(e) => {
                                                        console.log("Profile image failed to load in Admin panel, using default");
                                                        e.target.src = config.defaultProfileImage;
                                                        e.target.onerror = null; // Prevents infinite loop
                                                    }} 
                                                />
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                                    <p className="text-[#ed5a2d]">{user.designation || 'Member'}</p>
                                                    {renderSocialLinks(user)}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-4">
                                                <p className="text-gray-300"><span className="font-semibold">Email:</span> {user.email}</p>
                                                
                                                {user.projectTitle && (
                                                    <div className="mt-4 bg-slate-700 p-3 rounded-lg">
                                                        <h4 className="text-lg font-semibold text-[#ed5a2d]">Project</h4>
                                                        <p className="text-white">{user.projectTitle}</p>
                                                        <p className="text-gray-300 text-sm mt-1">{user.projectDescription}</p>
                                                        {user.projectPhoto && (
                                                            <img 
                                                                src={user.projectPhoto || config.defaultProjectImage}
                                                                alt="Project"
                                                                className="mt-2 rounded-lg w-full h-32 object-cover"
                                                                onError={(e) => {
                                                                    console.log("Project image failed to load in Admin panel, using default");
                                                                    e.target.src = config.defaultProjectImage;
                                                                    e.target.onerror = null; // Prevents infinite loop
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <p className="text-gray-300">
                                                    <span className="font-semibold">Status:</span> 
                                                    <span className={user.adminAuthenticated === 'yes' ? 'text-green-400 ml-1' : 'text-yellow-400 ml-1'}>
                                                        {user.adminAuthenticated === 'yes' ? 'Authenticated' : 'Pending'}
                                                    </span>
                                                </p>
                                            </div>
                                            
                                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4">
    {user.adminAuthenticated === 'no' && (
        <button 
            onClick={() => handleAccept(user._id)}
            className="group relative px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
            <span className="relative z-10">Accept</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </button>
    )}
    <button 
        onClick={() => handleEdit(user)}
        className="group relative px-4 py-2 bg-gradient-to-r from-[#ed5a2d] to-[#ff6b3d] hover:from-[#ff6b3d] hover:to-[#ed5a2d] text-white rounded-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
    >
        <span className="relative z-10">Edit</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b3d] to-[#ed5a2d] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
    </button>
    <button 
        onClick={() => handleReject(user._id)}
        className="group relative px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-rose-500 hover:to-red-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
    >
        <span className="relative z-10">Reject</span>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
    </button>
</div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4 overflow-y-auto">
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-2xl relative animate-fadeIn my-8">
                        <button 
                            onClick={() => setEditingUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-[#ed5a2d] mb-6">Edit Member</h2>
                        
                        {/* File Upload Preview Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-gray-300 mb-2">Profile Photo</label>
                                <div className="relative">
                                    <img 
                                        src={previewImages.profilePhoto || config.defaultProfileImage} 
                                        alt="Profile Preview"
                                        className="w-32 h-32 rounded-lg object-cover mb-2"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRefs.profilePhoto}
                                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRefs.profilePhoto.current.click()}
                                        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm w-full"
                                    >
                                        Change Photo
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Project Photo</label>
                                <div className="relative">
                                    <img 
                                        src={previewImages.projectPhoto || '/project-placeholder.png'} 
                                        alt="Project Preview"
                                        className="w-32 h-32 rounded-lg object-cover mb-2"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRefs.projectPhoto}
                                        onChange={(e) => handleFileChange(e, 'projectPhoto')}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRefs.projectPhoto.current.click()}
                                        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm w-full"
                                    >
                                        Change Photo
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Project Abstract</label>
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-lg bg-slate-700 flex flex-col items-center justify-center mb-2 p-2">
                                        {previewImages.abstractDoc ? (
                                            <>
                                                <span className="text-sm text-white text-center mb-1">Document Selected</span>
                                                <span className="text-xs text-gray-400 text-center break-all">
                                                    {fileInputRefs.abstractDoc.current?.files[0]?.name || 'Current: Abstract'}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-400">No Document</span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRefs.abstractDoc}
                                        onChange={(e) => handleFileChange(e, 'abstractDoc')}
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRefs.abstractDoc.current.click()}
                                        className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-lg transition-all duration-300 text-sm w-full transform hover:scale-105"
                                    >
                                        Change Document
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Designation</label>
                                <div className="relative">
                                    <select
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] appearance-none"
                                    >
                                        {DESIGNATION_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Instagram</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                                    placeholder="https://instagram.com/username"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">GitHub</label>
                                <input
                                    type="text"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                                    placeholder="https://github.com/username"
                                />
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Project Title</label>
                            <input
                                type="text"
                                name="projectTitle"
                                value={formData.projectTitle}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Project Description</label>
                            <textarea
                                name="projectDescription"
                                value={formData.projectDescription}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ed5a2d]"
                            ></textarea>
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Cancel
                            </button>
                            <LoadingButton
                                onClick={handleSave}
                                loading={loading}
                                loadingText="Saving changes..."
                                size="md"
                                className="px-6 py-2"
                            >
                                Save
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin; 