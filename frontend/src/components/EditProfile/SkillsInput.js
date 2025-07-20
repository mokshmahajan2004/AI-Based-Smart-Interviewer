import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const SkillsInput = ({ skills, setSkills }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();

    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setInputValue("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="mb-8">
      <label className="text-sm text-gray-300 mb-2 block font-medium">
        💡 Skills (Press Enter to add)
      </label>

      <form onSubmit={handleAddSkill}>
        <input
          type="text"
          placeholder="e.g. React, Python, SQL"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-4 py-2 mb-2 bg-[#1e293b] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </form>

      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="hover:text-red-600 transition"
              title="Remove"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsInput;
