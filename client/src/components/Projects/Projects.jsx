import React from 'react'

import lfr from '../../assets/projects/LFR.jpg'
import gesture from '../../assets/projects/gesture.png'
import obstacle from '../../assets/projects/obstacle.png'
import blue from '../../assets/projects/blue.jpg'
import ar from '../../assets/projects/augmented.jpg'
import soccer from '../../assets/projects/soccer.jpeg'
import rfid from '../../assets/projects/RFID.png'

const projects = [
  {
    title: 'Line Following Robot',
    description: 'Line Following Robot is an autonomous robot which follows either black line in white are or white line in black area. The robot follows the line by using infrared sensors. The robot is programmed to follow the line and to take the turns whenever it encounters a turn.',
    image: lfr,
  },
  {
    title: 'Gesture Controlled Robot',
    description: 'Gesture controlled robot is a robot which can be controlled by simple hand gestures. The robot is controlled by the movement of the hand. The robot can move forward, backward, left and right by the movement of the hand.',
    image: gesture,
  },
  {
    title: 'Obstacle Avoiding Robot',
    description: 'Obstacle Avoiding Robot is an autonomous robot which avoids the obstacles in its path. The robot is programmed to detect the obstacles in its path and to avoid them by changing its path.',
    image: obstacle,
  },
  {
    title: 'Bluetooth Controlled Robot',
    description: 'Bluetooth Controlled Robot is a robot which can be controlled by a smartphone using Bluetooth. The robot can move forward, backward, left and right by using the smartphone.',
    image: blue,
  },
  {
    title: 'Augmented Reality',
    description: 'Augmented Reality is an interactive experience of a real-world environment where the objects that reside in the real world are enhanced by computer-generated perceptual information, sometimes across multiple sensory modalities, including visual, auditory, haptic, somatosensory, and olfactory.',
    image: ar,
  },
  {
    title: 'Soccer Robot',
    description: 'Soccer Robot is an autonomous robot which plays soccer. The robot is programmed to play soccer by using sensors to detect the ball and to kick the ball into the goal.',
    image: soccer,
  },
  {
    title: 'RFID Based Robot',
    description: 'RFID Based Robot is a robot which can be controlled by RFID tags. The robot can move forward, backward, left and right by using the RFID tags.',
    image: rfid,
  }
]


const Projects = () => {
  return (
    <>
      <div className='flex flex-col justify-center items-center w-[80%] mx-auto gap-10 text-center py-16'>
        <div className='mb-4'>
          <h1 className='text-5xl font-semibold'>Bots & Projects</h1>
        </div>
        <div className=' max-w-8xl px-6 text-lg text-gray-300'>
          Robotics projects thrive on teamwork, where diverse expertise fuels innovation and problem-solving. By collaborating, members contribute unique skills in design, programming, and engineering to develop cutting-edge robotic solutions. A shared vision fosters creativity, efficiency, and technical excellence, ensuring projects are executed with precision. Through hands-on experience, members gain practical knowledge, refine problem-solving abilities, and push the boundaries of robotics, shaping the future of automation and intelligent systems.
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
                  src={project.image}
                  alt={project.title}
                  className="w-full h-72 object-cover rounded-lg transition-transform duration-500 hover:scale-110"
                />
              </div>

              
              <div className="p-6">
                <h2 className="text-3xl font-bold text-orange-400">{project.title}</h2>
                <p className="text-gray-300 mt-3 text-lg">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>



    </>
  )
}

export default Projects
