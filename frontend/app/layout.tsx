import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'AI Mentor',
  description: 'Your personal AI mentor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  )
}