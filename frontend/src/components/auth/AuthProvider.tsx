import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from '../../hooks/useTheme';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: '#007AFF',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
