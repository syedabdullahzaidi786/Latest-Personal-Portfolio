'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/admin/Toast';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const splash = document.getElementById('init-splash');
    if (splash) splash.classList.add('hidden');
  }, []);

  return (
    <ToastProvider>
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <AdminShell>{children}</AdminShell>
      )}
    </ToastProvider>
  );
}
