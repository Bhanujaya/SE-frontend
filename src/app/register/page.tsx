import Link from 'next/link';


export default function Register() {
    return (
      <>
        <h1 className="text-3xl">Register Page</h1>
        <h2>
          <Link href="/login">Don't have an Account?</Link>
        </h2>
      </>
    );
  }