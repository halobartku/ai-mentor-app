import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}