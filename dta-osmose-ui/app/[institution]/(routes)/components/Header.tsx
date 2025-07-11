import Feedback from "./Feedback";
import FulltextSearch from "./FulltextSearch";
import AvatarDropdown from "./ui/AvatarDropdown";
import NotificationBell from './ui/NotificationBell'
import NotificationBellStock from './ui/NotificatioBellStock'
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandComponent } from "@/components/CommandComponent";
import SupportComponent from "@/components/support";
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
        <div className="flex justify-center">
          <FulltextSearch />
        </div>
        <div className="flex items-center gap-4">
          <NotificationBellStock />
          <NotificationBell />
          {/* <Feedback /> */}
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
