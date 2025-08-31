import React, { useState } from "react";
import Quiz from "./quiz"; // quiz component

const QuizLauncher: React.FC = () => {
  const [skill, setSkill] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);

  const handleStart = () => {
    if (skill.trim() !== "") {
      setStartQuiz(true);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <div className="bg-black bg-opacity-40 p-6 rounded-2xl shadow-lg w-full max-w-lg text-center text-white backdrop-blur-md">
        {!startQuiz ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Start a Quiz</h1>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Enter a skill (e.g. Python, Java, Cybersecurity)"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"
            />
            <button
              onClick={handleStart}
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold"
            >
              Start Quiz
            </button>
          </>
        ) : (
          <Quiz skill={skill} />
        )}
      </div>
    </div>
  );
};

export default QuizLauncher;
