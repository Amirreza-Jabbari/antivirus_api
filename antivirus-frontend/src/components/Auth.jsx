import PropTypes from "prop-types";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      onLogin();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md text-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="mb-2 p-2 border w-full"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border w-full"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

Auth.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Auth;
