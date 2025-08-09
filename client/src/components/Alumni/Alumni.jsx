import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

// --- IMPORTS FOR THE 2024 BATCH ---
import aadarsh from "../../assets/team/fourth/aadarsh.jpg";
import aditi from "../../assets/team/fourth/aditi.jpg";
import aryan from "../../assets/team/fourth/aryan.jpg";
import ashutosh from "../../assets/team/fourth/ashutosh.jpg";
import badal from "../../assets/team/fourth/badal.jpeg";
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
import vivek_fourth from "../../assets/team/fourth/vivek.jpg"; // Renamed to avoid conflict
import harsh from "../../assets/team/fourth/gaurav.jpg";

// --- IMPORTS FOR ALL EXISTING ALUMNI ---
import ansa from "./../../assets/alumni/Ansa.jpg";
import asra from "./../../assets/alumni/Asra.png";
import gaurav from "./../../assets/alumni/Gaurav Kumar.jpg";
import rahul from "./../../assets/alumni/Rahul Kumar.jpg";
import rajeev from "./../../assets/alumni/Rajeev Ranjan.jpg";
import rohan from "./../../assets/alumni/RohanJadhav.jpg";
import shivu from "./../../assets/alumni/Shivu P.jpg";
import amaan from "./../../assets/alumni/amanaa.jpeg";
import anushant from "./../../assets/alumni/anushant.jpg";
import keshav from "./../../assets/alumni/keshav.jpg";
import kundan from "./../../assets/alumni/kundan - K k.jpeg";
import meghraj from "./../../assets/alumni/meghraj.jpeg";
import pradhan from "./../../assets/alumni/pradhan.jpg";
import shaswat from "./../../assets/alumni/shashwat.jpg";
import shristi from "./../../assets/alumni/shrishti.jpeg";
import tanmay from "./../../assets/alumni/Tanmay.jpg";
import shubham from "./../../assets/alumni/shubham.png";
import vivek from "./../../assets/alumni/vivekMoha.jpg";
import abhinav from "./../../assets/alumni/abhinav.jpeg";
import pankaj from "./../../assets/alumni/pankaj.jpeg";
import shaksham from "./../../assets/alumni/shaksham.jpeg";
import manojna from "./../../assets/alumni/manojna.jpeg";
import vivk from "./../../assets/alumni/vivk.jpeg";
import prince from "./../../assets/alumni/prince.jpeg";
import anurag from "./../../assets/alumni/anurag.jpeg";
import nitish from "./../../assets/alumni/nitish.jpeg";
import nalini from "./../../assets/alumni/nalini.jpeg";
import krishnakant from "./../../assets/alumni/raj.jpeg";
import ranjeet from "./../../assets/alumni/Ranjeet.jpg";
import amit from "./../../assets/alumni/amit.jpeg";
import ankit from "./../../assets/alumni/Ankit Gourav.jpg";
import VM from "./../../assets/alumni/Vishal.jpg";
import Sb from "./../../assets/alumni/Sudhamshu.jpg";
import Harshitha from "./../../assets/alumni/Harshitha.jpg";
import HarshKanth from "./../../assets/alumni/HARSHKANT.jpeg";
import hrishi from "./../../assets/alumni/Hrishikesh.jpg";
import amang from "./../../assets/alumni/Aman.jpg";
import razee from "./../../assets/alumni/Razee.jpg";
import utk from "./../../assets/alumni/Utkarsh Sahay.jpg";
import shrutiB from "./../../assets/alumni/Shruti.jpg";
import ks from "./../../assets/alumni/Kshitiz Singh.jpg";
import aditiD from "./../../assets/alumni/Aditi.jpg";
import sumanth from "./../../assets/alumni/Sumanth Jain.jpg";
import adityRaj from "./../../assets/alumni/ADITYA RAJ.jpg";
import AdithyaD from "./../../assets/alumni/AdityaD.jpg";
import Ashish from "./../../assets/alumni/Ashish.jpg";
import AyushmanSharma from "./../../assets/alumni/AyushmanSharma.jpeg";
import Jeevitha from "./../../assets/alumni/Jeevitha.jpg";
import Kunal from "./../../assets/alumni/Kunal.jpg";
import ojas from "./../../assets/alumni/ojas.jpg";
import Sameer from "./../../assets/alumni/Sameer.jpg";
import TannisthaNandy from "./../../assets/alumni/Tannistha Nandy .jpg";
import YashaswiniK_1 from "./../../assets/alumni/YashaswiniK_1.jpg";

