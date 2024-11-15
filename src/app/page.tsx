import Login from "@/auth/components/login";
import SignUp from "@/auth/components/signup";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <>
      <div>Currently Logged In: {session?.user.name}</div>
      <SignUp />
      <Login />
    </>
  );
}
