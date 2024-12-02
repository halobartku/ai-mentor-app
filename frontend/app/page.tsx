import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Welcome to AI Mentor</h1>
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
          >
            Go to Dashboard
          </Link>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">AI Mentor</h1>
          <p className="text-xl text-gray-600">Your personal AI mentor</p>
          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </SignedOut>
    </main>
  );
}