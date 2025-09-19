"use client"

import FulltextSearch from "./FulltextSearch";
import AvatarDropdown from "./ui/AvatarDropdown";
import NotificationBell from './ui/NotificationBell'
import PromoBanner from "./promoBanner"; 
import NotificationBellStock from './ui/NotificatioBellStock'
import ReadyCommandeNotification from './ui/NotificationReadyCommand'
import { PendingClaimsNotification }  from './ui/claim'
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandComponent } from "@/components/CommandComponent";
import SupportComponent from "@/components/support";
import { useGetActivePromotionsQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { Tag } from "lucide-react";

const Header = () => {
  const { institution } = useParams() as { institution: string }
  const { data: activePromotions = [] } = useGetActivePromotionsQuery({institution});
  const userType = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userType === "Particulier";

  return (
    <>
      <div className="flex h-20 justify-between items-center p-5 space-x-5 flex-wrap sm:flex-nowrap">
        <div className="flex justify-center flex-1 sm:flex-initial">
          <FulltextSearch />
        </div>
        <div className="flex justify-center">
        {activePromotions.length > 0 && (
          <PromoBanner />  
        )}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {!isParticulier && (
            <NotificationBell />
          )}
          {isParticulier && (
            <ReadyCommandeNotification />
          )}
          {!isParticulier && (
            <PendingClaimsNotification />
          )}
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