// --- DATA for all previous Alumni ---
const existingAlumni = [
  { name: "Ranjeet Kumar Chaurasiya", role: "Informatica SME at Kyndryl India", email: "", ima: ranjeet, git: "", linkedin: "https://www.linkedin.com/in/ranjeetchaurasiya" },
  { name: "Ankit Gourav", role: "Deep Learning Engineer at Blaize", email: "", ima: ankit, git: "", linkedin: "https://www.linkedin.com/in/ankit-gourav-b611b7192/" },
  { name: "Vivek Kumar", role: "Full-Stack devloper @ Airbus", email: "", ima: vivk, git: "", linkedin: "https://www.linkedin.com/in/vivek-kumar-877348105/" },
  { name: "Prince Kumar", role: "Senior Software Engineer @ Juniper Networks", email: "", ima: prince, git: "", linkedin: "https://www.linkedin.com/in/prince-kumar-45a19a10a/" },
  { name: "Anurag Shahwal", role: "Senior Manager at Morgan Stanley", email: "", ima: anurag, git: "", linkedin: "https://www.linkedin.com/in/anurag-shahwal/" },
  { name: "Nitish Kumar", role: "MDM Developer(Reltio)", email: "", ima: nitish, git: "", linkedin: "https://www.linkedin.com/in/nitish-kumar-49741a141/" },
  { name: "Nalini Singh", role: "Software Engineer 3 at Walmart", email: "", ima: nalini, git: "", linkedin: "https://www.linkedin.com/in/nalini-singh-82a97412b/" },
  { name: "Rajeev Ranjan", role: "Software Engineer at Nvidia", email: "Ranjan.rajeev1609@gmail.com", ima: rajeev, git: "", linkedin: "https://www.linkedin.com/in/rajeev-ranjan-426b241b0/" },
  { name: "Vivek Mohla", role: "Escalation engineer Microsoft ", email: "vivekmohla31@gmail.com", ima: vivek, git: "", linkedin: "https://www.linkedin.com/in/vivek-mohla-83a44115a" },
  { name: "Shubham Shekhar", role: "Lead Developer (AI, Fullstack)", email: "shubhamshekhar576@gmail.com", ima: shubham, git: "https://github.com/Shubham567", linkedin: "https://www.linkedin.com/in/shekhar567/" },
  { name: "Gaurav Kumar", role: "Manager - Advance Automation and Robotics", email: "gaurav.1si11ee016@gmail.com", ima: gaurav, git: "", linkedin: "https://www.linkedin.com/in/gaurav-kumar-60277b9a" },
  { name: "Rahul Kumar", role: "Alumni", email: "rahul.1si15ee029@gmail.com", ima: rahul, git: "", linkedin: "https://www.linkedin.com/in/rahul-kr96" },
  { name: "Rohan Jadhav", role: "Software developer ", email: "jadhavrohan534@gmail.com", ima: rohan, git: "", linkedin: "https://www.linkedin.com/in/rohan-jadhav-717385186" },
  { name: "Pradhan V", role: "Technical specialist ", email: "pradhan772@gmail.com", ima: pradhan, git: "", linkedin: "https://www.linkedin.com/in/pradhan4v" },
  { name: "KESHAV KUMAR MISHRA", role: "Commercial Pilot", email: "kkm01.1998@gmail.com", ima: keshav, git: "", linkedin: "https://www.linkedin.com/in/kkmhere" },
  { name: "Pankaj M Thakur", role: "Network Consulting Engineer - II at Cisco", email: "", ima: pankaj, git: "", linkedin: "https://www.linkedin.com/in/pankajthakur62/" },
  { name: "Abhinav Kumar", role: "Full Stack Developer @Speridian Technologies", email: "", ima: abhinav, git: "", linkedin: "https://www.linkedin.com/in/abhinav-kumar-804473196/" },
  { name: "Amit Anand", role: "System Engineer at Mahindra Group", email: "", ima: amit, git: "", linkedin: "https://www.linkedin.com/in/amitanand509/" },
  { name: "Krishnkant Jaiswal", role: "SDE-1 At Pick Your Trail", email: "", ima: krishnakant, git: "", linkedin: "https://www.linkedin.com/in/krishnkant-jaiswal-04578214a/" },
  { name: "Kundan Kumar", role: "Alumni, UPSC Civil Services", email: "kundan.bvm@gmail.com", ima: kundan, git: "kundank123", linkedin: "https://www.linkedin.com/in/kundan-kumar-78a6a0145" },
  { name: "Shaksham Sinha", role: "SDE 1 @ yellow.ai", email: "", ima: shaksham, git: "", linkedin: "https://www.linkedin.com/in/shaksham-sinha-788a19190/" },
  { name: "Manojna Rao", role: "Associate Engineer @ L&T Technology Services Limited", email: "", ima: manojna, git: "", linkedin: "https://www.linkedin.com/in/manojna-rao-002892141/" },
  { name: "Anushant Bhushan", role: "Full Stack Engineer", email: "anushant.2k16@gmail.com", ima: anushant, git: "", linkedin: "https://www.linkedin.com/in/anushant-bhushan-354bb4184" },
  { name: "Amaan Zia", role: "Test Solutions Engineer at Micron Technology ", email: "amaanzia1si17ec004@gmail.com", ima: amaan, git: "", linkedin: "" },
  { name: "Asra Sadik", role: "Alumni", email: "asramdsadik@gmail.com", ima: asra, git: "", linkedin: "https://www.linkedin.com/in/asrasadik/" },
  { name: "Shivaneeth P", role: "Associate software developer", email: "shivu61133@gmail.com", ima: shivu, git: "", linkedin: "" },
  { name: "Shashwat Shrivastava", role: "Decision Analytics Associate at ZS Associates", email: "shashwat.shrivastava21@gmail.com", ima: shaswat, git: "", linkedin: "https://www.linkedin.com/mwlite/in/shashwat-shrivastava-6a49021a8" },
  { name: "Srishti Gupta", role: " IAM Analyst @vmware", email: "2362001srishti@gmail.com", ima: shristi, git: "", linkedin: "https://www.linkedin.com/in/srishti-gupta-02b6b71b3" },
  { name: "Megharaj Goudar", role: "Junior Manager (JSW Steel)", email: "megharajgoudar1999@gmail.com", ima: meghraj, git: "", linkedin: "https://www.linkedin.com/in/megharaj-goudar-8b5232193" },
  { name: "Ansa S Mathew", role: " DC Analyst in Deloitte USI ", email: "ansasmathew@gmail.com", ima: ansa, git: "", linkedin: "https://www.linkedin.com/in/ansa-s-mathew/" },
  { name: "Tanmay M", role: " Software developer", email: "tanmaym2k@gmail.com", ima: tanmay, git: "", linkedin: "https://www.linkedin.com/in/tanmaytan" },
  { name: "Vishal Mishra", linkedin: "https://www.linkedin.com/in/vishal-kumar-575724206", ima: VM, role: "Enterprise Software Engineer at Wolters Kluwer" },
  { id: 2, name: "Sudhamshu Bhatta S", linkedin: "https://www.linkedin.com/in/sudhamshu-bhat", ima: Sb, role: "Software Engineer at Tally Solutions" },
  { name: "Harshitha M", linkedin: "https://www.linkedin.com/company/corsit/", ima: Harshitha, role: "Assistant Development Engineer at Signify Innovation Labs" },
  { name: "Hrishikesh Pradhan", linkedin: "https://www.linkedin.com/company/corsit/", ima: hrishi, role: "Full Stack Developer at Siemens Healthineers" },
  { name: "Aman Gupta", linkedin: "https://www.linkedin.com/in/aman-gupta-b420751b2/", ima: amang, role: "GET at Mercedes Benz R&D" },
  { name: "Aditi Dubey", linkedin: "https://www.linkedin.com/in/aditi-dubey-0007", ima: aditiD, role: "Software Engineer at JP Morgan Chase & Co." },
  { name: "Kshitiz Singh", linkedin: "https://www.linkedin.com/company/corsit/", ima: ks, role: "Alumni" },
  { name: "Aditya Raj", linkedin: "https://www.linkedin.com/company/corsit/", ima: adityRaj, role: "Software developer at RedBus" },
  { name: "Utkarsh Sahay", linkedin: "https://www.linkedin.com/in/utkarsh-sahay-84ab5a222", ima: utk, role: "Cloud Engineer at Aptean" },
  { name: "Razee Shrivastav", linkedin: "https://www.linkedin.com/in/razee-srivastav-90034b244", ima: razee, role: "Software Development Engineer at Amadeus Software Labs" },
  { name: "Harshkant", linkedin: "https://www.linkedin.com/company/corsit/", ima: HarshKanth, role: "Alumni" },
  { name: "Shruti Bharadwaj", linkedin: "https://www.linkedin.com/in/shruti-bhardwaj-266344220", ima: shrutiB, role: "Alumni" },
  { name: "Sumanth Jain", linkedin: "https://www.linkedin.com/in/sumanth-jain-v-b-9a3188218", ima: sumanth, role: "DevOps Engineer at Light & Wonder" },
  { name: "Ojas Sangra", linkedin: "https://www.linkedin.com/in/ojas-sangra05/", ima: ojas, role: "Oracle - Associate Applications Developer" },
  { name: "Ashish Mahanth", linkedin: "https://www.linkedin.com/in/ashish-mahanth-887b0721b/", ima: Ashish, role: "Microchip -Software Engineer 1" },
  { name: "Kunal", linkedin: "https://www.linkedin.com/in/kunal-chanda-104a63226/", ima: Kunal, role: "Oracle - Associate Engineer" },
  { name: "Sameer Kumar", linkedin: "https://www.linkedin.com/in/sameer-shetty-478481217/", ima: Sameer, role: "Contentstack - Associate Software Engineer" },
  { name: "Ayushman Sharma", linkedin: "https://www.linkedin.com/in/ayushmansrma/", ima: AyushmanSharma, role: "Delloite - Analyst" },
  { name: "Jeevitha", linkedin: "https://www.linkedin.com/in/jeevitha-k-a-744405229/", ima: Jeevitha, role: "Oracle - Associate application developer" },
  { name: "Tannistha Nandy", linkedin: "https://www.linkedin.com/in/tannistha-nandy-568a8131a/", ima: TannisthaNandy, role: "Toshiba - Associate software engineer" },
  { name: "Yashaswini", linkedin: "https://www.linkedin.com/in/yashaswini-kodi-924258227/", ima: YashaswiniK_1, role: "Saks Cloud Services - Cloud Engineer" },
  { name: "Aditya Dubey", linkedin: "https://www.linkedin.com/in/aditya-dubey-611445331/", ima: AdithyaD, role: "Alumini" },
];

