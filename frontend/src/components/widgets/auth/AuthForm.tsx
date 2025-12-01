"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormMessageAlert } from "../../ui/FormMessageAlert";
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { MailIcon, LockIcon, GoogleIcon, MicrosoftIcon } from "../../icons";
import { identityServiceApi } from "@/lib/BE-library/identity-service-api";
import { TokenStorage } from "@/lib/utils/tokenStorage";

export const AuthForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Login with new identity service
      const response = await identityServiceApi.login({ username, password });

      if (response.success && response.data) {
        // Save tokens
        TokenStorage.saveTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          tokenType: response.data.tokenType || "Bearer",
        });

        // Get user info
        const userResponse = await identityServiceApi.getCurrentUser(response.data.accessToken);
        if (userResponse.success && userResponse.data) {
          TokenStorage.saveUser({
            id: userResponse.data.id,
            username: userResponse.data.username,
            email: userResponse.data.email,
            roles: userResponse.data.roles,
          });
        }

        setSuccess("Login successful! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard/home"), 1500);
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
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
        {/* Username/Email Field */}
        <TextField
          label="Username or Email"
          type="text"
          id="username"
          icon={<MailIcon />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        {success && <FormMessageAlert message={success} success={true} />}
        {error && <FormMessageAlert message={error} />}
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
        Don't have an account?{" "}
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
