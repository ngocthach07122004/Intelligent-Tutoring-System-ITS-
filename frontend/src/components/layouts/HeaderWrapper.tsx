'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ✅ chỉ render sau khi mounted (client)
  }, []);

  if (!mounted) return null;

  if (pathname.startsWith('/dashboard')) {
    return <header className="bg-blue-500 text-white p-4">Dashboard</header>;
  }

  if (pathname.startsWith('/login')) {
    return <header className="bg-green-500 text-white p-4">Login Page</header>;
  }

  if (pathname === '/') return null;

  return <header className="bg-gray-800 text-white p-4">Default Header</header>;
}
