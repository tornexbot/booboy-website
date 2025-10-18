import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BOOBOY - The Spookiest Memecoin on Solana',
  description: 'BOOBOY ($BOO) - Halloween vibes, crypto thrills. Join the spookiest memecoin community on Solana.',
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