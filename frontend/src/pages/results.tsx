import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";

interface QuizResult {
  id: number;
  user_id: number;
  username: string;
  skill_id: number;
  skill_name: string | null;
  level: string;
  score: number;
  passed: boolean;
  taken_at: string;
}

interface ApiResponse {
  user_id: number;
  username: string;
  total_results: number;
  results: QuizResult[];
}

const QuizResults: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          "http://localhost:5000/api/results-of-quiz",
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        Loading quiz results...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400 bg-black">
        Failed to load results.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: "url('/image.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <Navbar />

      <div className="relative z-10 mt-24 w-full max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Greeting */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Hello <span className="text-blue-400">{data.username}</span>, you
            have attended <span className="text-green-400">{data.total_results}</span>{" "}
            quizzes, which is amazing! Keep working!
          </h2>
        </div>

        {/* Glassy Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl bg-black/40 backdrop-blur-md border border-white/20 w-full">
          <table className="min-w-full text-base md:text-lg text-left text-white">
            <thead className="bg-white/20 uppercase text-gray-200 text-lg">
              <tr>
                <th className="px-6 py-3 font-bold">Skill</th>
                <th className="px-6 py-3 font-bold">Level</th>
                <th className="px-6 py-3 font-bold">Score</th>
                <th className="px-6 py-3 font-bold">Passed</th>
                <th className="px-6 py-3 font-bold">Taken At</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((result) => (
                <tr
                  key={result.id}
                  className="border-b border-white/10 hover:bg-white/20 transition"
                >
                  <td className="px-6 py-3">{result.skill_name || "Unknown"}</td>
                  <td className="px-6 py-3">{result.level}</td>
                  <td className="px-6 py-3">{result.score}</td>
                  <td className="px-6 py-3">
                    {result.passed ? (
                      <span className="text-green-400 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-400 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-6 py-3">{new Date(result.taken_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
