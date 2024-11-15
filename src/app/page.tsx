"use client";

import { signUp, useSession } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data } = useSession();
  return (
    <div>
      <div>Current User: {data && data.user.name}</div>
      <div>Sign Up</div>
      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => signUp.email({ name, email, password })}>
        submit
      </button>
    </div>
  );
}
