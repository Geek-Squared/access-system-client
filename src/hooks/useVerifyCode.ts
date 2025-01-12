import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/apiUrl";

interface VerifyCodeResponse {
  message: string;
  data: {
    visitorName: string;
  };
}

interface VerifyCodePayload {
  code: string;
  siteId: string;
}

const useVerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);

  const verifyCode = async (payload: VerifyCodePayload) => {
    setIsLoading(true);
    try {
      const response = await axios.post<VerifyCodeResponse>(
        `${apiUrl}/visitor-code/verify`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to verify code:",
          error.response?.data?.message || error.message
        );
        throw new Error(
          error.response?.data?.message || "Failed to verify code"
        );
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    verifyCode,
  };
};

export default useVerifyCode;