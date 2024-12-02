import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  return redirect('/dashboard/chat');
}