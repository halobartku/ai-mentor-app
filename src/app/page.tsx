import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Chat } from '@/components/chat/Chat';

export default async function HomePage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  return (
    <main className="flex flex-col h-screen">
      <Chat />
    </main>
  );
}