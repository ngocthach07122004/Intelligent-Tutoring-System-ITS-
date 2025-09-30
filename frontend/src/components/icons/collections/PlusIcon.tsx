import React from "react";

export const PlusIcon = ({
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
    className={`lucide lucide-plus shrink-0 ${className}`}
  >
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);
