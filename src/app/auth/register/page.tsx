import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
      <h1>Register Page</h1>
      <p>This is the login page</p>
      <Link href={"/space"}>
        Go to space
      </Link>
      <Link href={"/auth/login"}>
        Go to login
      </Link>
    </div>
  );
}
