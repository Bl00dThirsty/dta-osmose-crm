import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import { Metadata } from "next";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/(routes)/components/app-sidebar"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL! || "http://localhost:3000"
  ),
  title: "",
  description: "",
  openGraph: {
    images: [
      {
        url: "/images/opengraph-imaage.png",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/images/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
    <div className="flex h-screen w-screen">
      <AppSidebar />
      <div className="h-full w-full">
        <Header />
        <div className="overflow-x-auto h-full p-5"> <SidebarTrigger /> {children}</div>
        <Footer />
      </div>
    </div>
    </SidebarProvider>
  );
}
