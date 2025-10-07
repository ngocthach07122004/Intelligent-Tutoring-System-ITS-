'use client'

import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const feedbacks = [
    {
      id: 1,
      name: "Nguyễn Minh",
      avatar: "/avatar1.png",
      feedback: "Nền tảng này giúp tôi học tập hiệu quả hơn rất nhiều! Hệ thống gợi ý bài học rất phù hợp với trình độ hiện tại của tôi.",
    },
    {
      id: 2,
      name: "Trần Lan",
      avatar: "/avatar2.png",
      feedback: "Tôi rất thích phần phản hồi tức thì. Sau mỗi bài học, tôi biết mình yếu ở đâu và có thể luyện lại ngay.",
    },
    {
      id: 3,
      name: "Phạm Quốc",
      avatar: "/avatar3.png",
      feedback: "Giao diện rất trực quan, dễ dùng và tốc độ phản hồi nhanh. Tôi có thể học ở bất kỳ đâu chỉ bằng điện thoại.",
    },
]

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
                <div className="flex gap-4">
                <a
                    href="/register"
                    className="px-6 py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
                >
                    Bắt đầu ngay
                </a>
                <a
                    href="/about"
                    className="px-6 py-3 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50 transition"
                >
                    Tìm hiểu thêm
                </a>
                </div>
            </section>

            <section className="py-20 px-20 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto text-center">
                    <h2 className="text-3xl leading-[1.1] font-extrabold tracking-tight md:text-4xl font-bold mb-6">
                    Cá nhân hóa học tập — Hiệu quả và thông minh
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 text-muted-foreground">
                    Nền tảng học tập trực tuyến thông minh giúp đánh giá năng lực, gợi ý lộ trình phù hợp, theo dõi tiến độ và hỗ trợ giảng viên quản lý, phân tích kết quả hiệu quả.
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left w-full">
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-gray-800 p-8 border border-black-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-3">🎓 Cá nhân hoá học tập</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                            Hệ thống phân tích năng lực và hành vi học để gợi ý nội dung, độ khó và lộ trình phù hợp từng học viên.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-8 border border-black-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-3">📚 Quản lý nội dung & khóa học</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                            Giảng viên tạo và chỉnh sửa khóa học, bài học, bài tập tương tác đa dạng — từ video, slide đến coding.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-gray-800 p-8 border border-black-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-3">📈 Theo dõi & đánh giá tiến độ</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                            Cung cấp công cụ kiểm tra, tự chấm điểm, thống kê chi tiết và báo cáo tiến độ học tập cho từng người dùng.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-gray-50 border border-black-200 dark:bg-gray-700 p-8">
                            <h3 className="text-xl font-semibold mb-3">💬 Tương tác & cộng đồng</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                            Tích hợp chat, diễn đàn Q&A và nhóm học tập giúp kết nối học viên, giảng viên và cộng đồng học tập năng động.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white-50 py-16 px-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    Lắng nghe chia sẻ từ người học
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3 mx-auto max-w-6xl">
                    {feedbacks.map((fb) => (
                    <Card
                        key={fb.id}
                        className="flex flex-col justify-between bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition"
                    >
                        <CardContent className="relative flex items-start gap-3 p-3">
                        <Quote className="w-6 h-6 text-black-500 shrink-0 mt-6" />
                        <div className="text-left text-gray-700 dark:text-gray-300 relative w-full mt-5">
                            <p
                            ref={(el) => {(refs.current[fb.id] = el)}}
                            // className={`${
                            //     expanded === fb.id ? "" : "line-clamp-4 overflow-hidden"
                            // } transition-all`}
                            >
                            {fb.feedback}
                            </p>

                            {/* {overflowed[fb.id] && expanded !== fb.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 dark:from-gray-800 to-transparent pointer-events-none" />
                            )} */}

                            {/* {overflowed[fb.id] && (
                            <button
                                onClick={() => setExpanded(expanded === fb.id ? null : fb.id)}
                                className="text-blue-500 text-sm mt-2 hover:underline"
                            >
                                {expanded === fb.id ? "Thu gọn" : "Xem thêm"}
                            </button>
                            )} */}
                        </div>
                        </CardContent>

                        <CardFooter className="flex h-[64px] border-t items-center justify-start px-6 py-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8">
                                <img
                                    src={fb.avatar}
                                    alt={fb.name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                                </div>
                                <div className="flex flex-col justify-center">
                                <span className="font-medium text-sm">{fb.name}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
            </section>
        </main>
    );
}