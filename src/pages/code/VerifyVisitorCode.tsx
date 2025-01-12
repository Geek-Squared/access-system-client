import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import useVerifyCode from "../../hooks/useVerifyCode";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";

const VerifyVisitorCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const { user } = useFetchCurrentUser();
  const siteId = user?.sitesId;
  const { verifyCode, isLoading } = useVerifyCode();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    
    try {
      const result = await verifyCode({ code, siteId });
      setStatus("success");
      setMessage(result.message);
      
      // After successful verification, get the stored destination
      const pendingNavigation = sessionStorage.getItem('pendingFormNavigation');
      if (pendingNavigation) {
        sessionStorage.removeItem('pendingFormNavigation'); // Clean up
        // Add a small delay to show the success message
        setTimeout(() => {
          navigate(pendingNavigation);
        }, 1000);
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Verification failed"
      );
    }
  };

  return (
    <div className="verify-visitor">
      <div className="verify-visitor__container">
        <div className="verify-visitor__header">
          <div className="verify-visitor__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <h1>Verify Visitor Code</h1>
          <p>Enter the visitor code to verify access</p>
        </div>
        <form onSubmit={handleSubmit} className="verify-visitor__form">
          <div className="verify-visitor__input-group">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              pattern="\d{6}"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
        {status !== "idle" && (
          <div className={`verify-visitor__message ${status}`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="message-icon"
            >
              {status === "success" ? (
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
              {status === "success" ? (
                <polyline points="22 4 12 14.01 9 11.01" />
              ) : (
                <>
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </>
              )}
            </svg>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyVisitorCode;