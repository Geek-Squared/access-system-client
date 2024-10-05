import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useAuth } from "../context/authContext";
import "./styles.scss";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false); // Track login attempts

  const { login, isLoading, isError } = useLogin();
  const { setToken } = useAuth();

  useEffect(() => {
    if (isError && loginAttempted) {
      setErrorMessage("An error occurred. Please try again.");
    }
  }, [isError, loginAttempted]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginAttempted(true); // Mark that a login attempt has been made

    try {
      const response = await login(phoneNumber, pin);

      if (response.token) {
        setToken(response.token); // Set the token in the AuthContext
        setSuccessMessage("Login successful!");
        setErrorMessage("");
        navigate("/"); // Redirect to the home page
      } else {
        setErrorMessage("Invalid phone number or PIN. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      setErrorMessage("Invalid phone number or PIN. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Personnel Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading} // Disable inputs while loading
            />
          </div>
          <div className="input-container">
            <label>PIN:</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              disabled={isLoading} // Disable inputs while loading
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Login;