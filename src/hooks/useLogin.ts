import useSWR, { mutate } from "swr";

const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

function useLogin() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const login = async (phoneNumber: string, pin: string) => {
    const response = await mutate(
      `${apiUrl}/auth/signin`,
      fetcher(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, pin, role: "PERSONNEL" }),
      }),
      false
    );
    console.log('response', response)
    localStorage.setItem("token", response.token);
    localStorage.setItem("id", response.id);
    return response;
  };

  return {
    login,
    data,
    isLoading,
    isError: error,
  };
}

export default useLogin;
