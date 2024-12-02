import { AppProps } from 'next/app';
import { AuthProvider } from '../components/auth/AuthProvider';
import { ThemeProvider } from '../theme/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
