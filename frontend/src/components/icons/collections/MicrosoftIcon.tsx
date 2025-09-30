import React from "react";

export const MicrosoftIcon = ({
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
    <path fill="#F25022" d="M4 4h20v20H4z" />
    <path fill="#7FBA00" d="M24 4h20v20H24z" />
    <path fill="#00A4EF" d="M4 24h20v20H4z" />
    <path fill="#FFB900" d="M24 24h20v20H24z" />
  </svg>
);
