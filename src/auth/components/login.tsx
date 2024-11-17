"use client";

import { authClient } from "@/auth/lib/auth-client";

export default function Login() {
  return (
    <button
      onClick={() =>
        authClient.signIn.email({
          email: "test@gmail.com",
          password: "asdfqwer",
        })
      }
    >
      Log In
    </button>
  );
}
