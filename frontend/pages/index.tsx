import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);

  return null;
}