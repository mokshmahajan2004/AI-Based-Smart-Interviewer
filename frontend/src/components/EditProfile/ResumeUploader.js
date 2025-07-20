import React, { useRef } from "react";
import { FiUploadCloud, FiFileText, FiTrash2 } from "react-icons/fi";

const ResumeUploader = ({ resumeFile, setResumeFile, resumeURL, setResumeURL }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setResumeURL(URL.createObjectURL(file));
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleRemove = () => {
    setResumeFile(null);
    setResumeURL("");
    fileInputRef.current.value = "";
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-yellow-400 mb-3">📄 Resume</h3>

      <div className="flex items-center gap-3">
        <label
          className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
        >
          <FiUploadCloud />
          Upload PDF
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {resumeFile || resumeURL ? (
          <>
            <div className="flex items-center gap-2 bg-[#1e293b] text-white px-3 py-1.5 rounded-md text-sm">
              <FiFileText />
              {resumeFile?.name || "Resume.pdf"}
              {resumeURL && (
                <a
                  href={resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-yellow-400 ml-2"
                >
                  View
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300"
              title="Remove"
            >
              <FiTrash2 />
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-400">No file uploaded</span>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;
