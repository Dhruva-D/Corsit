import React, { useEffect, useState } from "react";
import config from '../../config';

// Modern Loading Spinner Component for Projects
const ProjectsLoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 mt-12">
      {/* Main spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-[#ed5a2d]/20 border-t-[#ed5a2d] rounded-full animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-r-[#ed5a2d]/60 rounded-full animate-spin animate-reverse"></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#ed5a2d] rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading text with typing animation */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-2 animate-pulse">Loading Projects</h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-[#ed5a2d] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-[#ed5a2d] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-[#ed5a2d] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
      
      {/* Skeleton cards preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 max-w-[1240px] mx-auto px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full max-w-[20rem] h-auto bg-black/20 backdrop-blur-xl rounded-2xl border-[2px] border-[rgba(237,90,45,0.3)] shadow-lg flex flex-col items-center p-6 animate-pulse">
            <div className="w-32 h-32 md:w-40 md:h-40  bg-gray-700/50 border-[3px] border-[rgba(237,90,45,0.5)]"></div>
            <div className="mt-4 w-32 h-6 bg-gray-700/50 rounded"></div>
            <div className="mt-3 w-24 h-4 bg-gray-700/30 rounded"></div>
            <div className="mt-4 flex space-x-3">
              <div className="w-6 h-6 bg-gray-700/30 rounded"></div>
              <div className="w-6 h-6 bg-gray-700/30 rounded"></div>
              <div className="w-6 h-6 bg-gray-700/30 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${config.apiBaseUrl}/team`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects data:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#272928]">
      <div className="min-h-screen flex flex-col items-center w-[90%] sm:w-[80%] mx-auto py-10 text-center">
        <div className="m-10 sm:m-20">
          <h1 className="text-4xl sm:text-6xl text-[#ed5a2d] font-semibold">Bots & Projects</h1>
          <p className="max-w-4xl mt-4 px-4 sm:px-6 text-base sm:text-lg text-[#f7ffff]">
            Robotics projects thrive on teamwork, where diverse expertise fuels innovation and problem-solving.
          </p>
        </div>

        {loading ? (
          <ProjectsLoadingSpinner />
        ) : (
          <div className="flex justify-center w-full mb-10 sm:mb-20 px-2 sm:px-4">
            <div id="projects" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
              {projects
                .filter((project) => project.projectTitle && project.projectDescription)
                .map((project, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-sm sm:max-w-md rounded-xl border border-orange-500 bg-black/40 
                  backdrop-blur-xl shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-orange-500/50 p-4 sm:p-6 flex flex-col justify-between h-full"
                >
                  <div className="absolute inset-0 rounded-xl border border-orange-400 opacity-30 blur-md"></div>

                  <div className="w-full rounded-lg overflow-hidden border-2 border-orange-500">
                    <img
                      src={project.projectPhoto || config.defaultProjectImage}
                      alt={project.name}
                      className="w-full h-40 sm:h-60 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        console.log("Project image failed to load in Projects component, using default");
                        e.target.src = config.defaultProjectImage;
                        e.target.onerror = null; // Prevents infinite loop
                      }}
                    />
                  </div>

                  <div className="flex flex-col flex-grow p-3 sm:p-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-orange-400">{project.projectTitle}</h2>
                    <p className="text-gray-300 mt-2 text-sm sm:text-base">{project.projectDescription}</p>
                    <p className="text-gray-400 mt-1 text-xs sm:text-sm">By: {project.name}</p>

                    <div className="mt-auto">
                      {project.abstractDoc ? (
                        <a
                          href={project.abstractDoc || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block text-center mt-4 px-4 sm:px-6 py-2 bg-orange-500 text-black font-bold rounded-lg transition-all transform hover:scale-105 hover:bg-orange-600 shadow-lg shadow-orange-500/50"
                        >
                          Download Abstract
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full mt-4 px-4 sm:px-6 py-2 bg-gray-600 text-gray-300 font-bold rounded-lg cursor-not-allowed opacity-50"
                        >
                          Abstract Not Available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
