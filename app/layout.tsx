import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { BookingProvider } from "@/context/BookingContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Suroloyo Booking - Pendakian Via Nyatnyono",
  description:
    "Sistem registrasi pendakian resmi, aman, dan terintegrasi. Nikmati keindahan alam dengan persiapan yang matang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background-dark font-display antialiased text-white overflow-x-hidden">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1F2E',
              color: '#fff',
              border: '1px solid #2A2F3E',
            },
            success: {
              iconTheme: {
                primary: '#007BFF',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <SmoothScroll>
          <BookingProvider>
            <div className="relative flex min-h-screen flex-col">{children}</div>
          </BookingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
