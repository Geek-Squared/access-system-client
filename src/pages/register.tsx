import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://proper-reward-aa454ad2f4.strapiapp.com/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful!");
        localStorage.setItem("token", data.jwt);
        navigate("/");
      } else {
        setErrorMessage(
          data.message[0].messages[0].message || "Registration failed"
        );
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className={"container"}>
      <div className={"form-box"}>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {errorMessage && <p className={"error-message"}>{errorMessage}</p>}
        {successMessage && (
          <p className={"success-message"}>{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Register;
