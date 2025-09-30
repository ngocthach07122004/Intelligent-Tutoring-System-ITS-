import { useState } from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { EyeIcon } from "../icons";

type ValidRule = {
  rule: RegExp | null; // Validation rule as a regex
  message: string; // Error message if the rule is not satisfied
};

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode; // Allow children for additional elements
  validRules?: ValidRule[]; // Array of validation rules
};

export const TextField = ({
  label,
  icon,
  type,
  id,
  children,
  validRules = [],
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errorMessages, setErrorMessages] = useState<string | null>(null); // State to store error messages
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type; // Toggle between "text" and "password"
  const inputClassNames = `flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
    icon ? "pl-10" : ""
  }`;

  const handleValidation = (value: string) => {
    const error = validRules.find((rule) => rule.rule && !rule.rule.test(value)); // Find the first rule that fails
    setErrorMessages(error ? error.message : null); // Set the first error message or null if no errors
  };

  return (
    <div className="space-y-2 flex flex-col">
      {/* Label and optional children */}
      <div className="flex justify-between">
        <Label
          className={`text-sm font-medium leading-none ${
            errorMessages ? "text-red-500" : ""
          }`}
          htmlFor={id}
        >
          {label}
        </Label>
        {children && <div className="ml-auto">{children}</div>}
      </div>

      {/* Input field with optional icon */}
      <div className="relative inline-block h-9 w-full">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <Input
          id={id}
          type={inputType}
          className={inputClassNames}
          {...props}
          onChange={(e) => {
            props.onChange?.(e); // Call the parent onChange handler
            handleValidation(e.target.value); // Validate the input
          }}
        />

        {/* Password visibility toggle button */}
        {isPasswordField && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
            >
              <EyeIcon />
            </button>
          </span>
        )}
      </div>

      {/* Error messages */}
      {errorMessages && (
        <div className="text-sm text-red-500">
          <p>{errorMessages}</p>
        </div>
      )}
    </div>
  );
};
