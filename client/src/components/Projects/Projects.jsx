import React, { useEffect, useState } from "react";
import config from '../../config';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/team`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects data:", error));
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
      </div>
    </div>
  );
};

export default Projects;
