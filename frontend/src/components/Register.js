import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider"; // Using AuthContext

const Register = () => {
  const [username, setUsername] = useState(""); // Username state
  const [password, setPassword] = useState(""); // Password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const [loading, setLoading] = useState(false); // Loading state for registration
  const { login, token } = useContext(AuthContext); // Using useContext to access AuthContext
  const navigate = useNavigate();

  // Check if there is a token, if so, redirect to notes page
  useEffect(() => {
    if (token) {
      navigate("/notes"); // If already authenticated, redirect to /notes
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    setErrorMessage(""); // Clear previous error messages

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match"); // Set error message if passwords don't match
      setLoading(false);
      return;
    }

    // Make a fetch request to the /auth/register endpoint
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Sending username and password in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Registration failed"); // Set error message if response is not ok
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log(data)

      if (data.id) {
        navigate("/login"); // Redirect to notes page
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again."); // Display general error message
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl mb-4">Register</h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-600 border border-red-400 rounded-md p-2 mb-4">
            {errorMessage}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="mb-4 p-2 w-full border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 w-full border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-4 p-2 w-full border border-gray-300 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
        />
        <button 
          type="submit" 
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleLoginRedirect} // Redirect to login page
            className="text-blue-500"
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
