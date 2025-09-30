import React from "react";

export const GoogleIcon = ({
  size = 24,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={size}
    height={size}
    {...props}
    className="shrink-0"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.4 3.2 29.5 1 24 1 14.8 1 7.2 6.6 3.9 14.1l7.1 5.5C12.9 13.4 17.1 9.5 24 9.5z"
    />
    <path
      fill="#34A853"
      d="M24 47c6.5 0 11.9-2.1 15.8-5.7l-7.2-5.6c-2.3 1.5-5.3 2.4-8.6 2.4-6.8 0-12.5-4.6-14.5-10.9l-7.1 5.5C7.2 41.4 14.8 47 24 47z"
    />
    <path
      fill="#4A90E2"
      d="M47 24c0-1.5-.1-3-.4-4.5H24v9h13.1c-1.1 3.1-3.1 5.7-5.9 7.5l7.2 5.6C43.5 37.4 47 31.2 47 24z"
    />
    <path
      fill="#FBBC05"
      d="M9.5 28.5c-.5-1.5-.8-3.1-.8-4.5s.3-3.1.8-4.5l-7.1-5.5C1 17.2 0 20.5 0 24s1 6.8 2.4 10l7.1-5.5z"
    />
  </svg>
);
