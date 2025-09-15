"use client";

import Feedback from "./Feedback";
import FulltextSearch from "./FulltextSearch";
import AvatarDropdown from "./ui/AvatarDropdown";
import NotificationBell from './ui/NotificationBell'
import NotificationBellStock from './ui/NotificatioBellStock'
import ReadyCommandeNotification from './ui/NotificationReadyCommand'
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandComponent } from "@/components/CommandComponent";
import SupportComponent from "@/components/support";
import { useGetActivePromotionsQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { Tag } from "lucide-react";
//import { useRouter } from 'next/navigation';

const Header = () => {
  const { institution } = useParams() as { institution: string }
  const { data: activePromotions = [] } = useGetActivePromotionsQuery({institution});
  const userType = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userType === "Particulier";
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
        {activePromotions.length > 0 && (
        <div className="mb-2 p-4 bg-gradient-to-r from-gray-500 via-blue-700 to-green-800 text-white rounded-lg shadow-lg flex items-center gap-3 ">
          <Tag className="w-6 h-6" />
          <div>
            <p className="font-semibold text-lg">🎉 Des promotions sont disponibles</p>
          </div>
        </div>
      )}
        <div className="flex items-center gap-4">
        {/* {!isParticulier && (
          <NotificationBellStock />
        )} */}
         {!isParticulier && (
          <NotificationBell />
         )}
          {isParticulier && (
          <ReadyCommandeNotification />
          )}
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
