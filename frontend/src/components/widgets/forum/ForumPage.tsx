"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ForumPage = () => {
    const allQuestions = [
        {
            id: 1,
            title: "How to use React hooks properly?",
            content: "I am learning React and don't understand how useEffect works...",
            author: "Alice",
            time: "1 min ago",
            tags: ["react", "hooks"],
            views: 120,
            votes: 10,
            comments: 3,
            answered: true,
        },
        {
            id: 2,
            title: "What is event loop in Node.js?",
            content: "I heard Node.js uses a single thread, but how does it handle async?",
            author: "Bob",
            time: "5 mins ago",
            tags: ["nodejs", "javascript"],
            views: 95,
            votes: 7,
            comments: 2,
            answered: false,
        },
        ...Array.from({ length: 18 }, (_, i) => ({
            id: i + 3,
            title: `Sample Question ${i + 3}`,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            author: "User",
            time: `${i + 1}h ago`,
            tags: ["tag1", "tag2"],
            views: 20 + i,
            votes: i,
            comments: i % 3,
            answered: i % 2 === 0,
        })),
    ];

    const [filterType, setFilterType] = useState<
        "all" | "active" | "hot" | "unanswered"
    >("all");

    const [sortBy, setSortBy] = useState<
        "votes" | "views" | "newest" | "oldest"
    >("newest");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filtered = allQuestions.filter((q) => {
        if (filterType === "hot") return q.votes >= 5;
        if (filterType === "unanswered") return !q.answered;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "votes") return b.votes - a.votes;
        if (sortBy === "views") return b.views - a.views;
        if (sortBy === "newest") return b.id - a.id;
        if (sortBy === "oldest") return a.id - b.id;
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / pageSize);
    const currentQuestions = sorted.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold capitalize">
                    {filterType === "all" ? "All Questions" : filterType}
                </h1>

                {/* chuyển sang trang hỏi câu mới */}
                <Link href="/dashboard/forum/ask">
                    <Button className="bg-blue-600 text-white">+ Ask Question</Button>
                </Link>
            </div>

            <div className="border-b pb-3">
                <div className="flex justify-between items-center flex-wrap gap-3">
                    {/* Left: Question count */}
                    <p className="text-gray-600 text-sm whitespace-nowrap">
                        {sorted.length} questions
                    </p>

                    {/* Middle: Quick filters */}
                    <div className="flex justify-center flex-1 space-x-2">
                        {[
                            { key: "all", label: "Newest" },
                            { key: "active", label: "Active" },
                            { key: "hot", label: "Hot" },
                            { key: "unanswered", label: "Unanswered" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilterType(f.key as any)}
                                className={`px-3 py-1 rounded-md text-sm border transition ${filterType === f.key
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Right: Filter + Sort */}
                    <div className="flex items-center space-x-3 whitespace-nowrap">
                        <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
                            <label className="text-xs text-gray-500 mr-2">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="text-sm bg-transparent outline-none "
                            >
                                <option value="votes">Votes</option>
                                <option value="views">Views</option>
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách câu hỏi */}
            <div className="space-y-6">
                {currentQuestions.map((q) => (
                    <div
                        key={q.id}
                        className="border border-gray-300 rounded-xl p-5 hover:shadow-md transition bg-white dark:bg-gray-900"
                    >
                        <h2 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                            <Link href={`/dashboard/forum/${q.id}`}>{q.title}</Link>
                        </h2>

                        <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                            {q.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {q.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                            <span>
                                {q.author} asked {q.time}
                            </span>
                            <div className="flex space-x-4">
                                <span>👁 {q.views}</span>
                                <span>⬆ {q.votes}</span>
                                <span>💬 {q.comments}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {currentQuestions.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">
                        Không có câu hỏi nào phù hợp.
                    </p>
                )}
            </div>

            {/* PHÂN TRANG */}
            <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md text-sm border ${currentPage === i + 1
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ForumPage;
