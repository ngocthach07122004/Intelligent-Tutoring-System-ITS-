import React, { useState } from "react";
import clsx from "clsx";
import { SpinnerIcon } from "../icons"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  spinnerIcon?: boolean; // Show spinner
  spinnerSize?: string; // Spinner size
  disabled?: boolean; // Disabled state
  type?: "button" | "submit" | "reset"; // Button type
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    setLoading: (loading: boolean) => void
  ) => void | Promise<void>; // Support both sync and async functions
};

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      spinnerIcon = false,
      spinnerSize = "h-4 w-4",
      disabled = false,
      type = "button", // Default type is "button"
      onClick,
      ...props
    },
    ref
  ) => {
    const [isSpinning, setIsSpinning] = useState(false);

    // Handle button click event
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return;

      setIsSpinning(true); // Enable spinner
      const result = onClick(e, setIsSpinning); // Call onClick function
      if (result instanceof Promise) {
        await result; // Wait if onClick is async
      }
      setIsSpinning(false); // Disable spinner
    };

    // Combine internal and external className
    const buttonClass = clsx(
      "inline-flex items-center justify-center rounded-md h-9 px-4 py-2",
      disabled && "opacity-50 cursor-not-allowed",
      className // External className is appended here
    );

    return (
      <button
        ref={ref}
        type={type} // Apply the type prop
        className={buttonClass}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {/* Show spinner if needed */}
        {(spinnerIcon && isSpinning) && (
          <SpinnerIcon size={spinnerSize} className="mr-2 text-primary-foreground" />
        )}
        {children}
      </button>
    );
  }
);

CustomButton.displayName = "Button";
