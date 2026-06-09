"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-gray-400">Sign in to access your notes</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 font-medium"
        >
          <img src="https://www.google.com/favicon.ico" width={20} height={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}