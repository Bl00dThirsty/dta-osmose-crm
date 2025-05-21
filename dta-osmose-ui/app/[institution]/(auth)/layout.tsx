import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/app/[institution]/(routes)/components/Footer";


const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  //Get github stars from github api

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="flex justify-end items-center space-x-5 w-full p-5">
        <ThemeToggle />
      </div>
      <div className="flex items-center grow h-full overflow-hidden">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;