import { useQuery } from "@tanstack/react-query";

export const LOGIN_QUERY_KEY = "auth-session.create";

async function authenticateWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    cache: "no-cache",
    body: JSON.stringify({
      query: `
        mutation Login($email: String!, $password: String!) {
          authenticatePersonWithPassword(email: $email, password: $password) {
            ... on PersonAuthenticationWithPasswordSuccess {
              sessionToken
              item {
                id
                name
                email
                isAdmin
              }
            }
            ... on PersonAuthenticationWithPasswordFailure {
              message
            }
          }
        }`,
      variables: {
        email,
        password,
      },
    }),
  });

  const json = await response.json();
  if (json?.data?.authenticatePersonWithPassword?.sessionToken) {
    return json.data.authenticatePersonWithPassword.item;
  }

  throw new Error(json?.data?.authenticatePersonWithPassword?.message);
}

export const useLogin = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return useQuery({
    queryKey: [LOGIN_QUERY_KEY, email],
    queryFn: () => authenticateWithPassword({ email, password }),
    retry: false,
    enabled: false,
  });
};
