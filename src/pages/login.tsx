


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useAuth } from "../context/authContext";
import "./styles.scss";


const Loader = () => {
  return <div className="loader"></div>;
};


const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for handling form submission loading

  const { login, isError } = useLogin();
  const { setToken } = useAuth();

  useEffect(() => {
    if (isError && loginAttempted) {
      setErrorMessage("An error occurred. Please try again.");
    }
  }, [isError, loginAttempted]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginAttempted(true);
    setIsSubmitting(true); // Set loading state to true on submit

    try {
      const response = await login(phoneNumber, pin);

      if (response.token) {
        setToken(response.token);
        setSuccessMessage("Login successful!");
        setErrorMessage("");
        navigate("/");
      } else {
        setErrorMessage("Invalid phone number or PIN. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      setErrorMessage("Invalid phone number or PIN. Please try again.");
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false); // Set loading state to false once the login process is complete
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <img src="/anmo.png" alt="Logo" className="logo" />
        <h2 className="auth-title">Login Into Your Account</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isSubmitting} // Disable input while submitting
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              disabled={isSubmitting} // Disable input while submitting
            />
          </div>
          <div className="forgot-password">
            <a className="forgot-pin" href="/forgot-password">Forgot PIN?</a>
          </div>
          <button className="auth-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader /> : "Login"}
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
