'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

import ScrollToTop from './ScrollToTop';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-1 w-full">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
