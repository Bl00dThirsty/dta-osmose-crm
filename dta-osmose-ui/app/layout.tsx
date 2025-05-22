import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
<<<<<<< HEAD
=======
import { AuthProvider } from "./[institution]/(auth)/sign-in/context/authContext";
import store from "@/redux/store";
>>>>>>> origin/yvana
import Providers from "./_providers";

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
        </Providers>
        </ThemeProvider>
        <SonnerToaster />
      </body>
    </html>
  );
}