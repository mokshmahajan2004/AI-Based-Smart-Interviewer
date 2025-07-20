import React from "react";
import { FiLinkedin, FiGithub, FiGlobe, FiTwitter } from "react-icons/fi";

const SocialLinksForm = ({ socialLinks, setSocialLinks }) => {
  const handleChange = (field, value) => {
    setSocialLinks({ ...socialLinks, [field]: value });
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-yellow-400 mb-3">🔗 Social Links</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FiLinkedin className="text-blue-400" />
          <input
            type="url"
            placeholder="LinkedIn Profile URL"
            value={socialLinks.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            className="w-full px-4 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
          />
        </div>

        <div className="flex items-center gap-3">
          <FiGithub className="text-white" />
          <input
            type="url"
            placeholder="GitHub Profile URL"
            value={socialLinks.github}
            onChange={(e) => handleChange("github", e.target.value)}
            className="w-full px-4 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
          />
        </div>

        <div className="flex items-center gap-3">
          <FiGlobe className="text-green-400" />
          <input
            type="url"
            placeholder="Portfolio / Website URL"
            value={socialLinks.portfolio}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            className="w-full px-4 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
          />
        </div>

        <div className="flex items-center gap-3">
          <FiTwitter className="text-sky-400" />
          <input
            type="url"
            placeholder="Twitter Profile URL"
            value={socialLinks.twitter}
            onChange={(e) => handleChange("twitter", e.target.value)}
            className="w-full px-4 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialLinksForm;
