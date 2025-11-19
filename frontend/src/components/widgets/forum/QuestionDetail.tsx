"use client";

import React, { useState } from "react";
import AnswerForm from "./AnswerForm";

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
    initialAnswers: Answer[];
}

export default function QuestionDetail({ question, initialAnswers }: Props) {
    const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

    const handleNewAnswer = (content: string) => {
        const newAnswer: Answer = {
            id: answers.length + 1,
            author: "Current User",
            content,
            votes: 0,
            time: "just now",
        };
        setAnswers([newAnswer, ...answers]);
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Question */}
            <div className="border p-4 sm:p-6 rounded-xl bg-white shadow">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-4">{question.title}</h1>

                <p className="text-gray-700 mb-3 text-sm sm:text-base">{question.content}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs sm:text-sm bg-gray-200 rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0">
                    <span>Asked by {question.author} {question.time}</span>
                    <span>👁 {question.views} ⬆ {question.votes}</span>
                </div>
            </div>

            {/* Answers */}
            <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold">Answers ({answers.length})</h2>

                {answers.map((a) => (
                    <div key={a.id} className="border p-3 sm:p-4 rounded-xl bg-gray-50">
                        <p className="text-gray-700 mb-2 text-sm sm:text-base">{a.content}</p>
                        <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0">
                            <span>Answered by {a.author} {a.time}</span>
                            <span>⬆ {a.votes}</span>
                        </div>
                    </div>
                ))}

                {answers.length === 0 && (
                    <p className="text-gray-500">Chưa có câu trả lời nào.</p>
                )}

                {/* Form trả lời */}
                <AnswerForm onSubmit={handleNewAnswer} />
            </div>
        </div>
    );
}
