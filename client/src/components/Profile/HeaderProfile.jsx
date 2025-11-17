import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
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

    // Fetch user data
    const fetchUserData = useCallback(async () => {
        try {
            const cachedData = sessionStorage.getItem('userData');
            if (cachedData) {
                setUserData(JSON.parse(cachedData));
                setIsLoading(false);
            }

            const response = await axios.get(`${config.apiBaseUrl}/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setUserData(response.data);
            sessionStorage.setItem('userData', JSON.stringify(response.data));
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
        fetchUserData();
    }, [fetchUserData]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('userData');
        logout();
        navigate('/');
    };

    const handleAdminClick = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        setShowAdminModal(true);
        setAdminDestination('/admin');
    };

    const handleWorkshopReg25Click = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        setShowAdminModal(true);
        setAdminDestination('/workshop-reg-25');
    };

    const handleRoboExpoRegClick = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        setShowAdminModal(true);
        setAdminDestination('/roboexpo-reg-25');
    };

    const handleRecruitmentsRegClick = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        setShowAdminModal(true);
        setAdminDestination('/recruitments-reg-25');
    };

    const handleRecruitmentFeedbackClick = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        setShowAdminModal(true);
        setAdminDestination('/recruitment-feedback');
    };

    const handleFeedbackRegClick = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        setShowAdminModal(true);
        setAdminDestination('/expo25-feedback-reg');
    };

    const handleAuthSuccess = () => {
        setShowAdminModal(false);
        navigate(adminDestination); // Ensure navigation happens
    };


    const navLinks = [
        { path: '/', label: 'HOME' },
        { path: '/events', label: 'EVENTS' },
        { path: '/recruitments25', label: 'RECRUITMENTS 2025' },
        { path: '/about', label: 'ABOUT' },
        { path: '/projects', label: 'PROJECTS' },
        { path: '/team', label: 'TEAM' },
        { path: '/alumni', label: 'ALUMNI' },
        { path: '/contact', label: 'CONTACT' },
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-[#272928] bg-opacity-95' : 'bg-black'}`}>
            <nav className='flex justify-between items-center w-[92%] mx-auto py-4'>
                <Link to='/' onClick={() => window.scrollTo(0, 0)}>
                    <img src={logo} alt='Logo' className='w-[3.5rem]' />
                </Link>

                <button className='lg:hidden text-white text-3xl' onClick={() => setNavOpen(!navOpen)}>
                    {navOpen ? <FiX /> : <FiMenu />}
                </button>

                <div className={`lg:flex flex-col lg:flex-row absolute lg:static bg-black lg:bg-transparent top-16 left-0 w-full lg:w-auto ${navOpen ? 'block' : 'hidden'} lg:flex`}>
                    <ul className='flex flex-col lg:flex-row items-center lg:gap-6 gap-4 text-lg py-4 lg:py-0'>
                        {navLinks.map(({ path, label }, index) => (
                            <li key={index}>
                                <NavLink to={path} onClick={() => { setNavOpen(false); window.scrollTo(0, 0); }} className='text-white hover:text-[#ed5a2d] px-4 py-2 block'>
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='relative'>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <img src={userData?.profilePhoto || '/default_profile.png'} alt='Profile' className='w-12 h-12 rounded-full border-2 border-[#ed5a2d] cursor-pointer' />
                    </button>
                    {dropdownOpen && (
                        <div className='absolute right-0 mt-2 w-52 shadow-lg bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg overflow-hidden z-50'>
                            <NavLink to='/profile' onClick={() => { setDropdownOpen(false); window.scrollTo(0, 0); }} className='block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d]'>Profile</NavLink>
                            <NavLink to='/edit-profile' onClick={() => { setDropdownOpen(false); window.scrollTo(0, 0); }} className='block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d]'>Edit Profile</NavLink>
                            <NavLink to='/change-password' onClick={() => { setDropdownOpen(false); window.scrollTo(0, 0); }} className='block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d]'>Change Password</NavLink>
                            <NavLink to="#" onClick={handleWorkshopReg25Click} className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200">Workshop Reg 2025</NavLink>
                            <NavLink to="#" onClick={handleRoboExpoRegClick} className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200">RoboExpo Reg 2025</NavLink>
                            <NavLink to="#" onClick={handleRecruitmentsRegClick} className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200">Recruitments Reg 2025</NavLink>
                            <NavLink to="#" onClick={handleRecruitmentFeedbackClick} className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200">Recruitment Feedback</NavLink>
                            <NavLink to="#" onClick={handleFeedbackRegClick} className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200">Feedback 2025</NavLink>
                            <NavLink to="#" onClick={handleAdminClick} className="block px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d] transition-all duration-200">Admin Page</NavLink>
                            <button onClick={handleLogout} className='block w-full text-left px-4 py-3 text-white hover:bg-gray-900 hover:text-[#ed5a2d]'>Logout</button>
                        </div>
                    )}
                </div>
            </nav>

            {showAdminModal && <AdminAuth isOpen={showAdminModal} onSuccess={handleAuthSuccess} onClose={() => setShowAdminModal(false)} />}
        </header>
    );
};

export default HeaderProfile;
