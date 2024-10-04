import { Storage } from "@capacitor/storage";

async function updateQRCode(
  url: string,
  {
    arg,
  }: {
    arg: {
      data: {
        code: any;
        guest: any;
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

export default updateQRCode;
