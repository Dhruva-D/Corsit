import React from "react";

const Contact = () => {
  return (
    <div className="bg-[#272928] py-24 px-5">
      <div className="flex flex-col sm:flex-col md:flex-row items-center justify-center w-[90%] mx-auto gap-10 sm:gap-16 md:gap-20 lg:gap-24">
        <div className="w-full sm:w-[80%] md:w-[60%] rounded-lg overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6437.483263773803!2d77.124437705653!3d13.327329070140145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb02e826fb691ef%3A0xe78608813c36f380!2sSiddaganga%20Institute%20Of%20Technology!5e0!3m2!1sen!2sin!4v1739469272484!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[480px] md:h-[450px] lg:h-[600px] rounded-2xl"
          />

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[85%] md:w-[75%] lg:w-[70%] text-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-3xl shadow-xl border border-[rgba(237,90,45,0.8)] bg-[#252525] backdrop-blur-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start text-left gap-6 sm:gap-8 md:gap-32 lg:gap-40">
              <div className="w-full md:w-1/2">
                <h2 className="text-sm font-semibold uppercase mb-1 text-gray-300">Address</h2>
                <p className="text-lg text-white">E-Yantra Robotics Lab, Siddaganga Institute of Technology, Tumkur, Karnataka</p>
              </div>

              <div className="w-full md:w-1/2 mt-3 md:mt-0 flex flex-col items-start">
                <div className="mb-1">
                  <h2 className="text-sm font-semibold uppercase mb-1 text-gray-300">Email</h2>
                  <a href="mailto:corsit@sit.ac.in" className="text-lg text-white hover:text-[rgba(237,90,45,0.8)]">corsit@sit.ac.in</a>
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase mb-1 text-gray-300">Phone</h2>
                  <p className="text-lg text-white">7975215782</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="w-full sm:w-[90%] md:w-[40%] border border-[rgba(237,90,45,0.8)] shadow-xl rounded-3xl px-6 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12 md:py-16 lg:py-20 bg-[#1f1f1f] flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 flex items-center justify-center">Contact Us</h1>

          <form className="flex flex-col space-y-5">
            <div>
              <label className="block text-lg sm:text-xl md:text-xl font-medium text-gray-300 pl-2 pb-2">Name</label>
              <input type="text" className="w-full h-12 px-4 text-lg border border-[rgba(237,90,45,0.33)] bg-[#333] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[rgba(237,90,45,0.8)] transition" />
            </div>

            <div>
              <label className="block text-lg sm:text-xl md:text-xl font-medium text-gray-300 pl-2 pb-2">Email</label>
              <input type="email" className="w-full h-12 px-4 text-lg border border-[rgba(237,90,45,0.32)] bg-[#333] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[rgba(237,90,45,0.8)] transition" />
            </div>

            <div>
              <label className="block text-lg sm:text-xl md:text-xl font-medium text-gray-300 pl-2 pb-2">Message</label>
              <textarea className="w-full h-32 p-4 text-lg border border-[rgba(237,90,45,0.31)] bg-[#333] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[rgba(237,90,45,0.8)] transition"></textarea>
            </div>

            <input type="submit" value="Submit" className="w-full px-6 py-3 border border-[rgba(237,90,45,0.83)] rounded-3xl text-lg sm:text-xl md:text-xl font-semibold text-center transition text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer hover:bg-[rgba(237,90,45,0.82)]" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
