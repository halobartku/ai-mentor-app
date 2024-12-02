import { AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '../src/theme/ThemeContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default MyApp;