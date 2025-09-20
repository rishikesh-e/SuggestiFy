import React, { useState } from "react";
import Quiz from "./quiz";
import Navbar from "../components/navbar";

const QuizLauncher: React.FC = () => {
  const [skill, setSkill] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);

  const handleStart = () => {
    if (skill.trim() !== "") {
      setStartQuiz(true);
    }
  };

  return (
    <>
      <Navbar />

      {/* Page Section */}
      <div className="min-h-screen flex flex-col items-center justify-start px-6 py-16 space-y-16">

        {/* Hero Heading */}
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

        {/* Quiz Box */}
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

        {/* Highlights */}
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
      </div>

            {/* Footer */}
      <footer className="mt-16 mb-6 px-6">
        <div className="bg-black bg-opacity-60 text-gray-300 rounded-2xl shadow-lg py-6 text-center">
          <p>&copy; 2025 SuggestiFy. All rights reserved.</p>
        </div>
      </footer>


    </>
  );
};

export default QuizLauncher;
