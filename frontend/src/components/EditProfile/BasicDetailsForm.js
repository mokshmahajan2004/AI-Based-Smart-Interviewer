import React from "react";

const BasicDetailsForm = ({ fullName, setFullName, email, mobile, setMobile, gender, setGender, dob, setDob }) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm block text-gray-300 mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 bg-[#0f172a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div>
        <label className="text-sm block text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2 bg-[#1e293b] border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="text-sm block text-gray-300 mb-1">Mobile Number</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full px-4 py-2 bg-[#0f172a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm block text-gray-300 mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 bg-[#0f172a] border border-gray-600 rounded-md text-white"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm block text-gray-300 mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2 bg-[#0f172a] border border-gray-600 rounded-md text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
