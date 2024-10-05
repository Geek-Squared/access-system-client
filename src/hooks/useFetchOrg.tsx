import useSWR from "swr";

function useFetchOrganization(personnelId: string) {
    //@ts-expect-error
  const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://different-armadillo-940.convex.site/organization",
    fetcher
  );
console.log('data', data)
  const filteredOrganizations = data?.filter((org: any) =>
    org.personnel.includes(personnelId)
  );
console.log('filteredOrganizations', filteredOrganizations)
  return {
    organizations: filteredOrganizations,
    isLoading,
    isError: error,
  };
}

export default useFetchOrganization;