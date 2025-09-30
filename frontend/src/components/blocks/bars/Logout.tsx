"use client";

import { logout } from "@/app/api/auth"; // Import the logout API function
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout API
      router.push("/auth/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout failed:", error);
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
