import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';

export default async function HomePage() {
  const { userId } = auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-lg text-center">
        <h1 className="mb-4 text-3xl font-bold">Welcome to AI Mentor</h1>
        <p className="mb-6 text-gray-600">
          Your personal AI tutor to help you learn and grow.
        </p>
        {userId ? (
          <Link href="/dashboard/chat">
            <Button>Start Learning</Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </Card>
    </main>
  );
}