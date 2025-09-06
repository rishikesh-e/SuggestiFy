import React, { useState, useEffect } from "react";
import axios from "axios";
import LearningPathFlow from "./path";

interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
}

interface QuizProps {
  skill: string;
}

const Quiz: React.FC<QuizProps> = ({ skill }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/generate-quiz/${skill}`,
          { withCredentials: true }
        );
        if (Array.isArray(res.data)) {
          setQuestions(res.data);
          setCurrentIndex(0);
          setScore(0);
          setSubmitted(false);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [skill]);

  const handleAnswer = (choice: string) => {
    if (selected) return;
    setSelected(choice);

    const currentQ = questions[currentIndex];
    if (choice === currentQ[currentQ.answer as keyof Question]) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
    } else {
      // quiz completed
      setSubmitted(true);
    }
  };

  // If user submitted quiz → render Learning Path component
  if (submitted) {
    return <LearningPathFlow score={score} skill={skill} />;
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center text-white">
        <p>
          Loading quiz for <b>{skill}</b>...
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const options = [
    currentQ.option1,
    currentQ.option2,
    currentQ.option3,
    currentQ.option4,
  ];
  const correctAnswer = currentQ[currentQ.answer as keyof Question];

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 text-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">
        Q{currentIndex + 1}. {currentQ.question}
      </h3>

      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className={`w-full px-4 py-2 rounded-lg text-left transition 
              ${
                selected === null
                  ? "bg-gray-700 hover:bg-gray-600"
                  : opt === correctAnswer
                  ? "bg-green-600"
                  : selected === opt
                  ? "bg-red-600"
                  : "bg-gray-700"
              }
            `}
            disabled={!!selected}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={nextQuestion}
          disabled={!selected}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {currentIndex + 1 === questions.length ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
