import { useState } from "react";
import { useAuth } from "../contexts/AuthContext/UseAuth";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import "./LoginPage.css";

const LoginPage = () => {
  console.log(
    "🔴 LoginPage is rendering - this should appear in browser console",
  );

  console.log("LoginPage rendered");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted! Username:", username, "Password:", password); // ← ADD THIS

    setError("");

    const result = await login(username, password);
    console.log("Login result:", result); // ← ADD THIS

    if (result.success) {
      console.log("Navigating to dashboard");
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } else {
      console.log("Setting error:", result.error);
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <ThemeToggle />
        <h2 className="login-title" style={{marginTop: "1rem"}}>Personal Finance App</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="login-input-group">
            <label className="login-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button" onClick={handleSubmit}>
            Login
          </button>
          <p className="login-link">
            You don't have an account yet? <Link to="/signup">Sing up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
