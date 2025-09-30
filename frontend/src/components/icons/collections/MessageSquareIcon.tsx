import React from "react";

export const MessageSquareIcon = ({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-${size} h-${size} ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 15a2.25 2.25 0 01-2.25 2.25H6.75L3 21V6.75A2.25 2.25 0 015.25 4.5h14.25A2.25 2.25 0 0121.75 6.75v8.25z"
    />
  </svg>
);
