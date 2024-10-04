import { Storage } from "@capacitor/storage";

async function updateVisitor(
  url: string,
  {
    arg,
  }: {
    arg: {
      data: {
        name: string;
        id_number: string;
        visiting_reason: string;
        visiting_resident: string;
        entry_time: string;
        exit_time: string;
      };
    };
  }
) {
  const { value: token } = await Storage.get({ key: "token" });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default updateVisitor;
