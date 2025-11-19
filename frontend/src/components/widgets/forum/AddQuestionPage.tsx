"use client";

import { useState } from "react";

export default function AskQuestionForm() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !body || !tags) {
            alert("Please fill in all required fields.");
            return;
        }

        console.log({
            title,
            body,
            tags: tags.split(" ").map((t) => t.trim())
        });

        alert("Question submitted!");
    };

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Ask a Public Question</h1>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Title */}
                <div className="flex flex-col">
                    <label className="font-medium mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    
                    <p className="text-sm text-gray-500">
                        Be specific and imagine you’re asking a question to another person. Min 15 characters.
                    </p>

                    <input
                        className="border rounded p-2 mt-1"
                        placeholder="e.g. How to fix React hydration error?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Body */}
                <div className="flex flex-col">
                    <label className="font-medium mb-1">
                        Body <span className="text-red-500">*</span>
                    </label>

                    <p className="text-sm text-gray-500">
                        Include all the information someone would need to answer your question. Min 30 characters.
                    </p>

                    <textarea
                        className="border rounded p-2 h-40 mt-1"
                        placeholder="Describe your problem with details and examples..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />

                    
                </div>

                {/* Tags */}
                <div className="flex flex-col">
                    <label className="font-medium mb-1">
                        Tags <span className="text-red-500">*</span>
                    </label>
                    
                    <p className="text-sm text-gray-500">
                        Add up to 5 tags to describe what your question is about.
                    </p>

                    <input
                        className="border rounded p-2 mt-1"
                        placeholder="e.g. javascript react nextjs"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />

                    
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Post your question
                </button>
            </form>
        </div>
    );
}
