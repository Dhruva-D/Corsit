import React from "react";
import team from '../../assets/team.jpg';
import dean from '../../assets/mentors/dean.jpeg';
import mentor from '../../assets/mentors/mentor.jpeg';
import one from '../../assets/founders/team1a.jpg';
import two from '../../assets/founders/team1b.jpg';
import three from '../../assets/founders/team1c.jpg';

const About = () => {
  return (
    <div className="bg-[#272928] text-white py-40">
      <div className="flex justify-center text-6xl text-[#ed5a2d] font-semibold mb-20">About Us</div>

      <div className="flex justify-center items-center w-[80%] mx-auto mt-20 mb-40 gap-x-10">
        <div className="w-[55%]">
          <img src={team} className="rounded-xl shadow-lg" alt="About Us" />
        </div>
        <div className="w-[45%] text-xl leading-8">
          <p className="text-gray-300">
            CORSIT, the robotics club of SIT, is a vibrant community of passionate robotics enthusiasts dedicated to learning, building, and innovating together. Since its inception in 2006, the club has organized national-level workshops and actively competed in prestigious events across the country. As the official hub for robotics activities at SIT, CORSIT provides students with hands-on experience, fostering creativity and technical excellence. With a mission to inspire and empower future innovators, the club continues to push the boundaries of robotics through collaboration and practical learning.
          </p>
        </div>
      </div>

      <div className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Our Achievements
            </h2>
            <div className="h-1 w-24 bg-red-500 mx-auto mt-4"></div>
            <p className="text-lg text-gray-300 mt-4">
              Celebrating our success stories and milestones
            </p>
          </div>

          <div className="flex justify-center w-[80%] mx-auto mt-10 gap-16 flex-wrap">
            {[
              { title: "IoT Track Prize in NMIT Hacks, 2024", award: "1st Rank", year: "" },
              { title: "INTERNAL SMART INDIA HACKATHON, 2023", award: "1st Rank", year: "" },
              { title: "KURUKSHETRA 13', IIT DELHI, IIT ROORKEE", award: "Technical Innovation", year: "" },
              { title: "Space Junk, BMSCE", award: "1st Prize", year: "" },
              { title: "IOT challenge IIT Bombay, 2019", award: "2nd Rank", year: "" },
              { title: "QUARK (LFR) at BITS Goa", award: "3nd Rank", year: "" },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-8 w-80 h-[300px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40"
              >
                
                <p className="mt-11 text-2xl font-semibold text-orange-400">{item.title}</p>
                <p className="text-lg text-gray-300 mt-3">{item.award}</p>
                <p className="text-xl font-bold text-orange-500 mt-2">{item.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-5xl text-[#ed5a2d] font-semibold mt-40 mb-20">Mentors</div>

      <div className="flex justify-center w-[80%] mx-auto mt-10 gap-60 flex-wrap">
        {[
          { img: dean, name: "Dr. V Siddeswara Prasad", role: "Robotics Lab Co-ordinator" },
          { img: mentor, name: "Sridhara H S", role: "Robotics Lab Mentor" }
        ].map((person, index) => (
          <div
            key={index}
            className="group relative p-8 w-80 h-[450px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40"
          >
            <div className="w-60 h-60 mx-auto mb-6 rounded-xl overflow-hidden border-4 border-orange-500 shadow-md">
              <img className="w-full h-full object-cover" src={person.img} alt="Profile" />
            </div>
            <p className="mt-11 text-2xl font-semibold text-orange-400">{person.name}</p>
            <p className="text-lg text-gray-300 mt-3">{person.role}</p>
          </div>
        ))}
      </div>



      <div className="text-center text-5xl text-[#ed5a2d] font-semibold mt-40 mb-20">Founders</div>

      <div className="flex justify-center w-[80%] mx-auto mt-10 gap-32 flex-wrap">
        {[
          { img: one, name: "Kiran B K", role: "Product Owner at Bosch Global Software" },
          { img: two, name: "Shivaswaroop P", role: "Procurement Specialist at ZF Group" },
          { img: three, name: "Divyanshu Sahay", role: "Firmware Engineer at Intel Corporation" }
        ].map((person, index) => (
          <div
            key={index}
            className="group relative p-8 w-80 h-[450px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40"
          >
            <div className="w-60 h-60 mx-auto mb-6 rounded-xl overflow-hidden border-4 border-orange-500 shadow-md">
              <img className="w-full h-full object-cover" src={person.img} alt="Profile" />
            </div>
            <p className="mt-11 text-2xl font-semibold text-orange-400">{person.name}</p>
            <p className="text-lg text-gray-300 mt-3">{person.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
