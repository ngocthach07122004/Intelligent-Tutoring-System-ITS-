"use client";

import { identityServiceApi } from "@/lib/BE-library/identity-service-api";
import { TokenStorage } from "@/lib/utils/tokenStorage";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await identityServiceApi.logout(); // Call the logout API
      TokenStorage.clearAuth(); // Clear tokens from local storage
      router.push("/auth/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, we should probably clear tokens and redirect
      TokenStorage.clearAuth();
      router.push("/auth/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2"
    >
      <span>Log out</span>
    </button>
  );
};
