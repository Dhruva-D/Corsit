import React, { useEffect } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { NavLink } from 'react-router-dom';
import lfr from '../../assets/home/lfr.jpg';
import gesture from '../../assets/home/gcr.jpg';
import smartHome from '../../assets/home/sha.webp';

const Home = () => {
  const [text] = useTypewriter({
    words: ['Robotics', 'AI & ML', 'Embedded Systems', 'Arduino', 'Mechatronics'],
    loop: true,
    deleteSpeed: 70,
    typeSpeed: 100,
  });

  return (
    <div className="relative text-[#f7ffff] flex flex-col overflow-x-hidden pt-28">
      <div className="zero h-screen mb-20 mt-[-40px] relative z-10 flex items-center justify-center">
        <div className='relative w-[100vw] h-[100vh]'>
          <spline-viewer url="https://prod.spline.design/8Q-TXZHyF66OklDE/scene.splinecode"></spline-viewer>
        </div>
        
        {/* Main Hero Content - Centered for all devices */}
        <div className="absolute top-[28vh] inset-x-0 flex flex-col items-center justify-center text-center z-20">
          {/* CORSIT Title - Centered on all devices */}
          <div className="text-[#ed5a2d] text-5xl md:text-7xl font-bold mb-4">
            CORSIT
          </div>
          
          {/* "Learn With Us" Text */}
          <div className="text-white text-xl md:text-2xl font-medium mb-4 tracking-wider">
            Learn With Us
          </div>
          
          {/* Typewriter Text - Centered on all devices */}
          <div className="text-[#f7ffff] text-2xl md:text-4xl font-bold tracking-wide bg-black/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/10">
            <span>{text}</span>
            <Cursor cursorStyle="_" />
          </div>
        </div>
      </div>

      <div id="one" className="relative z-10 py-20 md:py-36 bg-opacity-80 bg-[#191a1a] backdrop-blur-md text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl text-[#ed5a2d] font-bold mb-4">Our Events</h2>
            <p className="text-lg text-gray-300">Join us in our exciting robotics events and workshops</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {[
              {
                date: 'Coming Soon',
                title: 'RoboCor',
                description: 'The ultimate battleground for innovation, where robots clash and creativity thrives!',
                location: '📍 SIT Campus',
                status: 'closed'
              },
              {
                date: '11 May 2025',
                title: 'Robotics Workshop',
                description: 'Learn the basics of robotics and automation in this hands-on workshop.',
                location: '📍 Workshop Hall',
                status: 'open'
              },
              {
                date: 'Coming Soon',
                title: 'RoboExpo',
                description: 'A showcase of cutting-edge robotics, AI, and automation innovations.',
                location: '📍 Birla Auditorium',
                status: 'closed'
              },
            ].map((event, index) => (
              <div key={index} className="relative h-[400px] w-full rounded-xl p-10 bg-gradient-to-br from-[#1a1a1a80] to-[#22222280] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] border-4 border-[#ed5a2d40] flex flex-col items-center text-center justify-center backdrop-blur-md bg-opacity-80">
                <h3 className="text-4xl font-extrabold text-white mb-4">{event.title}</h3>
                <p className="text-gray-300 text-lg">{event.description}</p>
                <p className="text-[#ed5a2d] text-sm font-semibold tracking-widest mt-4">{event.date}</p>
                <p className="text-gray-400 text-sm">{event.location}</p>
                
                {event.status === 'open' ? (
                  <NavLink to="/register" onClick={() => window.scrollTo(0, 0)}>
                    <button className="mt-6 bg-gradient-to-r from-[#ed5a2d] to-orange-500 hover:from-orange-500 hover:to-[#ed5a2d] text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-110">
                      Register Now
                    </button>
                  </NavLink>
                ) : (
                  <div className="mt-6 bg-gray-700 text-gray-300 font-bold py-2 px-6 rounded-full shadow-md">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      Registration Closed
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="two" className="relative z-10 py-20 md:py-36 bg-opacity-80 bg-[#272928] backdrop-blur-md text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl text-[#ed5a2d] font-bold mb-4">Our Projects</h2>
            <p className="text-lg text-gray-300">Exploring the boundaries of innovation through robotics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {[
              {
                title: 'Line Following Robot',
                description: 'An autonomous robot that follows a path using sensors.',
                tags: ['Arduino', 'Sensors'],
                image: lfr,
              },
              {
                title: 'Gesture Controlled Bot',
                description: 'A robot that responds to hand gestures using OpenCV.',
                tags: ['Python', 'OpenCV'],
                image: gesture,
              },
              {
                title: 'Smart Home Automation',
                description: 'IoT-based home automation for energy efficiency.',
                tags: ['IoT', 'NodeMCU'],
                image: smartHome,
              },
            ].map((project, index) => (
              <div key={index} className="relative h-[500px] w-full rounded-xl bg-gradient-to-br from-[#1a1a1a80] to-[#22222280] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] border-4 border-[#ed5a2d40] flex flex-col items-center text-center overflow-hidden backdrop-blur-md">
                <div className="p-4 w-full">
                  <img src={project.image} className="w-full h-56 object-cover rounded-lg" alt={project.title} />
                </div>
                <div className="px-6 pb-6 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-300 text-lg">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#ed5a2d] text-white px-3 py-1 rounded-full text-[14px]">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div id="three" className="bg-[#191a1a] relative z-10 py-10 text-center text-white">
        Photo Gallery
      </div> */}
    </div>
  );
};

export default Home;
