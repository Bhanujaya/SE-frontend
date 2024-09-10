import Link from 'next/link';


export default function Login() {
    return (
      <>
        <h1 className="text-3xl">Login Page</h1>
        <h2>
          <Link href="/register">Sign Up?</Link>
        </h2>
      </>
    );
  }