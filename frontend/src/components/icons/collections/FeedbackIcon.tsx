import React from "react";

export const FeedbackIcon = ({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-message-circle shrink-0 ${className}`}
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
  </svg>
);
