import React from "react";

export const MenuIcon = ({
  size = 24,
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
    className={`lucide lucide-menu shrink-0 ${className}`}
  >
    <path d="M3 12h18"></path>
    <path d="M3 6h18"></path>
    <path d="M3 18h18"></path>
  </svg>
);