// --- DATA for the new 2024 Batch ---
const graduatingBatch2024 = [
  { name: "Jatin Sharma", role: "Associate SDE at State Street", ima: jatin, linkedin: "https://www.linkedin.com/in/jatin-sharma-669590142" },
  { name: "Ujjawal Singh", role: "Business Analyst at Impact Analytics", ima: ujjawal, linkedin: "https://www.linkedin.com/in/ujjawal-singh-4a4817229" },
  { name: "Kumar Harsh", role: "Programming Analyst at Cognizant", ima: kumar, linkedin: "https://www.linkedin.com/in/kumar-harsh-39bb2b249" },
  { name: "Namrata Bharadwaj", role: "Associate Engineer at State Street", ima: namrata, linkedin: "https://www.linkedin.com/in/namratabharadwaj/" },
  { name: "Sharanya Bhat", role: "Siemens Healthineers", ima: sharanya, linkedin: "https://www.linkedin.com/in/sharanya-bhat-b2070a239" },
  { name: "Aadarsh Shriniwas", role: "SDE at RedBus", ima: aadarsh, linkedin: "https://www.linkedin.com/in/aadarsh-shriniwas-512047227" },
  { name: "Siddhant Raj", role: "Associate Engineer at Oracle", ima: siddhant, linkedin: "https://www.linkedin.com/in/siddhant-raj-3a804a2a9/" }, // Placeholder
  { name: "Aditi Joshi", role: "SDE at Nike", ima: aditi, linkedin: "https://www.linkedin.com/in/aditi-joshi-5a260b229" },
  { name: "Lekhana Patel", role: "J.P. Morgan & Chase", ima: lekhana, linkedin: "https://www.linkedin.com/in/lekhana-patel-3b8986225" },
  { name: "Ashutosh Malviya", role: "Associate Engineer at State Street", ima: ashutosh, linkedin: "https://www.linkedin.com/in/ashumalviya" },
  { name: "Rishav Shekhar", role: "TCS Ninja", ima: rishav, linkedin: "https://www.linkedin.com/in/rishav-shekhar-a21279232" },
  { name: "Harsh Gaurav", role: "Technology Intern at Saks", ima: harsh, linkedin: "https://www.linkedin.com/in/harsh-gaurav-1434b624b" },
  { name: "Suraj Aribenchi", role: "Data Scientist at MIQ", ima: suraj, linkedin: "https://www.linkedin.com/in/suraj-aribenchi-9b5340239/" },
  { name: "Vivek M", role: "Associate Engineer at State Street", ima: vivek_fourth, linkedin: "https://www.linkedin.com/in/vivekindev/" },
  { name: "Vaishali Choudhary", role: "Analog Layout Engineer at Texas Instruments", ima: vaishali, linkedin: "https://www.linkedin.com/in/b-vaishali-choudhary-671075239" },
  { name: "Mayank Pandey", role: "Technology Intern at Saks", ima: mayank, linkedin: "https://www.linkedin.com/in/mayank-pandey-1a16b7240" },
  { name: "Badal Prakash Narayan", role: "Associate Software at Eurofins", ima: badal, linkedin: "https://www.linkedin.com/in/badal-prakash-narayan-a68b5a239/" },
  { name: "Aryan", role: "TCS Ninja", ima: aryan, linkedin: "https://www.linkedin.com/in/aryan-kumar-86535724b/" },
];

