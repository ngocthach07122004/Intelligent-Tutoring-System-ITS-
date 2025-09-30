"use client";

import React from "react";
import Sidebar from "../blocks/bars/SideBar";
import MobileSidebar from "../blocks/bars/MobileSidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <MobileSidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        <main>{children}</main>
      </div>
    </div>
  );
}
