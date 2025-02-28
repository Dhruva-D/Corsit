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
        <div className="max-w-8xl px-6 text-lg text-gray-300">
          Robotics projects thrive on teamwork, where diverse expertise fuels innovation and problem-solving.
        </div>
      </div>

      <div className="flex justify-center mb-20">
        <div id="projects" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative w-[33rem] rounded-xl border border-orange-500 bg-black/60 backdrop-blur-md shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 p-4"
            >
              <div className="absolute inset-0 rounded-xl border border-orange-400 opacity-30 blur-md"></div>
              <div className="rounded-lg overflow-hidden border-2 border-orange-500">
                <img
                  src={`http://localhost:5000/${project.projectPhoto}`}
                  alt={project.name}
                  className="w-full h-72 object-cover rounded-lg transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-3xl font-bold text-orange-400">{project.name}</h2>
                <p className="text-gray-300 mt-3 text-lg">{project.projectDescription}</p>
                <p className="text-gray-400 mt-2">By: {project.name}</p>

                {/* Download Abstract Link */}
                <a
                  href={`http://localhost:5000/${project.abstractDoc}`}
                  download
                  
                  className="mt-4 px-4 py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 transition inline-block"
                >
                  Download Abstract
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
