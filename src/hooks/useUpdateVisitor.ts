import useSWR, { mutate } from "swr";
import axios from "axios";
import { apiUrl } from "../utils/apiUrl";

const useUpdateVisitor = (userId: string) => {
  const { data, error } = useSWR(
    userId ? `${apiUrl}/visitor/${userId}` : null,
    fetcher
  );

  async function fetcher(url: string) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  const updateUser = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/visitor/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      mutate(`${apiUrl}/visitor/${userId}`, { ...data, ...updatedData }, false);

      await mutate(`${apiUrl}/visitor/${userId}`);

      return response.data;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    updateUser,
  };
};

export default useUpdateVisitor;
