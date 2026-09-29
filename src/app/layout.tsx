import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";
export const metadata: Metadata = {
  title: "Pro-Kitchen Admin",
  description: "Restaurant Operations Platform",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
