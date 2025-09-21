import React, { useState, useEffect } from "react";
import axios from "axios";
import Quiz from "./quiz";
import Navbar from "../components/navbar";
import LearningPathFlow from "./path";

const QuizLauncher: React.FC = () => {
  const [skill, setSkill] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);
  const [existingPath, setExistingPath] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user already has a learning path
  useEffect(() => {
    const fetchExistingPath = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/get-skill", {
          withCredentials: true,
        });
        setExistingPath(res.data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setExistingPath(null);
        } else {
          console.error("Error fetching existing path:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExistingPath();
  }, []);

  const handleStart = () => {
    if (skill.trim() !== "") {
      setStartQuiz(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: "url('/image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {existingPath ? (
        <LearningPathFlow score={0} skill={existingPath.skill} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-start px-6 py-16 space-y-16 text-white">
          {!startQuiz && (
            <div className="text-center max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                Discover Your Skill Level 🚀
              </h1>
              <p className="text-lg md:text-xl text-gray-200 opacity-90">
                Take a quick interactive quiz to help us evaluate your knowledge
                and recommend the perfect learning path for you.
              </p>
            </div>
          )}

          <div className="bg-black bg-opacity-40 p-8 rounded-2xl shadow-lg w-full max-w-lg text-center text-white">
            {!startQuiz ? (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  Enter the skill you want to test
                </h2>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Python, Java, Cybersecurity"
                  className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleStart}
                  className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-bold transition-transform transform hover:scale-105"
                >
                  Start Quiz
                </button>
              </>
            ) : (
              <Quiz skill={skill} />
            )}
          </div>

          {!startQuiz && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-5xl w-full">
              <div className="bg-black bg-opacity-40 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-2">📚 Personalized Paths</h3>
                <p className="text-gray-200">
                  Get a custom learning roadmap based on your quiz results.
                </p>
              </div>
              <div className="bg-black bg-opacity-40 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-2">⚡ Quick & Engaging</h3>
                <p className="text-gray-200">
                  Short quizzes designed to be fun, insightful, and effective.
                </p>
              </div>
              <div className="bg-black bg-opacity-40 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-2">🎯 Accurate Insights</h3>
                <p className="text-gray-200">
                  Understand your current level and how to reach the next one.
                </p>
              </div>
            </div>
          )}

          <footer className="mt-16 mb-6 px-6">
            <div className="bg-black bg-opacity-60 text-gray-300 rounded-2xl shadow-lg py-6 text-center">
              <p>&copy; 2025 SuggestiFy. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default QuizLauncher;
