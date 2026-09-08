"use client";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { RestaurantProvider } from "@/providers/restaurant-provider";
import { ToastProvider } from "@/providers/toast-provider";
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthProvider>
          <RestaurantProvider>
            <ToastProvider>{children}</ToastProvider>
          </RestaurantProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
