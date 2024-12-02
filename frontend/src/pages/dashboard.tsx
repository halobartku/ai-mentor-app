import { useUser } from '@clerk/nextjs';
import { ChatInterface } from '../components/chat/ChatInterface';
import { AppLayout } from '../components/layout/AppLayout';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <div className="rounded-lg bg-card p-4 shadow-lg">
          <ChatInterface />
        </div>
      </div>
    </AppLayout>
  );
}
