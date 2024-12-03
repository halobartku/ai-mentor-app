import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to AI Mentor</h1>
        <p className="text-gray-600 mb-6">
          Your personal AI tutor to help you learn and grow.
        </p>
        <SignedIn>
          <Link href="/dashboard/chat">
            <Button>Start Learning</Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </SignedOut>
      </Card>
    </main>
  );
}