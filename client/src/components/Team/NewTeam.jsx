import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import config from '../../config';

const designationOrder = [
  "Chairman", "Vice-Chairman", "Treasurer", "Web Dev Lead", "Android Dev Lead",
  "Tech Lead", "Photoshop Lead", "Digital Lead", "Fourth Year", "Third Year", "Second Year", "First Year", "Member"
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/team`)
      .then((response) => response.json())
      .then((data) => {
        const sortedTeam = data.sort((a, b) => {
          return designationOrder.indexOf(a.designation) - designationOrder.indexOf(b.designation);
        });
        setTeamMembers(sortedTeam);
      })
      .catch((error) => console.error("Error fetching team data:", error));
  }, []);

  return (
    <div className="w-full min-h-screen py-[7rem] px-4 bg-[#272928]">
      <h2 className="text-4xl sm:text-5xl md:text-6xl text-[#ed5a2d] text-center font-bold tracking-tight">
        Our Team
      </h2>
      <div className="max-w-[1240px] mx-auto mt-12 grid gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teamMembers.slice(0, 2).map((person, i) => (
            <ProfileCard key={i} person={person} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {teamMembers.slice(2).map((person, i) => (
            <ProfileCard key={i} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ person }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[20rem] h-auto bg-black/40 backdrop-blur-xl rounded-2xl border-[2px] border-[rgba(237,90,45,0.8)] shadow-lg transition-transform duration-300 hover:shadow-xl flex flex-col items-center p-6 hover:scale-105">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] shadow-md border-[rgba(237,90,45,0.8)]">
          <img 
            className="w-full h-full object-cover" 
            src={person.profilePhoto || config.defaultProfileImage} 
            alt={person.name}
            onError={(e) => {
              console.log("Profile image failed to load in Team component, using default");
              e.target.src = config.defaultProfileImage;
              e.target.onerror = null; // Prevents infinite loop
            }}
          />
        </div>
        <h1 className="mt-4 text-center text-xl md:text-2xl font-semibold text-white leading-7 tracking-tight">{person.name}</h1>
        <h3 className="text-center text-sm md:text-md text-gray-300 font-medium leading-6">{person.designation}</h3>
        <div className="mt-auto pt-4 flex justify-center space-x-3">
          {person.linkedin && (
            <a 
              href={person.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl text-gray-400 hover:text-blue-400 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          )}
          {person.github && (
            <a 
              href={person.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl text-gray-400 hover:text-gray-300 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          )}
          {person.email && (
            <a 
              href={`mailto:${person.email}`} 
              className="text-xl text-gray-400 hover:text-red-400 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          )}
          {person.instagram && (
            <a 
              href={`https://instagram.com/${person.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl text-gray-400 hover:text-pink-500 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          )}
          {person.phone && (
            <a 
              href={`tel:${person.phone}`} 
              className="text-xl text-gray-400 hover:text-green-500 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faPhone} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
