"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormMessageAlert } from "../../ui/FormMessageAlert";
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { MailIcon, LockIcon, GoogleIcon, MicrosoftIcon } from "../../icons";
import { AuthOperation } from "@/lib/BE-library/main";

const auth = new AuthOperation();

export const AuthForm = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);
    setError("");
    setSuccess(""); // Clear previous success message

    // Simulate API call
    try {
      const response = await auth.signin({ username, password });
      console.log("Signin successful:", response);
      setSuccess(
        response.message || "Login successful! Redirecting to dashboard..."
      );
      setTimeout(() => router.push("/dashboard/home"), 2000); // Redirect after 2 seconds
    } catch (err: any) {
      setError(err.message);
    }

    if (!username.includes("@") || password.length < 4) {
      setError("Email or password is not correct.");
    }

    setLoading(false);
    setIsDisabled(false);
  };
  return (
    <div>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-xl font-semibold leading-none tracking-tight">
          Log in
        </h3>
        <p className="text-sm text-zinc-500 text-muted-foreground">
          Enter your details below to sign into your account.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="p-6 pt-0 flex flex-col gap-4"
      >
        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          id="email"
          icon={<MailIcon />}
          value={username}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          id="password"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
          <a
            href="/auth/forgot-password"
            className="text-sm underline text-muted-foreground"
          >
            Forgot your password?
          </a>
        </TextField>
        {success && <FormMessageAlert message={success} success={true} />}{" "}
        {/* Display success message */}
        {error && <FormMessageAlert message={error} />}{" "}
        {/* Display error message */}
        {/* Submit Button */}
        <CustomButton
          type="submit"
          className="w-full text-primary-foreground hover:bg-[#1e1e2f] hover:text-white transition-all duration-300 ease-in-out transform active:scale-95"
          spinnerIcon={loading}
          disabled={loading || isDisabled}
        >
          {loading ? "Logging in..." : "Log in"}
        </CustomButton>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="h-px flex-1 bg-gray-300" />
          Or continue with
          <div className="h-px flex-1 bg-gray-300" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <CustomButton
            className=" w-full border border-gray-300 hover:bg-accent"
            onClick={() => console.log("Google login")}
          >
            <GoogleIcon className="mr-2" />
            Google
          </CustomButton>
          <CustomButton
            className="w-full border border-gray-300 hover:bg-accent"
            onClick={() => console.log("Microsoft login")}
          >
            <MicrosoftIcon className="mr-2" />
            Microsoft
          </CustomButton>
        </div>
      </form>
      <p className="items-center p-6 pt-0 flex justify-center gap-1 text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <a
          href="/auth/signup"
          className="underline font-semibold text-gray-700"
        >
          Sign up
        </a>
      </p>
    </div>
  );
};