// Combine the two lists, with the 2024 batch at the end
const people = [...existingAlumni, ...graduatingBatch2024];

export default function Alumni() {
  return (
    <div className="py-16 sm:py-20 md:py-24 bg-[#272928] text-[#f7ffff]">
      <div className="pt-8 mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#ed5a2d] tracking-tight">
            Meet our Alumni
          </h2>
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl leading-8 sm:leading-9">
            Carrying Forward the Legacy and Making an Impact!
          </p>
        </div>

        <ul
          role="list"
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
        >
          {people.map((person, i) => (
            <li
              key={i}
              className="flex flex-col items-center text-center rounded-2xl p-5 sm:p-6 border-[2px] bg-black/40 
                         backdrop-blur-xl min-h-72 sm:min-h-80 border-[rgba(237,90,45,0.8)] shadow-[0_0_8px_rgba(237,90,45,0.5)] 
                         transition-all duration-300 hover:shadow-[0_0_12px_rgba(237,90,45,0.8)]"
            >
              <div className="w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-full overflow-hidden border-[3px] shadow-md border-[rgba(237,90,45,0.8)]">
                <img
                  className="w-full h-full object-cover"
                  src={person.ima}
                  alt={person.name}
                />
              </div>
              <div className="mt-4 sm:mt-5">
                <h3 className="text-lg sm:text-xl font-semibold leading-6 sm:leading-7 tracking-tight text-white mb-1">
                  {person.name}
                </h3>
                <p className="text-sm sm:text-md font-medium leading-5 sm:leading-6 text-gray-300 mb-2 sm:mb-3">
                  {person.role}
                </p>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl sm:text-3xl text-gray-400 hover:text-blue-400 transition-transform 
                             duration-300 hover:scale-110 hover:rotate-6"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}