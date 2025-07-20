import React from "react";
import { FiDownload, FiMail, FiUser } from "react-icons/fi";
import { Link } from "react-scroll"; // for smooth scroll to sections

const ProfileSidebar = ({ fullName, email, preview, resumeURL }) => {
  return (
    <div className="hidden md:block sticky top-20 w-full max-w-xs bg-[#1e293b] rounded-2xl shadow-lg border border-gray-700 p-6 space-y-6 text-white">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 mb-3">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center text-yellow-300 text-3xl">
              {fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold text-yellow-400">{fullName || "Your Name"}</h2>
        <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
          <FiMail size={14} /> {email || "you@example.com"}
        </p>
      </div>

      {/* Resume */}
      {resumeURL && (
        <div className="text-center">
          <a
            href={resumeURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
          >
            <FiDownload /> Resume
          </a>
        </div>
      )}

      {/* Quick Nav */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Quick Access</h4>
        <ul className="space-y-2 text-sm">
          {[
            { label: "Basic Info", to: "basic-info" },
            { label: "Education", to: "education" },
            { label: "Experience", to: "experience" },
            { label: "Skills", to: "skills" },
            { label: "Social Links", to: "social-links" },
            { label: "Resume", to: "resume" },
          ].map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                smooth={true}
                duration={500}
                offset={-80}
                className="cursor-pointer hover:text-yellow-400 transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;
