import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      <p>This is the login page</p>
      <Link href={"/space"}>Go to space</Link>
      <Link href={"/auth/register"}>Go to register</Link>
    </div>
  );
}
