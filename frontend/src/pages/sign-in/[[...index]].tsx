import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from '../../hooks/useTheme';

export default function SignInPage() {
  const { isDark } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          baseTheme: isDark ? dark : undefined,
          variables: {
            colorPrimary: '#007AFF',
          },
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary-dark',
            card: 'bg-background',
            headerTitle: 'text-foreground',
            dividerText: 'text-muted-foreground',
            formFieldLabel: 'text-foreground',
            formFieldInput: 'bg-input text-foreground',
            footerActionLink: 'text-primary hover:text-primary-dark',
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
}
