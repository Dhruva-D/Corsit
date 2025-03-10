import React from 'react';
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
    <div className="relative text-[#f7ffff] flex flex-col overflow-x-hidden">
      <div className="zero h-screen mb-20 mt-[-40px] relative z-10">
        <spline-viewer url="https://prod.spline.design/8Q-TXZHyF66OklDE/scene.splinecode"></spline-viewer>
        <div className="absolute top-[40vh] right-[24vw] text-[#ed5a2d] text-7xl font-bold z-20">
          <div>CORSIT</div>
        </div>
        <div className="absolute top-[48vh] left-[74vw] -translate-x-[90%] text-[#f7ffff] text-4xl font-bold z-20">
          <span>{text}</span>
          <Cursor />
        </div>
      </div>

      <div id="one" className="relative z-10 py-36 bg-[#191a1a] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-6xl text-[#ed5a2d] font-bold mb-4">Our Events</h2>
            <p className="text-lg">Join us in our exciting robotics events and workshops</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                date: 'Date',
                title: 'RoboExpo',
                description: 'A showcase of cutting-edge robotics, AI, and automation innovations.',
                location: '📍 Birla Auditorium',
                icon: '📦',
              },
              {
                date: 'Date',
                title: 'Robotics Workshop',
                description: 'Learn the basics of robotics and automation in this hands-on workshop.',
                location: '📍 Location',
                icon: '💡',
              },
              {
                date: 'Date',
                title: 'RoboCor',
                description: 'The ultimate battleground for innovation, where robots clash and creativity thrives!',
                location: '📍 SIT',
                icon: '🖱️',
              },
            ].map((event, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] h-[350px] border border-[#ed5a2d] rounded-2xl shadow-lg overflow-hidden p-6 text-center backdrop-blur-md bg-opacity-80 relative transition-all duration-300 hover:scale-[1.05] hover:border-orange-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#ed5a2d30] to-transparent opacity-20"></div>

                <div className="text-6xl mb-4">{event.icon}</div>
                <h3 className="text-2xl font-extrabold text-white mb-2">{event.title}</h3>
                <p className="text-gray-300 text-lg mb-4">{event.description}</p>
                <p className="text-[#ed5a2d] text-sm font-semibold tracking-widest">{event.date}</p>
                <p className="text-gray-400 text-sm mb-4">{event.location}</p>

                <NavLink to="/register" onClick={() => window.scrollTo(0, 0)}>
                  <button className="bg-gradient-to-r from-[#ed5a2d] to-orange-500 hover:from-orange-500 hover:to-[#ed5a2d] text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-110">
                    Register Now
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="two" className="relative z-10 py-36 bg-[#272928] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-6xl text-[#ed5a2d] font-bold mb-4">Our Projects</h2>
            <p className="text-lg">Exploring the boundaries of innovation through robotics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
              <div
                key={index}
                className="bg-[#1f1f1f] border-3 border-[#ed5a2d] rounded-2xl overflow-hidden shadow-lg transition hover:scale-105 duration-300"
              >
                <img src={project.image} className="w-full h-72 object-cover" alt={project.title} />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-lg mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#ed5a2d] text-white px-3 py-1 rounded-full text-[15px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="three" className="bg-[#191a1a] relative z-10 py-10 text-center text-white">
        Photo Gallery
      </div>
    </div>
  );
};

export default Home;
