import { auth } from '@clerk/nextjs';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-3xl font-bold">Your AI Mentor</h1>
      <div className="rounded-lg bg-card p-4 shadow-lg">
        <ChatInterface />
      </div>
    </div>
  );
}
