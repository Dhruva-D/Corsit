import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

// Fourth Year imports
import aadarsh from "../../assets/team/fourth/aadarsh.jpg";
import aditi from "../../assets/team/fourth/aditi.jpg";
import aryan from "../../assets/team/fourth/aryan.jpg";
import ashutosh from "../../assets/team/fourth/ashutosh.jpg";
import badal from "../../assets/team/fourth/badal.jpeg";
import gaurav from "../../assets/team/fourth/gaurav.jpg";
import jatin from "../../assets/team/fourth/Jatin.jpg";
import kumar from "../../assets/team/fourth/kumar.jpg";
import lekhana from "../../assets/team/fourth/lekhana.jpg";
import mayank from "../../assets/team/fourth/mayank.jpg";
import namrata from "../../assets/team/fourth/namrata.jpg";
import rishav from "../../assets/team/fourth/rishav.jpg";
import sharanya from "../../assets/team/fourth/sharanya.jpg";
import siddhant from "../../assets/team/fourth/siddhant.jpeg";
import suraj from "../../assets/team/fourth/suraj.jpeg";
import ujjawal from "../../assets/team/fourth/ujjawal.jpg";
import vaishali from "../../assets/team/fourth/vaishali.jpg";
import vivek from "../../assets/team/fourth/vivek.jpg";
import harsh from "../../assets/team/fourth/gaurav.jpg"; // Using gaurav as a placeholder for harsh

// Third Year imports
import aditya from "../../assets/team/third/aditya.jpg";
import aishwarya from "../../assets/team/third/aishwarya.jpeg";
import ananya from "../../assets/team/third/ananya.jpg";
import chaithra from "../../assets/team/third/chaithra.jpg";
import guru from "../../assets/team/third/guru.jpg";
import ketaki from "../../assets/team/third/ketaki.jpg";
import likhitha from "../../assets/team/third/likhitha.jpg";
import mudit from "../../assets/team/third/mudit.jpg";
import om from "../../assets/team/third/om.jpg";
import pavan from "../../assets/team/third/pavan.jpeg";
import purbayan from "../../assets/team/third/purbayan.jpg";
import varsha from "../../assets/team/third/varsha.jpg";

// Second Year imports
import advaita from "../../assets/team/second/advaita.jpeg";
import anaya from "../../assets/team/second/anaya.jpeg";
import aryanSecond from "../../assets/team/second/aryan.jpeg";
import dhruva from "../../assets/team/second/dhruva.jpeg";
import jahnvi from "../../assets/team/second/jahnvi.jpeg";
import jishnu from "../../assets/team/second/jishnu.jpg";
import kritika from "../../assets/team/second/kritika.jpeg";
import lochan from "../../assets/team/second/lochan.jpeg";
import pratik from "../../assets/team/second/pratik.jpeg";
import rishabh from "../../assets/team/second/rishabh.jpg";
import shravya from "../../assets/team/second/shravya.jpg";
import shshank from "../../assets/team/second/shshank.jpeg";
import tarun from "../../assets/team/second/tarun.jpg";
import yash from "../../assets/team/second/yash.jpg";

