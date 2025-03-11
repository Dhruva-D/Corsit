import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebook, faYoutube, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#272928] text-[#f7ffff] pt-16 pb-5 px-8 md:px-16">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h2 className="text-3xl text-[#ed5a2d] font-bold">CORSIT</h2>
          <p className="text-[#f7ffff] text-lg mt-4 leading-relaxed">
            Empowering students through robotics and innovation at Siddaganga Institute Of Technology.
          </p>
          <div className="flex space-x-4 mt-6">
            {[ 
              { href: "https://www.facebook.com/thecorsit/", icon: faFacebook, color: "hover:text-blue-600" },
              { href: "https://www.youtube.com/channel/UCcm-ttunddHrEGWUdYkUd2w", icon: faYoutube, color: "hover:text-red-600" },
              { href: "https://www.instagram.com/corsit.sit", icon: faInstagram, color: "hover:text-pink-500" },
              { href: "https://www.linkedin.com/company/corsit/posts", icon: faLinkedin, color: "hover:text-blue-500" }
            ].map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className={`text-[#f7ffff] ${social.color} transition-colors duration-300 text-3xl`}>
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl text-[#ed5a2d] font-bold">Quick Links</h2>
          <ul className="mt-4 space-y-3">
            {["RoboExpo", "Workshop", "Robocor"].map((item, index) => (
              <li key={index}>
                <a href="/" className="text-[#f7ffff] hover:text-white text-lg block">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl text-[#ed5a2d] font-bold">Contact Info</h2>
          <ul className="mt-4 space-y-3">
            {[ 
              { icon: faMapMarkerAlt, text: "Siddaganga Institute Of Technology, Tumkur", color: "hover:text-red-500" },
              { icon: faEnvelope, text: "corsit@sit.ac.in", href: "mailto:corsit@sit.ac.in", color: "hover:text-yellow-500" },
              { icon: faWhatsapp, text: "+91 8104882160", href: "https://wa.me/8104882160", color: "hover:text-green-500" }
            ].map((contact, index) => (
              <li key={index} className="flex items-center space-x-4 text-[#f7ffff] text-lg">
                <FontAwesomeIcon icon={contact.icon} className={`text-xl transition-colors duration-300 ${contact.color}`} />
                {contact.href ? (
                  <a href={contact.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                    {contact.text}
                  </a>
                ) : (
                  <span className="hover:text-white transition-colors duration-300">{contact.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className="border-gray-700 my-7" />
      <p className="text-center text-[#ed5a2d8b] text-lg">&copy; 2025 CORSIT. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
