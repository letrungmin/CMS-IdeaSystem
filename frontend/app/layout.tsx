import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniIdeas CMS",
  description: "Enterprise Idea Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
=======
      {/* KHÔNG CÓ SIDEBAR HAY TOPBAR Ở ĐÂY NỮA NHÉ BỆ HẠ! */}
>>>>>>> ce7d26faf57dbd960db18dedb1323adf3e65d957
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}