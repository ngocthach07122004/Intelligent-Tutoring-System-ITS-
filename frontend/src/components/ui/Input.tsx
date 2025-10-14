import { InputHTMLAttributes } from "react";

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
    {...props}
  />
);
