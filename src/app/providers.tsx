"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/context/AuthContext";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" enableSystem>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
