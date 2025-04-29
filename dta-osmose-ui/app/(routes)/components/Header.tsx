import Feedback from "./Feedback";
import FulltextSearch from "./FulltextSearch";
import AvatarDropdown from "./ui/AvatarDropdown";

import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandComponent } from "@/components/CommandComponent";
import SupportComponent from "@/components/support";

const Header = () => {
  return (
    <>
      <div className="flex h-20 justify-between items-center p-5 space-x-5">
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
