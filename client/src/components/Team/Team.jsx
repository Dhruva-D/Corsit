import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import config from '../../config';
import { sortByDesignation } from '../../config/designations';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/team`)
      .then((response) => response.json())
      .then((data) => {
        const sortedTeam = sortByDesignation(data);
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
        <div className="text-center mt-3 mb-2">
          {person.designations && person.designations.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {(() => {
                // Academic year designations and Member to filter out when other designations exist
                const academicDesignations = ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Member'];
                
                // Get non-academic designations (leadership roles)
                const nonAcademicDesignations = person.designations.filter(
                  designation => !academicDesignations.includes(designation)
                );
                
                // If person has leadership roles, show only those
                // If person has only academic/member designations, show them (but filter out Member)
                const designationsToShow = nonAcademicDesignations.length > 0 
                  ? nonAcademicDesignations 
                  : person.designations.filter(designation => designation !== 'Member');
                
                return designationsToShow.length > 0 ? (
                  designationsToShow.map((designation, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide 
                               bg-gradient-to-r from-[#ed5a2d] to-[#ff6b3d] text-white 
                               shadow-md hover:shadow-lg transition-all duration-200 
                               border border-[#ed5a2d]/30 backdrop-blur-sm"
                    >
                      {designation}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                                 bg-gray-700/50 text-gray-300 border border-gray-600/50 backdrop-blur-sm">
                    Member
                  </span>
                );
              })()}
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                             bg-gray-700/50 text-gray-300 border border-gray-600/50 backdrop-blur-sm">
                Member
              </span>
            </div>
          )}
        </div>
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
