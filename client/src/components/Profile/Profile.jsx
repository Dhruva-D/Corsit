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
        <div className="flex h-[100vh] flex-col items-center justify-center bg-[#272829] text-[#f7ffff] relative">
          <div className="w-48 h-48 rounded-full bg-gray-700/20 animate-pulse"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#272829] text-[#f7ffff] py-12 px-4 mt-22 ">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* User Details Section */}
          <div className="card-wrapper min-h-[550px] w-full">
            <div className="card-content flex items-center justify-center text-lg bg-[rgba(217,217,217,0.1)] p-8 rounded-3xl border border-slate-400 shadow-lg backdrop-blur-sm">
              <div className="w-full">
                <h1 className="text-4xl font-bold mb-8 text-center">User Profile</h1>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Image */}
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-400 shadow-lg mb-4">
                      <img 
                        src={userData?.profilePhoto ? `${config.apiBaseUrl}/${userData.profilePhoto}` : config.defaultProfileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = config.defaultProfileImage}
                      />
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-2">{userData?.name}</h2>
                    <p className="text-xl text-gray-300 text-center">{userData?.designation}</p>
                  </div>

                  {/* Profile Details */}
                  <div className="w-full md:w-2/3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xl font-medium mb-3">Email</label>
                        <p className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)]">
                          {userData?.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xl font-medium mb-3">Phone</label>
                        <p className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)]">
                          {userData?.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="pt-6 border-t border-slate-400">
                      <label className="block text-xl font-medium mb-3">Social Links</label>
                      <div className="flex flex-wrap gap-4">
                        <a 
                          href={userData?.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] hover:bg-[rgba(217,217,217,0.15)] transition-all"
                        >
                          <FontAwesomeIcon icon={faLinkedin} />
                          <span>LinkedIn</span>
                        </a>
                        <a 
                          href={userData?.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] hover:bg-[rgba(217,217,217,0.15)] transition-all"
                        >
                          <FontAwesomeIcon icon={faGithub} />
                          <span>GitHub</span>
                        </a>
                        <a 
                          href={`https://instagram.com/${userData?.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] hover:bg-[rgba(217,217,217,0.15)] transition-all"
                        >
                          <FontAwesomeIcon icon={faInstagram} />
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
          <div className="card-wrapper min-h-[600px] w-full">
            <div className="card-content flex items-center justify-center text-lg bg-[rgba(217,217,217,0.1)] p-8 rounded-3xl border border-slate-400 shadow-lg backdrop-blur-sm">
              <div className="w-full">
                <h1 className="text-4xl font-bold mb-8 text-center">Project Details</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Project Image */}
                  <div className="col-span-1">
                    <div className="rounded-3xl overflow-hidden border-4 border-slate-400 shadow-lg">
                      <img 
                        src={userData?.projectPhoto ? `${config.apiBaseUrl}/${userData.projectPhoto}` : config.defaultProjectImage} 
                        alt="Project" 
                        className="w-full h-64 object-cover"
                        onError={(e) => e.target.src = config.defaultProjectImage}
                      />
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="col-span-2 space-y-6">
                    <div>
                      <label className="block text-xl font-medium mb-3">Project Title</label>
                      <p className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)]">
                        {userData?.projectTitle || 'No project title'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xl font-medium mb-3">Project Description</label>
                      <p className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] min-h-[100px]">
                        {userData?.projectDescription || 'No project description'}
                      </p>
                    </div>

                    {userData?.abstractDoc && (
                      <div className="pt-4">
                        <a 
                          href={`${config.apiBaseUrl}/${userData.abstractDoc}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-4 border border-slate-400 rounded-3xl text-xl font-semibold text-center transition shadow-md hover:scale-105 active:scale-95 cursor-pointer bg-[rgba(217,217,217,0.1)] hover:bg-[rgba(217,217,217,0.15)]"
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
