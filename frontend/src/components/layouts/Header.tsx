'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HeaderWrapper() {
    const pathname = usePathname();
    if (pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 z-[50] w-full bg-[#1e1e2f] text-white p-4 shadow-lg">
            <div className="flex justify-between items-center px-6">
                {/* Logo bên trái */}
                <h1 className="text-xl font-bold">My App</h1>

                {/* Navigation + Auth buttons bên phải */}
                <div className="flex items-center gap-12">
                {/* Navigation */}
                    <nav className="flex gap-6">
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

                    {/* Auth buttons */}
                    <div className="flex gap-3">
                        <a
                        href="/auth/login"
                        className="px-4 py-2 rounded-md border border-white hover:bg-white hover:text-[#1e1e2f] transition"
                        >
                        Đăng nhập
                        </a>
                        <a
                        href="/auth/signup"
                        className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
                        >
                        Đăng ký
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}