"use client";

import Image from "next/image";

export function Login() {
  const handleOnSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const body = Object.fromEntries(formData);

    try {
      const data = await fetch("/api/graphql", {
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
            email: body.email,
            password: body.password,
          },
        }),
      });

      const json = await data.json();
      if (json?.data?.authenticatePersonWithPassword?.sessionToken) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="flex flex-col mb-6 gap-4">
        <label>
          Email
          <div className="w-full max-w-sm min-w-[200px]">
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-500 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Type here..."
              name="email"
              type="email"
              required
            />
          </div>
        </label>
        <label>
          Password
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-500 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            name="password"
            type="password"
            required
          />
        </label>
      </div>
      <button
        className="rounded-full w-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        type="submit"
      >
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logomark"
          width={20}
          height={20}
        />
        Connect
      </button>
    </form>
  );
}
