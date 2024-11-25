import useSWR, { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

const fetcher = (
  url: string | URL | Request,
  options: RequestInit | undefined
) => fetch(url, options).then((res) => res.json());

function useCreateVisitor() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  const createVisitor = async (visitorData: any) => {
    const response = await mutate(
      `${apiUrl}/visitor/create`,
      fetcher(`${apiUrl}/visitor/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(visitorData),
      }),
      false
    );
    mutate(`${apiUrl}/visitor`);

    return response;
  };

  return {
    createVisitor,
    visitor: data,
    isLoading,
    isError: error,
  };
}

export default useCreateVisitor;
