import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [bgColor, setBgColor] = useState('');
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (location.pathname === '/login') {
            setBgColor('#0d0f10');
        } else {
            setBgColor(location.pathname === '/' && !scrolled ? 'bg-black' : 'bg-[#272928] bg-opacity-95');
        }
    }, [location, scrolled]);

    const navLinks = [
        { path: '/', label: 'HOME' },
        { path: '/events', label: 'EVENTS' },
        { path: '/about', label: 'ABOUT' },
        { path: '/projects', label: 'PROJECTS' },
        { path: '/team', label: 'TEAM' },
        { path: '/alumni', label: 'ALUMNI' },
        { path: '/contact', label: 'CONTACT' },
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${bgColor}`}>
            <nav className='flex justify-between items-center w-[92%] mx-auto py-4'>
                <div>
                    <Link to='/' onClick={() => window.scrollTo(0, 0)}>
                        <div>
                            <img src={logo} alt='Logo' className='w-[3.5rem]' />
                        </div>
                    </Link>
                </div>

                <div>
                    <div className={`lg:static absolute lg:w-auto w-full lg:min-h-fit min-h-[60vh] left-0 ${navOpen ? 'top-[10%]' : 'top-[-100%]'}`}>
                        <ul className='flex lg:flex-row flex-col items-center lg:gap-[2vw] gap-10 text-[1.2rem]'>
                            {navLinks.map(({ path, label }, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={path}
                                        onClick={() => window.scrollTo(0, 0)}
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 text-[1.2rem] duration-200 ${isActive ? 'text-[#ed5a2d]' : 'text-[#f7ffff]'} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-[#ed5a2d] lg:p-0`
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                            <li>
                                <NavLink
                                    to="/login"
                                    onClick={() => window.scrollTo(0, 0)}
                                    className={({ isActive }) =>
                                        `block py-2 px-6 text-[1.2rem] duration-200 ${isActive ? 'bg-[#ed5a2d] text-white' : 'bg-transparent text-[#ed5a2d] border-2 border-[#ed5a2d]'} rounded-full hover:bg-[#ed5a2d] hover:text-white transition-all`
                                    }
                                >
                                    LOGIN
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
