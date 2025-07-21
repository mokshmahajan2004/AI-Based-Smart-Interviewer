import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const ExperienceSection = ({ experienceList, setExperienceList }) => {
  const handleChange = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  const handleAdd = () => {
    setExperienceList([
      ...experienceList,
      { role: "", company: "", from: "", to: "", description: "" },
    ]);
  };

  const handleRemove = (index) => {
    const updated = [...experienceList];
    updated.splice(index, 1);
    setExperienceList(updated);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-yellow-400">💼 Experience</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300"
        >
          <FiPlus /> Add
        </button>
      </div>

      {experienceList.map((exp, index) => (
        <div
          key={index}
          className="mb-4 p-4 bg-[#0f172a] rounded-lg border border-gray-700 space-y-3 relative"
        >
          {experienceList.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-3 top-3 text-red-400 hover:text-red-300"
              title="Remove"
            >
              <FiTrash2 size={16} />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Role</label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                placeholder="e.g. Flipkart"
                className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">From</label>
              <input
                type="month"
                value={exp.from}
                onChange={(e) => handleChange(index, "from", e.target.value)}
                className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">To</label>
              <input
                type="month"
                value={exp.to}
                onChange={(e) => handleChange(index, "to", e.target.value)}
                className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              rows={2}
              placeholder="Tasks, achievements, technologies..."
              className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceSection;
