import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluxa — AI Workflow Platform",
  description: "Node-based multimodal AI workflow platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}
