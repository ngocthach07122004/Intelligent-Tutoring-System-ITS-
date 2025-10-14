"use client";

import React from "react";

export default function StudentManagementLayout({ children }: { children: React.ReactNode }) {
  // Layout chuyên biệt cho Student Management - không có header/footer/sidebar
  return (
    <div className="h-screen w-screen">
      {children}
    </div>
  );
}