"use client";

import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  return (
    <button
      onClick={() =>
        authClient.signUp.email({
          email: "test@gmail.com",
          password: "asdfqwer",
          name: "Test User",
        })
      }
    >
      Sign Up
    </button>
  );
}
