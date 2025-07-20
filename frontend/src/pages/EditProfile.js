import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Config"; // ✅ now inside /src

import Sidebar from "../components/Sidebar"; // ✅ now inside /src/components
import ProfilePhotoUploader from "../components/EditProfile/ProfilePhotoUploader";
import BasicDetailsForm from "../components/EditProfile/BasicDetailsForm";
import EducationSection from "../components/EditProfile/EducationSection";
import ExperienceSection from "../components/EditProfile/ExperienceSection";
import SkillsInput from "../components/EditProfile/SkillsInput";
import SocialLinksForm from "../components/EditProfile/SocialLinksForm";
import ResumeUploader from "../components/EditProfile/ResumeUploader";

const EditProfile = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [educationList, setEducationList] = useState([
    { degree: "", institution: "", year: "", description: "" },
  ]);
  const [experienceList, setExperienceList] = useState([
    { role: "", company: "", from: "", to: "", description: "" },
  ]);
  const [skills, setSkills] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    twitter: "",
  });

  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeURL, setResumeURL] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      setPreview(currentUser.photoURL || "");
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      let finalPhotoURL = preview;

      // Profile photo upload
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload-profile`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        finalPhotoURL = data.url;
      }

      // Resume upload
      let resumeFinalURL = resumeURL;
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload-resume`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        resumeFinalURL = data.url;
      }

      // Update Firebase profile
      await updateProfile(currentUser, {
        displayName: fullName,
        photoURL: finalPhotoURL,
      });

      await setDoc(doc(db, "users", currentUser.uid), {
        name: fullName,
        email,
        mobile,
        gender,
        dob,
        photoURL: finalPhotoURL,
        education: educationList,
        experience: experienceList,
        skills,
        socialLinks,
        resumeURL: resumeFinalURL,
        updatedAt: new Date(),
      });

      toast.success("✅ Profile updated!");
      window.dispatchEvent(new Event("profileUpdated"));
      navigate("/dashboard");
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("❌ Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 px-6 py-10 ml-16 group-hover:ml-56">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2
            className="text-4xl font-bold text-center text-yellow-400"
            style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)" }}
          >
            ✨ Update Your Profile
          </h2>

          <form onSubmit={handleSave}>
            <div className="bg-[#1e293b] p-6 rounded-xl shadow-xl border border-gray-700 space-y-10">
              <ProfilePhotoUploader
                preview={preview}
                setPreview={setPreview}
                setFile={setFile}
                fullName={fullName}
              />

              <section>
                <h3 className="text-2xl font-semibold text-yellow-400 mb-4">🧑 Basic Details</h3>
                <BasicDetailsForm
                  fullName={fullName}
                  setFullName={setFullName}
                  email={email}
                  mobile={mobile}
                  setMobile={setMobile}
                  gender={gender}
                  setGender={setGender}
                  dob={dob}
                  setDob={setDob}
                />
              </section>

              <section>
                <EducationSection
                  educationList={educationList}
                  setEducationList={setEducationList}
                />
              </section>

              <section>
                <ExperienceSection
                  experienceList={experienceList}
                  setExperienceList={setExperienceList}
                />
              </section>

              <section>
                <SkillsInput skills={skills} setSkills={setSkills} />
              </section>

              <section>
                <SocialLinksForm
                  socialLinks={socialLinks}
                  setSocialLinks={setSocialLinks}
                />
              </section>

              <section>
                <ResumeUploader
                  resumeFile={resumeFile}
                  setResumeFile={setResumeFile}
                  resumeURL={resumeURL}
                  setResumeURL={setResumeURL}
                />
              </section>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 flex justify-center items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition duration-300 shadow ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  "✅ Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
