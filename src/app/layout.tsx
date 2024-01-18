import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppBar from '@/components/AppBar'
import { Toaster } from 'react-hot-toast'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth'
import { redirect } from 'next/navigation'
import ShiftManager from '@/components/ShiftManager'
import SessionProvider from '@/components/Providers'
import Provider from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Door Knocking - TDX',
  description: ' Door Knocking - TDX',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
        <Toaster />
          <AppBar />
          <main className="flex flex-col items-center">

          <ShiftManager />
          </main>

        {children}
        </Provider>
      </body>
    </html>
  )
}


