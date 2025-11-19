"use client";

import { useState } from "react";

interface Props {
    onSubmit: (content: string) => void;
}

export default function AnswerForm({ onSubmit }: Props) {
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("Please enter your answer.");
            return;
        }

        onSubmit(content.trim());
        setContent(""); // reset form
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex flex-col">
                <label className="font-medium mb-1 text-sm sm:text-base">
                    Your Answer
                </label>

                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    Please provide a detailed answer. You can include code, examples, and explanations.
                </p>

                <textarea
                    className="border rounded p-2 sm:p-3 mt-1 w-full h-28 sm:h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Write your answer here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 sm:px-6 sm:py-3 rounded w-full sm:w-auto"
            >
                Post Your Answer
            </button>
        </form>
    );
}
