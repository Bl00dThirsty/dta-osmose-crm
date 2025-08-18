import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
// import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AuthProvider } from "./[institution]/(auth)/sign-in/context/authContext";
import store from "@/redux/store";
import Providers from "./_providers";
import ToastProvider from "./providers/ToastProvider";


const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " min-h-screen"}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
        </ThemeProvider>
        {/* <SonnerToaster /> */}
        <ToastProvider />
      </body>
    </html>
  );
}