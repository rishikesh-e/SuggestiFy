import React from "react";
import Navbar from "../components/navbar";
import AnimatedDescription from "../components/animation";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const deepDescription =
    "SuggestiFy is your personal learning companion. Explore new skills, take quizzes to test your knowledge, and follow step-by-step guides to master any topic. Track your progress, earn achievements, and learn at your own pace — all from a single interactive platform.";

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('/AVvXsEgySwlYtG5-fwpYIiM9b1WTLEp7bPLTjOrRjMCkSB0e8YHWAHyjXM6-XVVyEaAXU_Z__nDEDV6X2eiCZDi8yYLCL2C2yQ9x6pELBxmoou9Voba0a0hl1tyfLqasGz4Mzuc3Z0pFjq3l3EZ0WHr0R9aq1JYweQuVZew0veddgPSwcVlvGXRnx_YXOHQMdxqp.jpg')",
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 flex flex-col items-center text-center px-4 md:px-0 bg-black bg-opacity-40 rounded-2xl mx-6 mt-6">
        <h1 className="text-4xl font-bold mb-6">Welcome, Rishikesh!</h1>
        <AnimatedDescription text={deepDescription} speed={300} />

        <div className="flex space-x-4 mt-8">
          <a
            href="/learn"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Learn a Skill
          </a>
          <a
            href="/test"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Take a Test
          </a>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Topics */}
          <div
            onClick={() => navigate("/recent-topics")}
            className="cursor-pointer bg-black bg-opacity-40 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:bg-opacity-60 transition"
          >
            <h3 className="text-xl font-semibold mb-2">Recent Topics</h3>
            <p>Check out the latest skills you’ve explored.</p>
          </div>

          {/* Progress Overview */}
          <div
            onClick={() => navigate("/recent-progress")}
            className="cursor-pointer bg-black bg-opacity-40 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:bg-opacity-60 transition"
          >
            <h3 className="text-xl font-semibold mb-2">Progress Overview</h3>
            <p>Track your completed quizzes and learning steps.</p>
          </div>

          {/* Tips & Highlights */}
          <div
            onClick={() => navigate("/recommend-topics")}
            className="cursor-pointer bg-black bg-opacity-40 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:bg-opacity-60 transition"
          >
            <h3 className="text-xl font-semibold mb-2">Tips & Highlights</h3>
            <p>Get recommended skills and guidance for beginners.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-40 py-6 mt-16 text-center rounded-2xl mx-6">
        <p className="text-gray-200">&copy; 2025 SuggestiFy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
