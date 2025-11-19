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
                <label className="font-medium mb-1">
                    Your Answer
                </label>

                <p className="text-sm text-gray-500">
                    Please provide a detailed answer. You can include code, examples, and explanations.
                </p>

                <textarea
                    className="border rounded p-2 h-32  mt-1"
                    placeholder="Write your answer here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Post Your Answer
            </button>
        </form>
    );
}
