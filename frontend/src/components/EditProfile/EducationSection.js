import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const EducationSection = ({ educationList, setEducationList }) => {
  const handleChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleAdd = () => {
    setEducationList([
      ...educationList,
      { degree: "", institution: "", year: "", description: "" },
    ]);
  };

  const handleRemove = (index) => {
    const updated = [...educationList];
    updated.splice(index, 1);
    setEducationList(updated);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-yellow-400">🎓 Education</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300"
        >
          <FiPlus /> Add
        </button>
      </div>

      {educationList.map((edu, index) => (
        <div
          key={index}
          className="mb-4 p-4 bg-[#0f172a] rounded-lg border border-gray-700 space-y-3 relative"
        >
          {educationList.length > 1 && (
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
              <label className="text-sm text-gray-300 mb-1 block">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                placeholder="e.g. B.Tech in CSE"
                className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleChange(index, "institution", e.target.value)}
                placeholder="e.g. NIT Jalandhar"
                className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Year of Graduation</label>
            <input
              type="text"
              value={edu.year}
              onChange={(e) => handleChange(index, "year", e.target.value)}
              placeholder="e.g. 2025"
              className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Description</label>
            <textarea
              value={edu.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              rows={2}
              placeholder="Optional: coursework, GPA, etc."
              className="w-full px-3 py-2 bg-[#1e293b] border border-gray-600 text-white rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
