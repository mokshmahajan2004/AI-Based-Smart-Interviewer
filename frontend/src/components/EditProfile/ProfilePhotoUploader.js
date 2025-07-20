import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

const ProfilePhotoUploader = ({ preview, setPreview, setFile, fullName }) => {
  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      const compressed = await imageCompression(selectedFile, options);
      setFile(compressed);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(compressed);
    } catch (err) {
      console.error("Image compression error:", err);
      toast.error("❌ Failed to compress image");
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-md mb-2">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-yellow-300 font-bold text-xl">
            {fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-2">Upload a new profile photo</p>

      <label className="cursor-pointer inline-block bg-gray-700 text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-600 transition">
        Choose File
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </label>
    </div>
  );
};

export default ProfilePhotoUploader;
