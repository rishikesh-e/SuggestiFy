import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

interface Progress {
  skill: string;
  progress: number;
}

interface ProfileData {
  id: number;
  name: string;
  email: string;
  created_at: string;
  currently_learning: string[];
  progress: Progress[];
  quizzes_taken: number;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    axios
      .get<ProfileData>("http://localhost:5000/profile/", {
        withCredentials: true, // 🔥 ensures cookies/session sent
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Profile fetch error:", err));
  }, []);

  if (!profile) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('/image.jpg')`,
        }}
      >
        <div className="min-h-screen bg-white/20 backdrop-blur-md">
          <Navbar />
          <p className="text-white text-center mt-20">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
  <div
    className="min-h-screen bg-cover bg-center"
    style={{
      backgroundImage: `url('/image.jpg')`,
    }}
  >
    <Navbar />

    <div>
      {/* Section heading */}
      <h1 className="text-3xl font-bold text-white text-center mt-10 mb-6">
        Profile Section
      </h1>

      {/* Profile content */}
      <div className="flex items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-6">
          {/* User Info */}
          <div className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{profile.name}</h2>


          </div>
          <div className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-2" >{profile.email}</h2>
          </div>
          <div className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Joined: {new Date(profile.created_at).toDateString()}</h2>
          </div>

          {/* Currently Learning */}
          <div className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Currently Learning</h3>
            {profile.currently_learning.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-gray-200">
                {profile.currently_learning.map((skill, i) => (
                  <li key={i}>{skill.toUpperCase()}</li>
                ))}
              </ul>
            ) : (
              <p className="opacity-70">Not enrolled in any skills yet.</p>
            )}
          </div>
          {/* Quizzes Taken */}
          <div className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Quizzes Taken</h3>
            <p className="text-lg">{profile.quizzes_taken}</p>
          </div>
        </div>
      </div>
    </div>
    <footer className="mt-16 mb-6 px-6">
        <div className="bg-black bg-opacity-60 text-gray-300 rounded-2xl shadow-lg py-6 text-center">
          <p>&copy; 2025 SuggestiFy. All rights reserved.</p>
        </div>
      </footer>
  </div>
);

};

export default Profile;
