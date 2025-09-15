import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/app/[institution]/(routes)/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tag, HomeIcon } from "lucide-react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  //Get github stars from github api

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      
      <div className="flex justify-end items-center space-x-5 w-full p-5">
        <ThemeToggle />
        <div className="flex justify-center ">
        <Link href={`/`}>
            <HomeIcon />
        </Link>
      </div>
      </div>
      <div className="flex items-center grow h-full overflow-hidden">
        {children}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;