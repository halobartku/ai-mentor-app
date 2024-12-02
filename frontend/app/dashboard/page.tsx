import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-3xl font-bold">Your AI Mentor</h1>
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <ChatInterface />
      </div>
    </div>
  );
}