// src/pages/SummaryPage.js
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const SummaryPage = () => {
  const [responses, setResponses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [interviewTime, setInterviewTime] = useState("");
  const [averageScore, setAverageScore] = useState(0);
  const [strengths, setStrengths] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);

  useEffect(() => {
    // ⏱ Calculate Interview Duration
    const start = parseInt(localStorage.getItem("interviewStart"), 10);
    const end = parseInt(localStorage.getItem("interviewEnd"), 10);

    if (!isNaN(start) && !isNaN(end)) {
      const durationInMs = end - start;
      const totalSeconds = Math.floor(durationInMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setInterviewTime(`${minutes} min ${seconds} sec`);
    } else {
      setInterviewTime("N/A");
    }

    // 🎯 Load and Process Interview Data
    const profile = JSON.parse(localStorage.getItem("interviewProfile")) || {};
    const storedResponses =
      JSON.parse(localStorage.getItem("interviewResponses")) || [];

    const totalQuestions = storedResponses.length;
    const filledResponses = [...storedResponses];

    while (filledResponses.length < totalQuestions) {
      filledResponses.push({
        question: `Question ${filledResponses.length + 1}`,
        status: "unanswered",
        answer: "",
        score: null,
        feedback: "",
        improvement: "",
      });
    }

    setUserProfile(profile);
    setResponses(filledResponses);

    const answered = filledResponses.filter((q) => q.status === "answered");
    const skipped = filledResponses.filter((q) => q.status === "unanswered");

    const avgScore = answered.length
      ? answered.reduce((sum, q) => sum + (q.score ?? 0), 0) / answered.length
      : 0;
    setAverageScore(avgScore.toFixed(1));

    const suggestions = [];
    if (skipped.length > 0) suggestions.push("Try not to skip questions.");
    if (skipped.length >= 2)
      suggestions.push("Improve your time-bound thinking.");
    if (skipped.length === 0)
      suggestions.push("You answered all questions well.");
    suggestions.push("Consider practicing with mock interviews.");

    const improvementText = filledResponses
      .map((q) => (q.improvement || "").toLowerCase())
      .join(" ");
    const courseMap = {
      structure: "https://www.udemy.com/course/communication-skills/",
      technical: "https://www.codecademy.com/learn",
      confidence: "https://www.coursera.org/learn/public-speaking",
    };
    const found = Object.entries(courseMap).filter(([key]) =>
      improvementText.includes(key)
    );
    found.forEach(([key, url]) => {
      suggestions.push(`📚 Improve ${key} → [Suggested course](${url})`);
    });

    setRecommendations(suggestions);

    const allAnswers = filledResponses
      .map((q) => (q.answer || "").toLowerCase())
      .join(" ");
    const commonStrengths = [
      "problem solving",
      "communication",
      "teamwork",
      "fast learner",
    ];
    const detectedStrengths = commonStrengths.filter((s) =>
      allAnswers.includes(s)
    );
    const detectedWeaknesses = Object.keys(courseMap).filter((w) =>
      improvementText.includes(w)
    );

    setStrengths(detectedStrengths);
    setWeakAreas(detectedWeaknesses);

    // 📄 Send data to backend to generate report
    const reportData = {
      name: profile.name || "",
      email: profile.email || "",
      role: profile.role || "",
      skills: profile.skills || "",
      experience: profile.experience || "",
      achievements: profile.achievements || "",
      notes: profile.notes || "",
      qa_feedback: filledResponses.map((q, idx) => ({
        idx: idx + 1,
        question: q.question,
        answer: q.answer,
        feedback: q.feedback,
      })),
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/generate-report`, reportData)
      .then((res) => {
        console.log("✅ Report generated:", res.data.path);
      })
      .catch((err) => {
        console.error("❌ Failed to generate report", err);
      });
  }, []);

  // Other logic and rendering remain as-is
  const answeredCount = responses.filter((q) => q.status === "answered").length;
  const unansweredCount = responses.filter(
    (q) => q.status === "unanswered"
  ).length;

  const pieData = [
    { name: "Answered", value: answeredCount },
    { name: "Unanswered", value: unansweredCount },
  ];

  const COLORS = ["#34d399", "#f87171"];

  const scoreData = responses.map((item, index) => ({
    name: `Q${index + 1}`,
    Score: item.score ?? 0,
  }));

  const getRating = (avg) => {
    if (avg >= 8) return "🟢 Excellent";
    if (avg >= 5) return "🟡 Good";
    return "🔴 Needs Improvement";
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="w-full sm:ml-16 sm:group-hover:ml-56 transition-all duration-300 px-4 sm:px-6 py-16 flex justify-center">
        <div className="max-w-6xl mx-auto bg-[#0f172a] p-6 md:p-10 rounded-xl border border-gray-700 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
            📊 Interview Summary Report
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 text-center justify-center">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-lg font-bold">{responses.length}</p>
              <p className="text-sm text-gray-300">Total Questions</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-lg font-bold">{answeredCount}</p>
              <p className="text-sm text-green-300">Answered</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-lg font-bold">{unansweredCount}</p>
              <p className="text-sm text-red-300">Unanswered</p>
            </div>
          </div>

          {/* Time Info 
      <div className="text-sm italic text-center text-gray-400 mb-6">
        ⏱ Total Interview Time: {interviewTime}
      </div>
*/}
          {/* Candidate Info */}
          <div className="bg-[#0f172a] border border-gray-600 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-2">🧾 Candidate Details</h3>
            <p>
              <strong>Name:</strong> {userProfile.name}
            </p>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p>
              <strong>Role:</strong> {userProfile.role}
            </p>
            <p>
              <strong>Skills:</strong> {userProfile.skills}
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Pie */}
            <div className="bg-[#0f172a] border border-gray-600 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-center mb-4">
                🧪 Answered vs Unanswered
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar */}
            <div className="bg-[#0f172a] border border-gray-600 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-center mb-4">
                📈 Score per Question
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Score" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Questions Summary */}
          <div className="space-y-6 mb-10">
            {responses.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  item.status === "answered"
                    ? "border-green-500"
                    : "border-red-500"
                } bg-[#0f172a]`}
              >
                <h4 className="font-semibold text-blue-300 mb-2">
                  Q{idx + 1}: {item.question}
                </h4>
                <p>
                  <strong>Status:</strong> {item.status.toUpperCase()}
                </p>
                <p>
                  <strong>Answer:</strong> {item.answer || "-"}
                </p>
                {/* <p>
                  <strong>Score:</strong> {item.score ?? "Not Rated"}/10
                </p> */}
                <p>
                  <strong>Feedback:</strong> {item.feedback || "N/A"}
                </p>
                {/* <p>
                  <strong>Improvement:</strong> {item.improvement || "N/A"}
                </p> */}
              </div>
            ))}
          </div>

          {/* Strengths & Recommendations */}
          {/* <div className="bg-[#0f172a] border border-purple-500 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-purple-300 mb-2">
          🧠 Strengths & Weak Areas
        </h3>
        <p><strong>Detected Strengths:</strong> {strengths.length ? strengths.join(", ") : "Not detected"}</p>
        <p><strong>Areas to Improve:</strong> {weakAreas.length ? weakAreas.join(", ") : "None"}</p>
      </div> */}

          {/* <div className="bg-[#0f172a] border border-yellow-400 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">
              📌 AI Recommendations
            </h3>
            <ul className="list-disc pl-6 text-gray-300 text-sm space-y-1">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div> */}

          <p className="text-center text-xs text-gray-400 mt-6 italic">
            💬 This report was generated based on your mock interview session.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SummaryPage;
