"use client";

import React from "react";

interface Answer {
    id: number;
    author: string;
    content: string;
    votes: number;
    time: string;
}

interface Question {
    id: number;
    title: string;
    content: string;
    author: string;
    time: string;
    tags: string[];
    views: number;
    votes: number;
}

interface Props {
    question: Question;
    answers: Answer[];
}

export default function QuestionDetail({ question, answers }: Props) {
    return (
        <div className="max-w-3xl mx-auto py-10 space-y-8">
            {/* Question */}
            <div className="border p-5 rounded-xl bg-white shadow">
                <h1 className="text-2xl font-bold text-blue-600 mb-4">{question.title}</h1>

                <p className="text-gray-700 mb-3">{question.content}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-200 rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                    <span>Asked by {question.author} {question.time}</span>
                    <span>👁 {question.views} ⬆ {question.votes}</span>
                </div>
            </div>

            {/* Answers */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Answers ({answers.length})</h2>

                {answers.map((a) => (
                    <div key={a.id} className="border p-4 rounded-xl bg-gray-50">
                        <p className="text-gray-700 mb-2">{a.content}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Answered by {a.author} {a.time}</span>
                            <span>⬆ {a.votes}</span>
                        </div>
                    </div>
                ))}

                {answers.length === 0 && (
                    <p className="text-gray-500">Chưa có câu trả lời nào.</p>
                )}
            </div>
        </div>
    );
}