const teamMembers = [
  {
    name: "Jatin Sharma",
    designation: "Chairman",
    profilePhoto: jatin,
    linkedin: "https://www.linkedin.com/in/jatin-sharma-669590142"
  },
  {
    name: "Ujjawal Singh",
    designation: "Vice-Chairman",
    profilePhoto: ujjawal,
    linkedin: "https://www.linkedin.com/in/ujjawal-singh-4a4817229"
  },
  {
    name: "Kumar Harsh",
    designation: "Treasurer",
    profilePhoto: kumar,
    linkedin: "https://www.linkedin.com/in/kumar-harsh-39bb2b249"
  },
  {
    name: "Namrata Bharadwaj",
    designation: "Treasurer",
    profilePhoto: namrata,
    linkedin: "https://www.linkedin.com/in/namratabharadwaj/"
  },
  {
    name: "Sharanya Bhat",
    designation: "Web Dev Lead",
    profilePhoto: sharanya,
    linkedin: "https://www.linkedin.com/in/sharanya-bhat-b2070a239"
  },
  {
    name: "Aadarsh Shriniwas",
    designation: "Android Dev Lead",
    profilePhoto: aadarsh,
    linkedin: "https://www.linkedin.com/in/aadarsh-shriniwas-512047227"
  },
  {
    name: "Siddhant Raj",
    designation: "Tech Lead",
    profilePhoto: siddhant,
    linkedin: "https://www.linkedin.com/in/siddhant-raj-3a804a2a9/"
  },
  {
    name: "Aditi Joshi",
    designation: "Photoshop Lead",
    profilePhoto: aditi,
    linkedin: "https://www.linkedin.com/in/aditi-joshi-5a260b229"
  },
  {
    name: "Lekhana Patel",
    designation: "Digital Lead",
    profilePhoto: lekhana,
    linkedin: "https://www.linkedin.com/in/lekhana-patel-3b8986225"
  },
  {
    name: "Ashutosh Malviya",
    designation: "Fourth Year",
    profilePhoto: ashutosh,
    linkedin: "https://www.linkedin.com/in/ashumalviya"
  },
  {
    name: "Rishav Shekhar",
    designation: "Fourth Year",
    profilePhoto: rishav,
    linkedin: "https://www.linkedin.com/in/rishav-shekhar-a21279232"
  },
  {
    name: "Harsh Gaurav",
    designation: "Fourth Year",
    profilePhoto: harsh,
    linkedin: "https://www.linkedin.com/in/harsh-gaurav-1434b624b"
  },
  {
    name: "Suraj Aribenchi",
    designation: "Fourth Year",
    profilePhoto: suraj,
    linkedin: "https://www.linkedin.com/in/suraj-aribenchi-9b5340239/"
  },
  {
    name: "Vivek M",
    designation: "Fourth Year",
    profilePhoto: vivek,
    linkedin: "https://www.linkedin.com/in/vivekindev/"
  },
  {
    name: "Vaishali Choudhary",
    designation: "Fourth Year",
    profilePhoto: vaishali,
    linkedin: "https://www.linkedin.com/in/b-vaishali-choudhary-671075239"
  },
  {
    name: "Mayank Pandey",
    designation: "Fourth Year",
    profilePhoto: mayank,
    linkedin: "https://www.linkedin.com/in/mayank-pandey-1a16b7240"
  },
  {
    name: "Badal Prakash Narayan",
    designation: "Fourth Year",
    profilePhoto: badal,
    linkedin: "https://www.linkedin.com/in/badal-prakash-narayan-a68b5a239/"
  },
  {
    name: "Aryan",
    designation: "Fourth Year",
    profilePhoto: aryan,
    linkedin: "https://www.linkedin.com/in/aryan-kumar-86535724b/"
  },
  
  // Third Year Members
  {
    name: "Chaithra H R",
    designation: "Third Year",
    profilePhoto: chaithra,
    linkedin: "https://www.linkedin.com/in/chaithra-hr/"
  },
  {
    name: "Ketaki Jojane",
    designation: "Third Year",
    profilePhoto: ketaki,
    linkedin: "https://www.linkedin.com/in/ketaki-jojane/"
  },
  {
    name: "Om",
    designation: "Third Year",
    profilePhoto: om,
    linkedin: "https://www.linkedin.com/company/corsit/"
  },
  {
    name: "Aishwarya Acharya P K",
    designation: "Third Year",
    profilePhoto: aishwarya,
    linkedin: "https://www.linkedin.com/in/aishwarya-acharya-pk-a9b661258"
  },
  {
    name: "NM Sai Likhitha",
    designation: "Third Year",
    profilePhoto: likhitha,
    linkedin: "https://www.linkedin.com/in/sailikhithanm"
  },
  {
    name: "Varsha",
    designation: "Third Year",
    profilePhoto: varsha,
    linkedin: "https://www.linkedin.com/in/varsha-t-k-415b25264"
  },
  {
    name: "Guru Srisha",
    designation: "Third Year",
    profilePhoto: guru,
    linkedin: "https://www.linkedin.com/in/guru-srisha-45a699263/"
  },
  {
    name: "Ananya C R",
    designation: "Third Year",
    profilePhoto: ananya,
    linkedin: "https://www.linkedin.com/in/c-r-ananya-71a052259"
  },
  {
    name: "Pavan J",
    designation: "Third Year",
    profilePhoto: pavan,
    linkedin: "https://www.linkedin.com/in/pavan-j-2a9965255/"
  },
  {
    name: "Purbayan Biswas",
    designation: "Third Year",
    profilePhoto: purbayan,
    linkedin: "https://www.linkedin.com/in/purbayan-biswas-49b767210/"
  },
  {
    name: "Aditya Agarwal",
    designation: "Third Year",
    profilePhoto: aditya,
    linkedin: "https://www.linkedin.com/in/aditya-agarwal-3175ab259"
  },
  
  // Second Year Members
  {
    name: "Jahnvi Sharma",
    designation: "Second Year",
    profilePhoto: jahnvi,
    linkedin: "https://www.linkedin.com/in/jahnvi-sharma-41b877243/"
  },
  {
    name: "Advaita Amrit",
    designation: "Second Year",
    profilePhoto: advaita,
    linkedin: "https://www.linkedin.com/in/advaita-amrit/"
  },
  {
    name: "Pratik Gautam",
    designation: "Second Year",
    profilePhoto: pratik,
    linkedin: "https://www.linkedin.com/in/pratik-gautam-412b9029a/"
  },
  {
    name: "Anaya Singh",
    designation: "Second Year",
    profilePhoto: anaya,
    linkedin: "https://www.linkedin.com/in/anaya-singh-386140302/"
  },
  {
    name: "Tarun S Muragodnavar",
    designation: "Second Year",
    profilePhoto: tarun,
    linkedin: "https://www.linkedin.com/in/tarun-muragodnavar-40b80627b"
  },
  {
    name: "Aryan Kumar Sinha",
    designation: "Second Year",
    profilePhoto: aryanSecond,
    linkedin: "https://www.linkedin.com/in/aryan-kumar-sinha-59b3aa2aa/"
  },
  {
    name: "Shashank H",
    designation: "Second Year",
    profilePhoto: shshank,
    linkedin: "https://www.linkedin.com/in/shashank-h-27997b202/"
  },
  {
    name: "Jishnu Khargharia",
    designation: "Second Year",
    profilePhoto: jishnu,
    linkedin: "http://www.linkedin.com/in/jishnukhargharia"
  },
  {
    name: "Kritika",
    designation: "Second Year",
    profilePhoto: kritika,
    linkedin: "https://www.linkedin.com/in/kritika-438581266"
  },
  {
    name: "Aditya Lochan",
    designation: "Second Year",
    profilePhoto: lochan,
    linkedin: "https://www.linkedin.com/in/aditya-lochan-a119a71a2/"
  },
  {
    name: "Dhruva D",
    designation: "Second Year",
    profilePhoto: dhruva,
    linkedin: "https://www.linkedin.com/in/dhruva-d-7b40b0253/"
  },
  {
    name: "Shravya GS",
    designation: "Second Year",
    profilePhoto: shravya,
    linkedin: "https://www.linkedin.com/in/shravya-gs-572214302/"
  },
  {
    name: "Rishabh Singh",
    designation: "Second Year",
    profilePhoto: rishabh,
    linkedin: "https://www.linkedin.com/in/rishabh-s-542b02271/"
  },
  {
    name: "Yash Jadhav",
    designation: "Second Year",
    profilePhoto: yash,
    linkedin: "https://www.linkedin.com/in/yash-jadhav-7ba599264/"
  }
];

