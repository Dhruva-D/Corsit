import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const designationOrder = [
  "Chairman", "Vice-Chairman", "Treasurer", "Web Dev Lead", "Android Dev Lead", 
  "Tech Lead", "Photoshop Lead", "Digital Lead", "Fourth Year", "Third Year", "Second Year", "First Year"
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/team")
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
      <div className="w-full py-[7rem] px-4 z-50 bg-[#080514]">
        <h2 className="text-5xl text-center font-bold tracking-tight sm:text-6xl">
          Our Team
        </h2>
        <div className="max-w-[1240px] my-20 mx-auto grid gap-8">

          {/* First row with only two profiles */}
          <div className="grid grid-cols-2 gap-4">
            {teamMembers.slice(0, 2).map((person, i) => (
              <ProfileCard key={i} person={person} />
            ))}
          </div>

          {/* Remaining profiles with 4 per row */}
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
      <div className="w-80 h-96 bg-gray-900 backdrop-blur-3xl rounded-2xl border-2 border-[rgba(173,216,230,0.8)] shadow-lg transition-transform hover:scale-105 hover:shadow-2xl flex flex-col items-center p-6">
        <div className="relative w-44 h-44 rounded-full overflow-hidden border-[4px] border-[rgba(173,216,230,0.8)] shadow-md">
          <img className="w-full h-full object-cover object-center" src={`http://localhost:5000/${person.profilePhoto}`} alt={person.name} />
        </div>
        <h1 className="mt-6 text-center text-2xl font-extrabold text-white">{person.name}</h1>
        <h3 className="text-center text-lg text-gray-300">{person.designation}</h3>
        <div className="mt-auto pb-4 flex justify-center space-x-3">
          <a target="_blank" href={person.linkedin} className="text-[1.9rem] transition-transform duration-300 hover:scale-125 hover:text-blue-500">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a target="_blank" href={person.github} className="text-[1.9rem] transition-transform duration-300 hover:scale-125 hover:text-gray-400">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href={`mailto:${person.email}`} className="text-[1.9rem] transition-transform duration-300 hover:scale-125 hover:text-red-500">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Team;
