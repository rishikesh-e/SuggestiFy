import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

interface RegisterFormData {
  email: string;
  password: string;
  username: string,
}

interface ApiResponse {
  message: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:5000/auth/register",
        formData,
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      navigate('/login');
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/AVvXsEgySwlYtG5-fwpYIiM9b1WTLEp7bPLTjOrRjMCkSB0e8YHWAHyjXM6-XVVyEaAXU_Z__nDEDV6X2eiCZDi8yYLCL2C2yQ9x6pELBxmoou9Voba0a0hl1tyfLqasGz4Mzuc3Z0pFjq3l3EZ0WHr0R9aq1JYweQuVZew0veddgPSwcVlvGXRnx_YXOHQMdxqp.jpg')", // Your sharper background image
      }}
    >
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full items-center justify-between p-6">
        {/* Left Side Text */}
        <div className="text-white md:w-1/2 flex flex-col items-center md:items-start justify-center px-12">
          <h1 className="text-6xl font-semibold tracking-wide mb-4 drop-shadow-md">
            SuggestiFy
          </h1>
          <h4 className="text-2xl font-light italic opacity-90">
            Your Learning Companion
          </h4>
        </div>

        {/* Right Side Login Card */}
        <div className="md:w-1/3 w-full bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-8 mr-16">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Sign Up or Log In
          </h2>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="text" className="block text-sm mb-2">
                        UserName
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Continue with email"}
                </button>
            </form>

            {/* Register option only */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">
                     Already having an account?{" "}
                    <a href="/login" className="text-orange-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
