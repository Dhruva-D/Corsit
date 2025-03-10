import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebook, faYoutube, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#272928] text-[#f7ffff] pt-16 pb-5 px-16">
      <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between">

        <div className="w-[50%]">
          <h2 className="text-3xl text-[#ed5a2d] font-bold">CORSIT</h2>
          <p className="text-[#f7ffff] text-xl mt-4 leading-relaxed">
            Empowering students through robotics and innovation at Siddaganga Institute Of Technology.
          </p>
          <div className="flex space-x-6 mt-6">
            <a
              href="https://www.facebook.com/thecorsit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f7ffff] hover:text-blue-600 transition-colors duration-300 text-4xl"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>

            <a
              href="https://www.youtube.com/channel/UCcm-ttunddHrEGWUdYkUd2w"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f7ffff] hover:text-red-600 transition-colors duration-300 text-4xl"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>

            <a
              href="https://www.instagram.com/corsit.sit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f7ffff] hover:text-pink-500 transition-colors duration-300 text-4xl"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>

            <a
              href="https://www.linkedin.com/company/corsit/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f7ffff] hover:text-blue-500 transition-colors duration-300 text-4xl"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>

        </div>

        <div className="w-[18%]">
          <h2 className="text-2xl text-[#ed5a2d] font-bold">Quick Links</h2>
          <ul className="mt-4 space-y-4">
            <li>
              <a href="/" className="text-[#f7ffff] hover:text-white text-xl">
                RoboExpo
              </a>
            </li>
            <li>
              <a href="/projects" className="text-[#f7ffff] hover:text-white text-xl">
                Workshop
              </a>
            </li>
            <li>
              <a href="/events" className="text-[#f7ffff] hover:text-white text-xl">
                Robocor
              </a>
            </li>
          </ul>
        </div>

        <div className="w-[30%]">
          <h2 className="text-2xl text-[#ed5a2d] font-bold">Contact Info</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center space-x-4 text-[#f7ffff] text-xl">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl transition-colors duration-300 hover:text-red-500" />
              <span className="hover:text-white transition-colors duration-300">
                Siddaganga Institute Of Technology, Tumkur
              </span>
            </li>
            <li className="flex items-center space-x-4 text-[#f7ffff] text-xl">
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl transition-colors duration-300 hover:text-yellow-500" />
              <a href="mailto:corsit@sit.ac.in" className="hover:text-white transition-colors duration-300">
                corsit.sit.ac.in
              </a>
            </li>
            <li className="flex items-center space-x-4 text-[#f7ffff] text-xl">
              <FontAwesomeIcon icon={faWhatsapp} className="text-2xl transition-colors duration-300 hover:text-green-500" />
              <a href="https://wa.me/8104882160" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                +91 8104882160
              </a>
            </li>
          </ul>
        </div>



      </div>

      <hr className="border-gray-700 my-7" />

      <p className="text-center text-[#ed5a2d8b] text-xl">&copy; 2025 CORSIT. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
<div className="flex space-x-6 mt-6">
  <a
    href="https://www.facebook.com/thecorsit/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-blue-600 transition-colors duration-300 text-4xl"
  >
    <FontAwesomeIcon icon={faFacebook} />
  </a>

  <a
    href="https://www.youtube.com/channel/UCcm-ttunddHrEGWUdYkUd2w"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-red-600 transition-colors duration-300 text-4xl"
  >
    <FontAwesomeIcon icon={faYoutube} />
  </a>

  <a
    href="https://www.instagram.com/corsit.sit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-4xl"
  >
    <FontAwesomeIcon icon={faInstagram} />
  </a>

  <a
    href="https://www.linkedin.com/company/corsit/posts/?feedView=all"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 text-4xl"
  >
    <FontAwesomeIcon icon={faLinkedin} />
  </a>
</div>
