// src/pages/PastInterviews.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PastInterviews = () => {
  const [pastReports, setPastReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/past-interviews/${userEmail}`
        );

        const sortedReports = res.data.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        setPastReports(sortedReports);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setLoading(false);
      }
    }

    if (userEmail) fetchReports();
  }, [userEmail]);

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 transition-all duration-300 ml-16 group-hover:ml-56 px-6 pt-24 pb-16 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-yellow-400 mb-6 drop-shadow-[0_2px_6px_rgba(250,204,21,0.3)]">
            📑 Your Past Interviews
          </h2>
          <p className="text-center text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Review detailed feedback from previous AI mock interviews. Track
            your growth, revisit insights, and download reports. 🚀
          </p>

          {loading ? (
            <p className="text-center text-cyan-400 font-semibold">
              Loading your past interviews...
            </p>
          ) : pastReports.length === 0 ? (
            <p className="text-center text-gray-400">No past reports found.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {pastReports.map((report, index) => (
                <div
                  key={index}
                  className="bg-[#1e293b] border border-gray-700 hover:border-yellow-400 p-6 rounded-xl shadow-md hover:shadow-yellow-300/20 transition duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-yellow-400">
                      🧾 Interview {index + 1}
                    </h3>
                    <span className="text-sm font-medium text-cyan-400">
                      {report.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>📄 File:</strong> {report.file_name}
                  </p>
                  {/* <p className="text-sm text-gray-400">
                    <strong>📅 Date:</strong>{" "}
                    {new Date(report.timestamp).toLocaleString()}
                  </p> */}
                  <div className="mt-4 text-center">
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 font-semibold hover:underline hover:text-yellow-300 transition"
                    >
                      🔗 View / Download Report
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center text-sm text-gray-500">
            Keep practicing. Come back anytime to reflect and grow. 💪
          </div>
        </div>
      </main>
    </div>
  );
};

export default PastInterviews;
