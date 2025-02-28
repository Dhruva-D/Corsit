import React from "react";
import dean from '../../assets/mentors/dean.jpeg';
import mentor from '../../assets/mentors/mentor.jpeg';
import one from '../../assets/founders/team1a.jpg';
import two from '../../assets/founders/team1b.jpg';
import three from '../../assets/founders/team1c.jpg';

const About = () => {
  return (
    <div className="bg-gradient-to-b from-black via-[#1a1a1a] to-black text-white py-20">
      <div className="flex justify-center text-5xl font-semibold mb-20">About Us</div>
      
      <div className="flex justify-center items-center w-[80%] mx-auto my-20 gap-x-10">
        <div className="w-[55%]">
          <img src="https://placehold.co/700x500.png" className="rounded-xl shadow-lg" alt="About Us" />
        </div>
        <div className="w-[45%] text-xl leading-8">
          <p className="text-gray-300">
            CORSIT, the robotics club of SIT, is a vibrant community of passionate robotics enthusiasts dedicated to learning, building, and innovating together. Since its inception in 2006, the club has organized national-level workshops and actively competed in prestigious events across the country. As the official hub for robotics activities at SIT, CORSIT provides students with hands-on experience, fostering creativity and technical excellence. With a mission to inspire and empower future innovators, the club continues to push the boundaries of robotics through collaboration and practical learning.
          </p>
        </div>
      </div>
      
      <div className="text-center text-5xl font-semibold mt-20">Mentors</div>
      <div className="flex justify-center w-[80%] mx-auto mt-10 gap-10 flex-wrap">
        {[{ img: dean, name: "Dr. V Siddeswara Prasad", role: "Robotics Lab Co-ordinator" },
          { img: mentor, name: "Sridhara H S", role: "Robotics Lab Mentor" }].map((person, index) => (
          <div key={index} className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl shadow-lg p-6 text-center w-72 h-96 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50">
            <div className="w-40 h-40 mx-auto mb-4">
              <img src={person.img} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-orange-500 shadow-md" />
            </div>
            <h2 className="text-xl font-bold text-orange-400">{person.name}</h2>
            <p className="text-sm text-gray-300 mt-1">{person.role}</p>
          </div>
        ))}
      </div>

      <div className="text-center text-5xl font-semibold mt-20">Founders</div>
      <div className="flex justify-center w-[80%] mx-auto mt-10 gap-10 flex-wrap">
        {[{ img: one, name: "Kiran B K", role: "Product Owner at Bosch Global Software" },
          { img: two, name: "Shivaswaroop P", role: "Procurement Specialist at ZF Group" },
          { img: three, name: "Divyanshu Sahay", role: "Firmware Engineer at Intel Corporation" }].map((person, index) => (
          <div key={index} className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl shadow-lg p-6 text-center w-72 h-96 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50">
            <div className="w-40 h-40 mx-auto mb-4">
              <img src={person.img} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-orange-500 shadow-md" />
            </div>
            <h2 className="text-xl font-bold text-orange-400">{person.name}</h2>
            <p className="text-sm text-gray-300 mt-1">{person.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
