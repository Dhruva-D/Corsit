import React from "react";
import team from "../../assets/team.jpg";
import dean from "../../assets/mentors/dean.jpeg";
import mentor from "../../assets/mentors/mentor.jpeg";
import one from "../../assets/founders/team1a.jpg";
import two from "../../assets/founders/team1b.jpg";
import three from "../../assets/founders/team1c.jpg";

const About = () => {
  return (
    <div className="bg-[#272928] text-white py-20 px-6 sm:px-4">
      <div className="text-center text-4xl sm:text-5xl text-[#ed5a2d] font-semibold mb-16">About Us</div>

      <div className="flex flex-col lg:flex-row justify-center items-center w-full lg:w-[80%] mx-auto px-3 mt-10 mb-20 gap-10">
        <div className="w-full lg:w-[55%]">
          <img src={team} className="rounded-xl shadow-lg w-full" alt="About Us" />
        </div>
        <div className="w-full lg:w-[45%] text-lg leading-8 text-gray-300">
          <p className="text-justify">
            CORSIT, the robotics club of SIT, is a vibrant community of passionate robotics enthusiasts dedicated to learning, building, and innovating together. Since its inception in 2006, the club has organized national-level workshops and actively competed in prestigious events across the country. As the official hub for robotics activities at SIT, CORSIT provides students with hands-on experience, fostering creativity and technical excellence. With a mission to inspire and empower future innovators, the club continues to push the boundaries of robotics through collaboration and practical learning.
          </p>
        </div>
      </div>

      <div className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Our Achievements
            </h2>
            <div className="h-1 w-20 bg-red-500 mx-auto mt-3"></div>
            <p className="text-md text-gray-300 mt-3">Celebrating our success stories and milestones</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { title: "IoT Track Prize in NMIT Hacks, 2024", award: "1st Rank" },
              { title: "INTERNAL SMART INDIA HACKATHON, 2023", award: "1st Rank" },
              { title: "KURUKSHETRA 13', IIT DELHI, IIT ROORKEE", award: "Technical Innovation" },
              { title: "Space Junk, BMSCE", award: "1st Prize" },
              { title: "IOT challenge IIT Bombay, 2019", award: "2nd Rank" },
              { title: "QUARK (LFR) at BITS Goa", award: "3rd Rank" },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-6 sm:p-8 w-full sm:w-80 h-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40"
              >
                <p className="text-xl font-semibold text-orange-400">{item.title}</p>
                <p className="text-lg text-gray-300 mt-2">{item.award}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-4xl sm:text-5xl text-[#ed5a2d] font-semibold mt-20 mb-10">Mentors</div>
      <div className="flex flex-wrap justify-center gap-8">
        {[
          { img: dean, name: "Dr. V Siddeswara Prasad", role: "Robotics Lab Co-ordinator" },
          { img: mentor, name: "Sridhara H S", role: "Robotics Lab Mentor" }
        ].map((person, index) => (
          <div key={index} className="p-6 sm:p-8 w-full sm:w-80 h-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg text-center hover:scale-105 hover:shadow-orange-500/40">
            <div className="w-40 h-40 sm:w-60 sm:h-60 mx-auto mb-4 rounded-xl overflow-hidden border-4 border-orange-500 shadow-md">
              <img className="w-full h-full object-cover" src={person.img} alt="Profile" />
            </div>
            <p className="text-xl font-semibold text-orange-400">{person.name}</p>
            <p className="text-lg text-gray-300 mt-2">{person.role}</p>
          </div>
        ))}
      </div>

      <div className="text-center text-4xl sm:text-5xl text-[#ed5a2d] font-semibold mt-20 mb-10">Founders</div>
      <div className="flex flex-wrap justify-center gap-8">
        {[
          { img: one, name: "Kiran B K", role: "Product Owner at Bosch Global Software" },
          { img: two, name: "Shivaswaroop P", role: "Procurement Specialist at ZF Group" },
          { img: three, name: "Divyanshu Sahay", role: "Firmware Engineer at Intel Corporation" }
        ].map((person, index) => (
          <div key={index} className="p-6 sm:p-8 w-full sm:w-80 h-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg text-center hover:scale-105 hover:shadow-orange-500/40">
            <div className="w-40 h-40 sm:w-60 sm:h-60 mx-auto mb-4 rounded-xl overflow-hidden border-4 border-orange-500 shadow-md">
              <img className="w-full h-full object-cover" src={person.img} alt="Profile" />
            </div>
            <p className="text-xl font-semibold text-orange-400">{person.name}</p>
            <p className="text-lg text-gray-300 mt-2">{person.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
