"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormMessageAlert } from "../../ui/FormMessageAlert"; // Import success message component
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { MailIcon, LockIcon, GoogleIcon, MicrosoftIcon } from "../../icons";
import { signup } from "@/app/api/auth";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const passwordRules = [
    { rule: /[A-Z]/, message: "Mix of uppercase & lowercase letters" },
    { rule: /.{8,}/, message: "Minimum 8 characters long" },
    { rule: /\d/, message: "Contain at least 1 number" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);
    setError("");
    setSuccess(""); // Clear previous success message

    try {
      const response = await signup({ name, email, password });
      console.log("Signup successful:", response);
      setSuccess("Signup successful! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard/home"), 2000); // Redirect after 2 seconds
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
    setIsDisabled(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-xl font-semibold leading-none tracking-tight">Sign up</h3>
        <p className="text-sm text-zinc-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-foreground underline">
            Log in
          </a>
        </p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="p-6 pt-0 flex flex-col gap-4">
        {/* Name Field */}
        <TextField
          label="Name"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          validRules={[
            { rule: /.+/, message: "Name is required." },
          ]}
        />

        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          id="email"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validRules={[
            { rule: /.+/, message: "Email is required." },
            { rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
          ]}
        />

        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          id="password"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          validRules={[
            { rule: /.+/, message: "Password is required." },
            { rule: /[A-Z]/, message: "Password does not meet requirements." },
            { rule: /.{8,}/, message: "Password does not meet requirements." },
            { rule: /\d/, message: "Password does not meet requirements." },
          ]}
        />

        {/* Password Rules */}
        <ul className="text-sm space-y-1">
          {passwordRules.map((rule, index) => (
            <li
              key={index}
              className={
                rule.rule.test(password) ? "text-green-500" : "text-muted-foreground"
              }
            >
              • {rule.message}
            </li>
          ))}
        </ul>

        {success && <FormMessageAlert message={success} success={true}/>} {/* Display success message */}
        {error && <FormMessageAlert message={error} />} {/* Display error message */}

        {/* Submit CustomButton */}
        <CustomButton
          type="submit"
          className="w-full bg-primary text-primary-foreground"
          spinnerIcon={loading}
          disabled={loading || isDisabled}
        >
          {loading ? "Creating account..." : "Create account"}
        </CustomButton>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="h-px flex-1 bg-foreground" />
          Or continue with
          <div className="h-px flex-1 bg-foreground" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CustomButton
            className=" w-full border hover:bg-accent hover:text-accent-foreground"
            onClick={() => console.log("Google login")}
          >
            <GoogleIcon className="mr-2" />
            Google
          </CustomButton>
          <CustomButton
            className="!text-foreground w-full border hover:bg-accent hover:text-accent-foreground"
            onClick={() => console.log("Microsoft login")}
          >
            <MicrosoftIcon className="mr-2" />
            Microsoft
          </CustomButton>
        </div>
      </form>
      <p className="items-center p-6 inline-bloc bg-muted rounded-b-xl border-t pt-6 text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <a href="#" className="font-medium text-foreground underline">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="#" className="font-medium text-foreground underline">
          Privacy Policy
        </a>
        . Need help?{" "}
        <a href="#" className="font-medium text-foreground underline">
          Get in touch
        </a>
        .
      </p>
    </div>
  );
};
