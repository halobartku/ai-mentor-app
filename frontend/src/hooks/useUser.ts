import { useUser as useClerkUser } from '@clerk/nextjs';

export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  return {
    user,
    isLoaded,
    isSignedIn,
    userId: user?.id,
    email: user?.primaryEmailAddress?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    profileImage: user?.imageUrl,
  };
}
