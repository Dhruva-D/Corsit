import React, { useState, useEffect, useCallback } from 'react'; 
import Header from './HeaderProfile';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import config from '../../config';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const cachedData = sessionStorage.getItem('userData');
      if (cachedData) {
        setUserData(JSON.parse(cachedData));
        setIsLoading(false);
        // Fetch fresh data in background
        const response = await axios.get(`${config.apiBaseUrl}/profile`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        const newData = response.data;
        setUserData(newData);
        sessionStorage.setItem('userData', JSON.stringify(newData));
      } else {
        const response = await axios.get(`${config.apiBaseUrl}/profile`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setUserData(response.data);
        sessionStorage.setItem('userData', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Loading skeleton
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex h-[100vh] flex-col items-center justify-center bg-gray-900 text-gray-200 relative">
          <div className="w-48 h-48 rounded-full bg-gray-700/20 animate-pulse"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 mt-22">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* User Details Section */}
          <div className="card-wrapper min-h-[850px] md:min-h-[550px] w-full">
            <div className="card-content flex items-center justify-center text-lg bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md">
              <div className="w-full">
                <h1 className="text-4xl font-bold mb-8 text-center text-[#ed5a2d]">User Profile</h1>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Image */}
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg mb-4">
                      <img 
                        src={userData?.profilePhoto || config.defaultProfileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Profile image failed to load, using default");
                          e.target.src = config.defaultProfileImage;
                          e.target.onerror = null; // Prevents infinite loop
                        }}
                      />
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-2">{userData?.name}</h2>
                    <p className="text-xl text-gray-400 text-center">{userData?.designation}</p>
                  </div>

                  {/* Profile Details */}
                  <div className="w-full md:w-2/3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xl font-medium mb-3 text-gray-300">Email</label>
                        <p className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700">
                          {userData?.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xl font-medium mb-3 text-gray-300">Phone</label>
                        <p className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700">
                          {userData?.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="pt-6 border-t border-gray-700">
                      <label className="block text-xl font-medium mb-3 text-gray-300">Social Links</label>
                      <div className="flex flex-wrap gap-4">
                        <a 
                          href={userData?.linkedin || config.defaultLinkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 hover:bg-gray-600 transition-all"
                        >
                          <FontAwesomeIcon icon={faLinkedin} className="text-[#ed5a2d]" />
                          <span>LinkedIn</span>
                        </a>
                        <a 
                          href={userData?.github || config.defaultGithub} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 hover:bg-gray-600 transition-all"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-[#ed5a2d]" />
                          <span>GitHub</span>
                        </a>
                        <a 
                          href={userData?.instagram ? `https://instagram.com/${userData.instagram}` : config.defaultInstagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 hover:bg-gray-600 transition-all"
                        >
                          <FontAwesomeIcon icon={faInstagram} className="text-[#ed5a2d]" />
                          <span>Instagram</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="card-wrapper min-h-[800px] md:min-h-[600px] w-full">
            <div className="card-content flex items-center justify-center text-lg bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md">
              <div className="w-full">
                <h1 className="text-4xl font-bold mb-8 text-center text-[#ed5a2d]">Project Details</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Project Image */}
                  <div className="col-span-1">
                    <div className="rounded-lg overflow-hidden border-4 border-gray-700 shadow-lg">
                      <img 
                        src={userData?.projectPhoto || config.defaultProjectImage} 
                        alt="Project" 
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          console.log("Project image failed to load, using default");
                          e.target.src = config.defaultProjectImage;
                          e.target.onerror = null; // Prevents infinite loop
                        }}
                      />
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="col-span-2 space-y-6">
                    <div>
                      <label className="block text-xl font-medium mb-3 text-gray-300">Project Title</label>
                      <p className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700">
                        {userData?.projectTitle || 'No project title'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xl font-medium mb-3 text-gray-300">Project Description</label>
                      <p className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 min-h-[100px]">
                        {userData?.projectDescription || 'No project description'}
                      </p>
                    </div>

                    {userData?.abstractDoc && (
                      <div className="pt-4">
                        <a 
                          href={userData.abstractDoc}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-4 bg-[#ed5a2d] rounded-lg text-xl font-semibold text-center transition shadow-md hover:bg-[#d54a1d] active:scale-95 cursor-pointer"
                          onClick={(e) => {
                            // Validate URL before opening
                            if (!userData.abstractDoc.startsWith('http')) {
                              e.preventDefault();
                              console.error("Invalid abstract document URL");
                              alert("Abstract document URL is invalid");
                            }
                          }}
                        >
                          View Abstract Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
