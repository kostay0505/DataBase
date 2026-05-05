import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Pigulevsky DataBase',
  description: 'Личная база знаний',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} bg-[#0d1117] text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  )
}
