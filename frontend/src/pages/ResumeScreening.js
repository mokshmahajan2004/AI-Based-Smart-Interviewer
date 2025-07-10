// Enhanced ResumeScreening with skill keyword highlighter and dynamic job role insertion
import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Upload, FileText, BarChart3 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ResultCard from "../components/ResultCard";
import sampleJobRolesData from "../data/sampleJobRolesData"; // dynamic job data
import BulletRewriter from "../components/BulletRewritter";
import Loader from "../components/Loader";

const ResumeScreening = () => {
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [resumeText, setResumeText] = useState(
    "React Git REST APIs Firebase Agile Node.js"
  );
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [rewrites, setRewrites] = useState([]);

  const uploadSectionRef = useRef(null); // ✅ scroll target ref

  const [llmSections, setLlmSections] = useState({
    matchScore: "",
    missingSkills: [],
    improvementTips: [],
    summary: "",
    bulletRewrites: [],
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setResume(file);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2500);
  };

  const extractKeywords = (text, topN = 20) => {
    const words =
      text
        .toLowerCase()
        .match(/\b(\w+)\b/g)
        ?.filter((word) => word.length > 3) || [];
    const freq = {};
    words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word]) => word);
  };

  const compareSkills = async () => {
    if (!resume || !jobDesc) {
      alert("Please upload resume and enter job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume_file", resume);
    formData.append("job_description", jobDesc);

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/ats-evaluate/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const raw = data.evaluation;

      const extractSection = (start, end) => {
        const pattern = new RegExp(`${start}[\\s\\S]*?${end}`, "g");
        const match = raw.match(pattern);
        return match ? match[0].replace(start, "").replace(end, "").trim() : "";
      };

      const matchScore = extractSection(
        "🎯 Match Score",
        "❌ Missing or Weak Skills"
      );
      const missing = extractSection(
        "❌ Missing or Weak Skills",
        "🧠 How to Improve"
      )
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const improve = extractSection("🧠 How to Improve", "📝 Summary")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const summary = raw.split("📝 Summary")[1]?.trim() || "";

      setLlmSections({
        matchScore,
        missingSkills: missing,
        improvementTips: improve,
        summary,
        bulletRewrites: [],
      });

      setStep(3);
    } catch (err) {
      console.error("❌ Error parsing evaluation:", err);
      alert("Something went wrong. Please check the backend response.");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => {
    const steps = [
      { number: 1, label: "Upload Resume", icon: <Upload size={18} /> },
      { number: 2, label: "Add Job Description", icon: <FileText size={18} /> },
      { number: 3, label: "View Results", icon: <BarChart3 size={18} /> },
    ];
    return (
      <div className="flex justify-center items-center gap-8 mb-12 mt-6 px-4 flex-wrap">
        {steps.map((stepItem, index) => (
          <div
            key={index}
            className="flex items-center relative cursor-pointer group"
            onClick={() => stepItem.number < step && setStep(stepItem.number)}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-lg font-bold z-10 transition-all duration-300 ${
                  step === stepItem.number
                    ? "bg-yellow-400 text-black shadow-xl ring-4 ring-yellow-300"
                    : step > stepItem.number
                    ? "bg-green-500 text-white"
                    : "border-2 border-gray-500 text-white bg-[#1e293b]"
                }`}
              >
                {step > stepItem.number ? <Check size={18} /> : stepItem.icon}
              </div>
              <p
                className={`mt-2 text-xs md:text-sm text-center font-medium w-24 md:w-32 transition-colors duration-200 ${
                  step === stepItem.number
                    ? "text-white"
                    : "text-gray-400 group-hover:text-yellow-300"
                }`}
              >
                {stepItem.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden sm:block w-10 md:w-16 h-1 bg-gray-600 mx-2 mt-1 relative">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                    step > stepItem.number
                      ? "bg-yellow-400 w-full"
                      : "bg-gray-600 w-0"
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-16 group-hover:ml-56 px-4 sm:px-6 pt-24 pb-16 bg-[#020617] max-w-full md:max-w-[calc(100%-4rem)] mx-auto">
        <div className="min-h-screen bg-[#020617] text-white px-4 py-12 font-sans relative">
          <div
            className="fixed top-0 left-0 h-1 bg-yellow-400 z-50 transition-all duration-500"
            style={{ width: `${(step - 1) * 50}%` }}
          />
          <section className="text-center px-6 pt-16 pb-14 max-w-6xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 blur-2xl pointer-events-none"></div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-yellow-400 mb-6 leading-tight drop-shadow-sm">
              Supercharge Your Resume with AI
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Leverage advanced AI to align your resume with top job
              descriptions and boost your chances of clearing any ATS (Applicant
              Tracking System). Let your resume speak the language recruiters
              understand.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-md transition duration-300"
                onClick={() => {
                  setStep(1);
                  setTimeout(() => {
                    uploadSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100);
                }}
              >
                Get Started
              </button>
            </div>
          </section>

          <StepIndicator />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <div ref={uploadSectionRef}>
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl mx-auto border-2 border-dashed border-cyan-500 rounded-xl bg-[#0f172a]"
                >
                  <div className="bg-[#1e293b] text-sm font-semibold text-white px-6 py-3 border-b border-cyan-800 rounded-t-xl">
                    UPLOAD YOUR RESUME
                  </div>
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    {!loading ? (
                      <>
                        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
                          Upload your resume to get started
                        </h2>
                        <label className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg cursor-pointer transition mb-2">
                          Upload your resume
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleUpload}
                            hidden
                          />
                        </label>
                        {resume && (
                          <>
                            <p className="text-sm text-green-400 mt-1">
                              Uploaded: {resume.name}
                            </p>
                            <button
                              className="mt-4 text-sm px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md"
                              onClick={() => setStep(2)}
                            >
                              Continue →
                            </button>
                          </>
                        )}
                        <p className="text-sm text-gray-400">
                          as .pdf or .docx file
                        </p>
                        <p className="text-sm text-cyan-400 mt-2 underline cursor-pointer hover:text-cyan-300">
                          Or paste resume text
                        </p>
                      </>
                    ) : (
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Analyzing...</h3>
                        <p className="text-sm text-gray-400 mb-6">
                          Analyzing your resume…
                        </p>
                        <div className="w-60 h-4 bg-gray-700 rounded-full overflow-hidden mx-auto">
                          <div className="h-full w-full bg-yellow-400 animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto border border-cyan-600 rounded-xl bg-[#0f172a]"
              >
                <div className="grid md:grid-cols-2">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Paste a Job Description
                    </h3>
                    <textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      rows="10"
                      className="w-full p-4 text-sm bg-[#1e293b] border border-cyan-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono"
                      placeholder="Paste job description here..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {jobDesc.trim().split(/\s+/).length} words
                    </p>
                    <button
                      onClick={() => {
                        compareSkills();
                        setStep(3);
                      }}
                      className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 font-semibold"
                    >
                      Scan Resume →
                    </button>
                  </div>
                  <div className="p-6 border-t md:border-t-0 md:border-l border-cyan-800">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">
                      Or Select a Sample Job Role
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sampleJobRolesData.map((role) => (
                        <button
                          key={role.title}
                          onClick={() => setJobDesc(role.description)}
                          title={`Insert ${role.title} JD`}
                          className="bg-[#1e293b] border border-cyan-700 hover:border-yellow-400 hover:bg-[#111827] text-white text-sm py-3 px-4 rounded-lg shadow-sm transition duration-300 text-left hover:text-yellow-300"
                        >
                          {role.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 &&
              (loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-5xl mx-auto px-4 sm:px-6"
                >
                  <Loader />
                </motion.div>
              ) : (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6"
                >
                  <ResultCard
                    title="Match Score"
                    icon="🎯"
                    content={llmSections.matchScore}
                  />
                  <ResultCard
                    title="Critical Missing Skills"
                    icon="❌"
                    content={llmSections.missingSkills}
                  />
                  <ResultCard
                    title="How the Candidate Can Improve"
                    icon="🧠"
                    content={llmSections.improvementTips}
                  />
                  <ResultCard
                    title="Additional Feedback"
                    icon="💡"
                    content={llmSections.summary}
                  />

                  {rewrites.length > 0 && (
                    <div className="bg-[#0f172a] border border-yellow-500 rounded-xl px-6 py-6 text-white space-y-4">
                      <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                        📝 AI Bullet Rewriter
                      </h2>
                      <BulletRewriter
                        bullets={rewrites}
                        setBullets={setRewrites}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
export default ResumeScreening;
