import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import FloatingChatButton from '@/components/FloatingChatButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PathForge - AI-powered Learning Roadmaps',
  description: 'Build career-ready skills through personalized, AI-driven learning roadmaps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              {children}
              <FloatingChatButton />
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
