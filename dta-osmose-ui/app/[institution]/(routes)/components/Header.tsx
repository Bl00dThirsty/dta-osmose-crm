<<<<<<< HEAD
=======

>>>>>>> origin/yvana
import Feedback from "./Feedback";
import FulltextSearch from "./FulltextSearch";
import AvatarDropdown from "./ui/AvatarDropdown";

import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandComponent } from "@/components/CommandComponent";
import SupportComponent from "@/components/support";
<<<<<<< HEAD

const Header = () => {
  return (
    <>
      <div className="flex h-20 justify-between items-center p-5 space-x-5">
=======
//import { useRouter } from 'next/navigation';

const Header = () => {
  // const router = useRouter();
  // const handleGoBack = () => {
  //   router.back();
  // };
  return (
    <>
      <div className="flex h-20 justify-between items-center p-5 space-x-5">
      {/* <div className="mb-2">
        <button
          onClick={handleGoBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Retour
        </button>
      </div> */}
>>>>>>> origin/yvana
        <div className="flex justify-center">
          <FulltextSearch />
        </div>
        <div className="flex items-center gap-3">
          <Feedback />
          <ThemeToggle />
          <SupportComponent />
          <AvatarDropdown />
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Header;
