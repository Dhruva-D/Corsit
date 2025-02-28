import React, { useEffect, useState } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/team")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects data:", error));
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center w-[80%] mx-auto gap-10 text-center py-16">
        <div className="mb-4">
          <h1 className="text-5xl font-semibold">Bots & Projects</h1>
        </div>
        <div className="max-w-4xl px-6 text-lg text-gray-300">
          Robotics projects thrive on teamwork, where diverse expertise fuels innovation and problem-solving.
        </div>
      </div>

      <div className="flex justify-center mb-20 px-4">
        <div id="projects" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative w-full max-w-md rounded-xl border border-orange-500 bg-black/60 backdrop-blur-md shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-orange-500/50 p-4"
            >
              <div className="absolute inset-0 rounded-xl border border-orange-400 opacity-30 blur-md"></div>
              <div className="rounded-lg overflow-hidden border-2 border-orange-500">
                <img
                  src={`http://localhost:5000/${project.projectPhoto}`}
                  alt={project.name}
                  className="w-full h-60 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-orange-400">{project.projectTitle}</h2>
                <p className="text-gray-300 mt-3 text-base">{project.projectDescription}</p>
                <p className="text-gray-400 mt-2 text-sm">By: {project.name}</p>

                {/* Download Abstract Link with Animations & Validity Check */}
                {project.abstractDoc ? (
                  <a
                    href={`http://localhost:5000/${project.abstractDoc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-5 py-2 bg-orange-500 text-black font-bold rounded-lg transition 
                    transform hover:scale-105 hover:bg-orange-600 shadow-lg shadow-orange-500/50 inline-block"
                  >
                    Download Abstract
                  </a>
                ) : (
                  <button
                    disabled
                    className="mt-4 px-5 py-2 bg-gray-600 text-gray-300 font-bold rounded-lg cursor-not-allowed opacity-50"
                  >
                    Abstract Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
