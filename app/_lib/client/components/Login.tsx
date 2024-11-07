"use client";

import { useState } from "react";
import Image from "next/image";
import { useLogin } from "@/app/client/hooks/useLogin";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { refetch: handleLogin } = useLogin({
    email,
    password,
  });

  const handleOnSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const auth = await handleLogin();
      console.log("auth: ", auth);
      if (auth.isSuccess) {
        window.location.href = "/dashboard";
      } else {
        setError(auth?.error?.message as string);
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      {error && (
        <legend className="border border-red-700 bg-red-200 text-red-900 px-4 py-3 rounded-lg mb-6">
          {error}
        </legend>
      )}
      <div className="flex flex-col mb-6 gap-4">
        <label>
          Email
          <div className="w-full max-w-sm min-w-[200px]">
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-500 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Type here..."
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
