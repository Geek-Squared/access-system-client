import useSWR from "swr";

function useFetchCurrentUser() {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const fetcher = (url: string) =>
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    });

  const { data, error, isLoading } = useSWR(
    token
      ? `https://different-armadillo-940.convex.site/currentUser?id=${id}`
      : null,
    fetcher
  );

  return {
    currentUser: data?._id,
    loading: isLoading,
    error,
  };
}

export default useFetchCurrentUser;
