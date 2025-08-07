import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebook, faYoutube, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faMapMarkerAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import config from "../../config";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState({ message: "", type: "" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeStatus({ message: "Please enter a valid email address", type: "error" });
      return;
    }
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscribeStatus({ message: "Subscribed successfully!", type: "success" });
        setEmail("");
      } else {
        setSubscribeStatus({ message: data.message || "Subscription failed", type: "error" });
      }
    } catch (error) {
      setSubscribeStatus({ message: "Something went wrong. Please try again.", type: "error" });
    }
  };

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
          
          {/* Subscription Form */}
          <div className="mt-8 border-2 border-[#ed5a2d] rounded-lg p-6 bg-gradient-to-br from-[#292a2a] to-[#1e1f1f] backdrop-blur-sm shadow-xl">
            <h3 className="text-2xl text-[#ed5a2d] font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              Subscribe for Upcoming Events
            </h3>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email Address"
                    className="p-4 pl-4 w-full rounded-md bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-[#ed5a2d] border-2 border-transparent placeholder-gray-500 text-base"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#ed5a2d] to-[#ff7742] text-white p-4 px-8 rounded-md hover:from-[#ff7742] hover:to-[#ed5a2d] transition-all duration-300 flex items-center justify-center sm:w-auto w-full shadow-md font-bold text-base"
                >
                  <span>Subscribe</span>
                </button>
              </div>
              {subscribeStatus.message && (
                <div className={`rounded-md p-3 ${subscribeStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  <p className="text-sm font-medium">
                    {subscribeStatus.message}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-300 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-[#ed5a2d]" />
                Stay updated with our latest events, workshops, and robotics competitions.
              </p>
            </form>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl text-[#ed5a2d] font-bold">Quick Links</h2>
          <ul className="mt-4 space-y-3">
            {[
              { name: "RoboExpo", url: "/" },
              { name: "Workshop", url: "/" },
              { name: "Robocor", url: "https://robocor.corsit.in" }
            ].map((item, index) => (
              <li key={index}>
                <a 
                  href={item.url} 
                  target={item.url.startsWith("http") ? "_blank" : "_self"} 
                  rel={item.url.startsWith("http") ? "noopener noreferrer" : ""}
                  className="text-[#f7ffff] hover:text-white text-lg block"
                >
                  {item.name}
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
              { icon: faWhatsapp, text: "+91 7975215782", href: "https://wa.me/7975215782", color: "hover:text-green-500" }
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
