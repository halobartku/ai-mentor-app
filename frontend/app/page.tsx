import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">AI Mentor</span>
            </div>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="primary">Go to Dashboard</Button>
                </Link>
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Your Personal AI Mentor
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience personalized learning and growth with an AI mentor that adapts to your needs
            </p>
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" variant="primary">
                  Start Your Journey
                </Button>
              </Link>
            </SignedOut>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">AI-driven guidance that adapts to your learning style and pace</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Real-time Feedback</h3>
              <p className="text-gray-600">Get instant, actionable feedback on your progress</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Goal Tracking</h3>
              <p className="text-gray-600">Set and track your learning goals with intelligent insights</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}