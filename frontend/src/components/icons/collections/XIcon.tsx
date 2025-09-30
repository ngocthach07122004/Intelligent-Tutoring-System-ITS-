import React from "react";

export const XIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    strokeLinejoin="round"
    color="currentColor"
    viewBox="0 0 16 16"
    className={`size-4 shrink-0 ${className || ""}`}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M.5.5h5.25l3.734 5.21L14 .5h2l-5.61 6.474L16.5 15.5h-5.25l-3.734-5.21L3 15.5H1l5.61-6.474L.5.5zM12.02 14L3.42 2h1.56l8.6 12h-1.56z"
      clipRule="evenodd"
    ></path>
  </svg>
);
