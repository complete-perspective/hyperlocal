import { useQuery } from "@tanstack/react-query";

export const AUTH_QUERY_KEY = "auth-session.read";

async function getAuthSession() {
  const response = await fetch("/api/v1/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
  });

  const json = await response.json();
  console.log("json: ", json);

  return json?.data;
}

export const useAuthSession = () => {
  return useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: () => getAuthSession(),
    retry: false,
  });
};
