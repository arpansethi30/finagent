import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Financial AI Agent",
  description: "Your intelligent financial advisor powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Financial AI Agent</h1>
            <div className="space-x-4">
              <a href="/" className="hover:text-blue-200">Home</a>
              <a href="/stock-analysis" className="hover:text-blue-200">Stock Analysis</a>
              <a href="/portfolio" className="hover:text-blue-200">Portfolio</a>
              <a href="/sentiment" className="hover:text-blue-200">Sentiment</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
