import React from 'react';
import { NavLink } from 'react-router-dom';

import rc1 from '../../assets/events/robocor/1.png';
import rc2 from '../../assets/events/robocor/2.png';
import rc3 from '../../assets/events//robocor/3.png';

import re1 from '../../assets/events/roboexpo/1.jpg';
import re2 from '../../assets/events/roboexpo/2.jpg';
import re3 from '../../assets/events/roboexpo/3.jpg';

import ws1 from '../../assets/events/workshop/1.jpg';
import ws2 from '../../assets/events/workshop/2.jpg';
import ws3 from '../../assets/events/workshop/3.jpg';

import hc1 from '../../assets/events/hackathon/1.jpg';
import hc2 from '../../assets/events/hackathon/2.jpg';
import hc3 from '../../assets/events/hackathon/3.jpg';

const eventsData = [
  {
    title: 'Robotics Workshop',
    description: 'CORSIT offers free workshops on IoT, Arduino, cloud, and more, providing students with hands-on experience in building basic bots such as LFR, Bluetooth, and obstacle-avoiding bots. Participants learn to code and use different components to program the bot\'s brain. The club also conducts a paid workshop where a mentor guides students on emerging technologies with a mix of studio practice and lectures. The workshop aims to enhance practical skills and teach the theory and context behind the practice.',
    images: [
      ws1,
      ws2,
      ws3
    ],
    register: true
  },
  {
    title: 'RoboCor',
    description: 'Robocor, a nationally renowned Robotics Competition, which is one of the biggest events in Karnataka. It provides a platform for participants to showcase their innovative designs and compete for glory. In Robocor, the team has successfully organized several events such as Dcode, Spardha, Rugged Rage, Robo Soccer, Arduino Clash, Binary Rash, Project Symposium, Paper Presentation, and Init_Rc.',
    images: [
      rc1,
      rc2,
      rc3
    ],
  },
  {
    title: 'RoboExpo',
    description: 'ROBOEXPO is an annual event organized by the Robotics club of SIT CORSIT. The primary objective is to introduce the club and its activities to the newcomers by displaying the bots that the members have created over the year. The event showcases various bots such as Line Follower Robots (LFR), Roboracer, Gesture controlled bots, Bluetooth controlled bots, etc. The exhibition provides students with an opportunity to witness and understand the workings of these bots up close. It serves as an excellent platform for the Robotics club to attract new members who are interested in this field.',
    images: [
      re1,
      re2,
      re3
    ]
  },
  
  {
    title: 'Hackathon',
    description: 'CORSIT, the Robotics club of SIT, conducts an annual 12-hour hackathon since 2017, where students collaborate to find innovative solutions to real-world problems in areas such as IoT, cybersecurity, blockchain, and data science etc. The event provides a platform for teams to compete for exciting cash prizes and recognition. The hackathon aims to foster creativity, teamwork, and problem-solving skills among students.',
    images: [
      hc2,
      hc1,
      hc3
    ]
  }
];

const Events = () => {
  return (
    <div className='min-h-screen bg-[#272928] py-24 px-4 sm:px-6 md:py-36'>
      <div className='text-center mb-12 sm:mb-16'>
        <h2 className='text-5xl sm:text-7xl font-bold text-[#ed5a2d] tracking-tight'>Our Events</h2>
      </div>

      <div className='max-w-7xl mx-auto space-y-24 sm:space-y-52'>
        {eventsData.map((event, index) => (
          <div
            key={index}
            className={`relative flex flex-col md:flex-row items-center md:items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 sm:gap-16 md:gap-24 py-12 sm:py-16`}
          >
            {/* Text on the left for mobile, maintains original order for large screens */}
            <div className='w-full text-center md:text-left md:w-3/5 p-6 sm:p-8 md:p-12 order-1 md:order-none'>
              <h3 className='text-4xl sm:text-6xl font-semibold text-[#ed5a2d]'>{event.title}</h3>
              <p className='text-[#f7ffff] mt-4 text-lg sm:text-xl leading-relaxed'>{event.description}</p>
              {event.register && (
                <NavLink
                  to='/register'
                  className='mt-6 inline-block border-2 border-[#ed5a2d] text-[#ed5a2d] px-10 sm:px-14 py-3 sm:py-4 rounded-3xl text-lg sm:text-xl font-semibold transition duration-300 hover:bg-[#ed5a2d] hover:text-white hover:border-4 hover:shadow-lg'
                >
                  Register
                </NavLink>
              )}
            </div>

            {/* Smaller image cluster in mobile mode */}
            <div className='w-full sm:w-3/5 md:w-2/5 grid grid-cols-2 gap-2 sm:gap-4 relative order-2 md:order-none'>
              {event.images.map((img, imgIndex) => (
                <img
                  key={imgIndex}
                  src={img}
                  alt={`${event.title} ${imgIndex + 1}`}
                  className={`object-cover rounded-xl shadow-lg w-32 h-32 sm:w-72 sm:h-72 transition-transform duration-300
                      ${imgIndex === 0 ? 'rotate-[-10deg] translate-x-10 translate-y-1 sm:rotate-[-6deg] sm:translate-x-4 sm:translate-y-4 z-10' : ''}  
                      ${imgIndex === 1 ? 'rotate-[8deg] -translate-x-8 translate-y-8 sm:rotate-[8deg] sm:-translate-x-6 sm:-translate-y-2 z-20' : ''}  
                      ${imgIndex === 2 ? 'rotate-[8deg] translate-x-13 translate-y-[-10%] sm:rotate-[6deg] sm:translate-x-28 sm:translate-y-[-10%] z-0' : ''}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default Events;
