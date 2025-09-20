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

const RecentTopics: React.FC = () => {
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
      <div className="flex justify-center items-center h-screen text-white bg-black text-xl">
        Loading recent topics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400 bg-black text-xl">
        Failed to load recent topics.
      </div>
    );
  }

  const uniqueTopics = Array.from(
    new Set(
      data.results
        .map((result) => result.skill_name)
        .filter((name): name is string => !!name)
    )
  );

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-6">
        <div className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-10 backdrop-blur-md">
          <h1 className="text-4xl font-bold mb-6">Recently Attempted Topics</h1>

          <p className="mb-5 text-lg">
            Based on your recent quiz attempts, here are some topics you've explored.
            Revisiting and practicing these topics regularly will help reinforce your skills
            and boost your confidence.
          </p>

          <ul className="list-disc list-inside mb-6 space-y-3 text-lg">
            {uniqueTopics.map((topic, index) => (
              <li key={index} className="text-blue-300 font-semibold">
                {topic}
              </li>
            ))}
          </ul>

          <p className="mb-5 text-lg">
            Each topic listed above represents an area where you've recently tested your knowledge.
            It is a good idea to revisit concepts you found challenging and explore advanced materials
            to strengthen your understanding.
          </p>

          <p className="mb-5 text-lg">
            Consistent practice across these topics will ensure you are well-prepared for upcoming
            quizzes, interviews, or real-world projects. Use your performance insights to guide your learning journey.
          </p>

          <p className="mb-5 text-lg">
            Remember, mastery comes with repetition and reflection. Keep tracking your progress, identify
            areas for improvement, and embrace the learning process. These topics are your stepping stones
            to becoming proficient in your chosen skills.
          </p>
        </div>
      </div>

      <footer className="mt-16 mb-6 px-6">
        <div className="bg-black bg-opacity-60 text-gray-300 rounded-2xl shadow-lg py-6 text-center text-lg">
          <p>&copy; 2025 SuggestiFy. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default RecentTopics;
