import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Profile from "./pages/profile";
import QuizLauncher from "./pages/quizlauncher";
import QuizResults from "./pages/results";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Future example routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
          <Route path="/profile" element ={<Profile />} />
          <Route path="/learn" element={<QuizLauncher />} />
        <Route path="/recent-progress" element = {<QuizResults />} />
      </Routes>
    </Router>
  );
};

export default App;
