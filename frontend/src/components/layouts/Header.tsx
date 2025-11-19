'use client';

import { usePathname } from 'next/navigation';

export default function HeaderWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 z-[50] w-full bg-[#1e1e2f] text-white p-4 shadow-lg">
      <div className="flex justify-between items-center px-4 md:px-6">
        {/* Logo */}
        <h1 className="text-lg md:text-xl font-bold">My App</h1>

        {/* Navigation + Auth buttons */}
        <div className="flex items-center gap-4 md:gap-12">
          {/* Navigation (ẩn trên mobile) */}
          <nav className="hidden md:flex gap-6">
            <a href="/homepage" className="hover:underline">
              Trang chủ
            </a>
            <a href="/chat" className="hover:underline">
              Chat
            </a>
            <a href="/forum" className="hover:underline">
              Forum
            </a>
            <a href="/aboutus" className="hover:underline">
              About Us
            </a>
          </nav>

          {/* Auth buttons (luôn hiển thị) */}
          <div className="flex gap-2 md:gap-3">
            <a
              href="/auth/login"
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-white hover:bg-white hover:text-[#1e1e2f] transition text-sm md:text-base"
            >
              Đăng nhập
            </a>
            <a
              href="/auth/signup"
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition text-sm md:text-base"
            >
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
