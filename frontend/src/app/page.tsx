'use client'

import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Home() {
    const refs = useRef<Record<number, HTMLParagraphElement | null>>({})

    return (
        <main className="min-h-screen bg-background text-gray-900 dark:text-white pt-20">
            {/* Hero section */}
            <section className="min-h-[90vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-normal pb-2 bg-gradient-to-r from-slate-400 to-slate-700 bg-clip-text text-transparent mb-10">
                    Hệ Thống Gia Sư Thông Minh
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
                    Từ đánh giá chi tiết đến thành thạo chuyên sâu. Hệ thống theo dõi, phản hồi, và gợi ý thông minh 24/7.
                </p>

                <div className="flex gap-4 mt-4">
                    <a
                        href="/auth/login"
                        className="px-6 py-3 rounded-md border border-blue-500 text-blue-500 
            hover:bg-blue-50 transition font-medium"
                    >
                        Đăng nhập
                    </a>

                    <a
                        href="/auth/signup"
                        className="px-6 py-3 rounded-md bg-blue-500 hover:bg-blue-600 
            text-white font-medium transition"
                    >
                        Đăng ký
                    </a>
                </div>

            </section>
        </main>
    );
}