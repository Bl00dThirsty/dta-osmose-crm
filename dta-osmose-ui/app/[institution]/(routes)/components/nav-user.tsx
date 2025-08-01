"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  User,
  
} from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/[institution]/(auth)/sign-in/context/authContext"; // Import du contexte Auth

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar();
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const userName = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const { user: authUser, logout } = useAuth(); // Appel de la fonction logout depuis le contexte
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  const handleLogout = async () => {
    try {
      await logout(); // Appel de la fonction logout
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };
  const userName1 = authUser?.email?.split('@')[0] || user.name;
  const userRole1 = authUser?.role || 'Utilisateur';
  const userId = authUser?.id;

   const getAccountRoute = () => {
    if (!userId) return '/'; // Fallback si pas d'ID
    
    // Rôles qui vont vers /user
    if (['admin', 'staff', 'manager'].includes(userRole1.toLowerCase())) {
      return `/${institution}/user/${userId}`;
    }
    // Rôles qui vont vers /customer
    else if (['particulier', 'grossiste'].includes(userRole1.toLowerCase())) {
      return `/${institution}/crm/customers/${userId}`;
    }
    // Fallback par défaut
    return `/${institution}/`;
  };

  const handleAccountClick = () => {
    router.push(getAccountRoute());
  };
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
       alt="Pedro Duarte" />
                <AvatarFallback className="rounded-lg">JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName1}</span>
                <span className="truncate text-xs">{userRole1}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">IA</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName1}</span>
                  <span className="truncate text-xs">{userRole1}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAccountClick}>
                <BadgeCheck />
                Compte
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${institution}/notification`)}>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}