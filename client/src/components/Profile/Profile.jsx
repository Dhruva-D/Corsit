import React, { useState, useEffect } from 'react'; 
import Header from './HeaderProfile';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="h-fit bg-[#080514] text-white py-40 px-52">
        <div className="flex h-fit items-start justify-start px-12 py-12 border border-[rgba(173,216,230,0.8)] rounded-xl bg-[#0b001056]">
          <div className="flex items-center gap-28">
            <div className="max-w-md rounded-3xl p-[0.3rem] bg-gradient-to-b from-slate-300 to-pink-300 dark:from-slate-400 dark:to-[rgba(136,217,244,0.8)]">
              <div className="rounded-[calc(1.5rem-1px)] p-[0.5px] bg-white dark:bg-gray-900">
                <img 
                  src={`http://localhost:5000/${userData.profilePhoto}`} 
                  alt="Profile" 
                  className="w-48 h-48 object-cover rounded-full" 
                  onError={(e) => e.target.src = "/default_profile.png"} 
                />
              </div>
            </div>
            <div>
              <div className="w-[40vw] mx-auto my-12 p-12 rounded-3xl shadow-2xl text-xl">
                <div className="mb-8 flex items-center gap-6">
                  <h2 className="text-3xl font-bold text-white">Name:</h2>
                  <p className="text-gray-300 text-2xl">{userData.name}</p>
                </div>
                <div className="mb-8 flex items-center gap-6">
                  <h2 className="text-3xl font-bold text-white">Email:</h2>
                  <p className="text-gray-300 text-2xl">{userData.email}</p>
                </div>
                <div className="mb-8 flex items-center gap-6">
                  <h2 className="text-3xl font-bold text-white">Designation:</h2>
                  <p className="text-gray-300 text-2xl">{userData.designation}</p>
                </div>
                <div className="flex items-center gap-8">
                  <a href={userData.linkedin} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} className="text-gray-200 text-3xl transition-all duration-300 hover:scale-125" />
                  </a>
                  <a href={userData.github} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} className="text-gray-200 text-3xl transition-all duration-300 hover:text-white hover:bg-black hover:scale-125 p-1 rounded" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="mt-16 p-8 bg-gray-800 text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Project Details</h2>
          <div className="flex gap-12">
            <div className="w-1/3">
              <img 
                src={`http://localhost:5000/${userData.projectPhoto}`} 
                alt="Project" 
                className="w-full h-64 object-cover rounded-lg" 
                onError={(e) => e.target.src = "/default_project.jpeg"} 
              />
            </div>
            <div className="w-2/3">
              <h3 className="text-2xl font-semibold">Project Title:  {userData.projectTitle}</h3>
              <h3 className="text-2xl font-semibold mt-4">Project Description:</h3>
              <p className="text-gray-300 mt-2">{userData.projectDescription}</p>
              {userData.abstractDoc && (
                <div className="mt-4">
                  <h3 className="text-2xl font-semibold">Abstract:</h3>
                  <a 
                    href={`http://localhost:5000/${userData.abstractDoc}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 underline"
                  >
                    View Abstract Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
