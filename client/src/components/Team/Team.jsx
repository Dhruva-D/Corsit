import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const designationOrder = [
  "Chairman", "Vice-Chairman", "Treasurer", "Web Dev Lead", "Android Dev Lead",
  "Tech Lead", "Photoshop Lead", "Digital Lead", "Fourth Year", "Third Year", "Second Year", "First Year", "Member"
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch("https://corsit-backend.onrender.com/team")
      .then((response) => response.json())
      .then((data) => {
        // Sort the team members based on the predefined order of designations
        const sortedTeam = data.sort((a, b) => {
          return designationOrder.indexOf(a.designation) - designationOrder.indexOf(b.designation);
        });
        setTeamMembers(sortedTeam);
      })
      .catch((error) => console.error("Error fetching team data:", error));
  }, []);

  return (
    <>
      <div className="w-full min-h-screen py-[7rem] px-4 z-50 bg-[#272928]">
        <h2 className="text-6xl text-[#ed5a2d] text-center font-bold tracking-tight sm:text-6xl">
          Our Team
        </h2>
        <div className="max-w-[1240px] my-20 mx-auto grid gap-8">

          <div className="grid grid-cols-2 gap-4">
            {teamMembers.slice(0, 2).map((person, i) => (
              <ProfileCard key={i} person={person} />
            ))}
          </div>

          <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-20">
            {teamMembers.slice(2).map((person, i) => (
              <ProfileCard key={i} person={person} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileCard = ({ person }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-80 h-96 bg-black/40 backdrop-blur-xl rounded-2xl border-[2px] border-[rgba(237,90,45,0.8)] shadow-[0_0_10px_rgba(237,90,45,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(237,90,45,0.8)] flex flex-col items-center p-6 hover:scale-105">
        <div className="relative w-44 h-44 rounded-full overflow-hidden border-[3px] shadow-md border-[rgba(237,90,45,0.8)]">
          <img className="w-full h-full object-cover" src={`https://corsit-backend.onrender.com/${person.profilePhoto}`} alt={person.name} />
        </div>
        <h1 className="mt-6 text-center text-2xl font-semibold text-white leading-7 tracking-tight">{person.name}</h1>
        <h3 className="text-center text-md text-gray-300 font-medium leading-6">{person.designation}</h3>
        <div className="mt-auto pb-4 flex justify-center space-x-3">
          <a target="_blank" href={person.linkedin} className="text-[1.9rem] text-gray-400 hover:text-blue-400 transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a target="_blank" href={person.github} className="text-[1.9rem] text-gray-400 hover:text-gray-300 transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href={`mailto:${person.email}`} className="text-[1.9rem] text-gray-400 hover:text-red-400 transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Team;
