import { Providers } from '../components/providers/Providers';
import '../styles/globals.css';

export const metadata = {
  title: 'AI Mentor App',
  description: 'Your personal AI mentor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