const designationOrder = [
  "Chairman", "Vice-Chairman", "Treasurer", "Web Dev Lead", "Android Dev Lead",
  "Tech Lead", "Photoshop Lead", "Digital Lead", "Fourth Year", "Third Year", "Second Year", "First Year", "Member"
];

const Team = () => {
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
          return designationOrder.indexOf(a.designation) - designationOrder.indexOf(b.designation);
        });

  return (
    <div className="w-full min-h-screen py-[7rem] px-4 bg-[#272928]">
      <h2 className="text-4xl sm:text-5xl md:text-6xl text-[#ed5a2d] text-center font-bold tracking-tight">
        Our Team
      </h2>
      <div className="max-w-[1240px] mx-auto mt-12 grid gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedTeamMembers.slice(0, 2).map((person, i) => (
            <ProfileCard key={i} person={person} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {sortedTeamMembers.slice(2).map((person, i) => (
            <ProfileCard key={i} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ person }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[20rem] h-auto bg-black/40 backdrop-blur-xl rounded-2xl border-[2px] border-[rgba(237,90,45,0.8)] shadow-lg transition-transform duration-300 hover:shadow-xl flex flex-col items-center p-6 hover:scale-105">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] shadow-md border-[rgba(237,90,45,0.8)]">
          <img 
            className="w-full h-full object-cover" 
            src={person.profilePhoto} 
            alt={person.name}
            onError={(e) => e.target.src = "/default_profile.png"}
          />
        </div>
        <h1 className="mt-4 text-center text-xl md:text-2xl font-semibold text-white leading-7 tracking-tight">{person.name}</h1>
        <h3 className="text-center text-sm md:text-md text-gray-300 font-medium leading-6">{person.designation}</h3>
        <div className="mt-auto pt-4 flex justify-center space-x-3">
          {person.linkedin && (
            <a 
              href={person.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl text-gray-400 hover:text-blue-400 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          )}
          {person.github && (
            <a 
              href={person.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl text-gray-400 hover:text-gray-300 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          )}
          {person.email && (
            <a 
              href={`mailto:${person.email}`} 
              className="text-xl text-gray-400 hover:text-red-400 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          )}
          {person.instagram && (
            <a 
              href={`https://instagram.com/${person.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl text-gray-400 hover:text-pink-500 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          )}
          {person.phone && (
            <a 
              href={`tel:${person.phone}`} 
              className="text-xl text-gray-400 hover:text-green-500 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            >
              <FontAwesomeIcon icon={faPhone} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
