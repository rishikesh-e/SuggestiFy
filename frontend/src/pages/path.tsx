import React, { useEffect, useState } from "react";
import axios from "axios";

interface Topic {
  name: string;
  description: string;
  resources: string[];
}

interface LearningPathResponse {
  learning_path: {
    level: string;
    skill: string;
    topics: Topic[]
  };
  score: number;
  skill: string;
  passed: boolean;
  message: string;
}

interface Props {
  score: number;
  skill: string;
}

const LearningPathFlow: React.FC<Props> = ({ score, skill }) => {
  const [path, setPath] = useState<LearningPathResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await axios.post<LearningPathResponse>(
          "http://localhost:5000/api/submit",
          { score, skill },
          { withCredentials: true }
        );
        setPath(res.data);
      } catch (err) {
        console.error("Error fetching learning path:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPath();
  }, [score, skill]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading learning path...
      </div>
    );
  }

  if (!path) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load learning path.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-10 px-4 text-white overflow-y-auto">
      <h1 className="text-3xl font-bold mb-10">
        Learning Path: {path.learning_path.skill} ({path.learning_path.level})
      </h1>

      <div className="flex flex-col items-center space-y-8 w-full max-w-3xl">
        {path.learning_path.topics.map((topic, idx) => (
          <React.Fragment key={idx}>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full">
              <h2 className="text-xl font-semibold mb-2">{topic.name}</h2>
              <p className="text-gray-300 mb-3">{topic.description}</p>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Resources:</p>
                <ul className="list-disc list-inside text-blue-400 space-y-1">
                  {topic.resources.map((link, i) => (
                    <li key={i}>
                      <a href={link} target="_blank" rel="noreferrer" className="hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Arrow to next step (skip after last card) */}
            {idx < path.learning_path.topics.length - 1 && (
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-gray-500"></div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-500"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LearningPathFlow;