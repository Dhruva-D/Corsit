import React, { useState, useEffect, useCallback } from 'react'; 
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import axios from 'axios';
import config from '../../config';
import AdminAuth from './AdminAuth';

const HeaderProfile = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminDestination, setAdminDestination] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Memoize the fetch function
    const fetchUserData = useCallback(async () => {
        try {
            const cachedData = sessionStorage.getItem('userData');
            if (cachedData) {
                setUserData(JSON.parse(cachedData));
                setIsLoading(false);
                // Fetch fresh data in background
                const response = await axios.get(`${config.apiBaseUrl}/profile`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                const newData = response.data;
                setUserData(newData);
                sessionStorage.setItem('userData', JSON.stringify(newData));
            } else {
                const response = await axios.get(`${config.apiBaseUrl}/profile`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setUserData(response.data);
                sessionStorage.setItem('userData', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('userData');
        logout();
        navigate('/');
    };

    const handleAdminClick = () => {
        setShowAdminModal(true);
        setAdminDestination('/admin');
        setDropdownOpen(false);
    };

    const handleAdminGalleryClick = (e) => {
        e.preventDefault();
        setShowAdminModal(true);
        setAdminDestination('/admins-gallery');
        setDropdownOpen(false);
    };

    const handleAuthSuccess = () => {
        setShowAdminModal(false);
        navigate(adminDestination);
    };

    const navLinks = [
        { path: '/', label: 'HOME' },
        { path: '/events', label: 'EVENTS' },
        { path: '/about', label: 'ABOUT' },
        { path: '/projects', label: 'PROJECTS' },
        { path: '/team', label: 'TEAM' },
        { path: '/alumni', label: 'ALUMNI' },
        { path: '/contact', label: 'CONTACT' },
    ];

    // Show minimal header while loading
    if (isLoading) {
        return (
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-[#272928] bg-opacity-95' : 'bg-black'}`}>
                <nav className='flex justify-between items-center w-[92%] mx-auto py-4'>
                    <div>
                        <Link to='/' onClick={() => window.scrollTo(0, 0)}>
                            <div>
                                <img src={logo} alt='Logo' className='w-[3.5rem]' />
                            </div>
                        </Link>
                    </div>
                    <div className='flex items-center gap-8'>
                        <div className="w-12 h-12 rounded-full border-2 border-[#ed5a2d] animate-pulse bg-gray-700"></div>
                    </div>
                </nav>
            </header>
        );
    }

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-[#272928] bg-opacity-95' : 'bg-black'}`}>
                <nav className='flex justify-between items-center w-[92%] mx-auto py-4'>
                    <div>
                        <Link to='/' onClick={() => window.scrollTo(0, 0)}>
                            <div>
                                <img src={logo} alt='Logo' className='w-[3.5rem]' />
                            </div>
                        </Link>
                    </div>

                    <div className='flex items-center gap-8'>
                        <div className={`lg:static absolute lg:w-auto w-full lg:min-h-fit min-h-[60vh] left-0 ${navOpen ? 'top-[10%]' : 'top-[-100%]'}`}>
                            <ul className='flex lg:flex-row flex-col items-center lg:gap-[2vw] gap-10 text-[1.2rem]'>
                                {navLinks.map(({ path, label }, index) => (
                                    <li key={index}>
                                        <NavLink
                                            to={path}
                                            onClick={() => {
                                                window.scrollTo(0, 0);
                                                setNavOpen(false);
                                            }}
                                            className={({ isActive }) =>
                                                `block py-2 pr-4 pl-3 text-[1.2rem] duration-200 ${isActive ? 'text-[#ed5a2d]' : 'text-[#f7ffff]'} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-[#ed5a2d] lg:p-0`
                                            }
                                        >
                                            {label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2"
                            >
                                <img 
                                    src={userData?.profilePhoto ? `${config.apiBaseUrl}/${userData.profilePhoto}` : config.defaultProfileImage} 
                                    alt="Profile" 
                                    className='w-12 h-12 rounded-full border-2 border-[#ed5a2d] cursor-pointer transition-all duration-300 hover:scale-110'
                                    onError={(e) => e.target.src = "/default_profile.png"} 
                                />
                            </button>

                            {dropdownOpen && (
                                <div 
                                    className="absolute right-0 mt-2 w-52 shadow-lg bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg overflow-hidden z-50 transition-all duration-300"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <NavLink 
                                        to="/profile" 
                                        className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200"
                                    >
                                        Profile
                                    </NavLink>
                                    <NavLink 
                                        to="/edit-profile" 
                                        className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200"
                                    >
                                        Edit Profile
                                    </NavLink>
                                    <NavLink 
                                        to="/change-password" 
                                        className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200"
                                    >
                                        Change Password
                                    </NavLink>
                                    <NavLink 
                                        to="#" 
                                        onClick={handleAdminGalleryClick}
                                        className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200"
                                    >
                                        Admins Gallery
                                    </NavLink>
                                    <button 
                                        onClick={handleAdminClick} 
                                        className="block w-full text-left px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200"
                                    >
                                        Admin Page
                                    </button>
                                    <button 
                                        onClick={handleLogout} 
                                        className="block w-full text-left px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
            
            <AdminAuth 
                isOpen={showAdminModal} 
                onClose={() => setShowAdminModal(false)}
                onSuccess={handleAuthSuccess}
            />
        </>
    );
};

export default HeaderProfile;
