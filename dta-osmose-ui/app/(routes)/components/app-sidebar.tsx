import * as React from "react";

import { NavUser } from "@/app/(routes)/components/nav-user";

import {
  AudioWaveform,
  BookOpen,
  Package,
  ChartCandlestick,
  ChevronRightIcon,
  Command,
  Settings2,
  LayoutDashboard,
  TrendingUp,
  ArrowBigDownDash,
  Crown,
  User,
} from "lucide-react";

import { AppSwitcher } from "./app-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";


const data = {
  user: {
    name: "john",
    email: "Mega Admin",
    avatar: "/avatars/shadcn.jpg",
  },
  apps: [
    {
      name: "Supply Chain",
      logo:   ChartCandlestick,
      plan: "Management",
    },
    {
      name: "Ressources humaines",
      logo: AudioWaveform,
      plan: "Management",
    },
    {
      name: "Gestion des soins",
      logo: Command,
      plan: "Management",
    },
  ],
  navMain: [
    {
      title: "Dashoard",
      url: "#",
      icon: () => <LayoutDashboard className="w-20 h-20" />,
      isActive: true,
      items: [
        { title: "Dashbord Ventes", url: "/crm/dashboard" },
        { title: "Mon dashboard", url: "#" },
      ],
    },
    {
      title: "Produits",
      url: "/crm/dashboard",
      icon: () => <Package size={40} />,
      items: [
        { title: "Listes des produits", url: "/crm/products" },
        { title: "Statistiques", url: "#" },
      ],
    },
    {
      title: "Stock de produits",
      url: "#",
      icon: () => <TrendingUp  size={40} />,
      items: [
        { title: "Tableau de rotation", url: "#" },
      ],
    },
    {
      title: "Fournisseurs",
      url: "#",
      icon: () => <ArrowBigDownDash size={40} />,
      items: [
        { title: "Liste des fournisseurs", url: "#" },
        { title: "Commandes", url: "#" },
      ],
    },
    {
      title: "Comptes clients",
      url: "/crm/customers",
      icon: () => <Crown size={40} />,
      items: [
        { title: "Liste des comptes clients", url: "/crm/customers" },
        { title: "Facturation", url: "#" },
      ],
    },
    {
      title: "Utilisateurs",
      url: "#",
      icon: () => <User size={40} />,
      items: [
        { title: "Ajouter un utilisateur", url: "/user/add" },
        { title: "Liste des utilisateurs", url: "/user/all" },
        { title: "Role & Permissions", url: "/role" },
        { title: "Designations", url: "/rh/designation" },
        
      ],
    },
    {
      title: "Paramètres",
      url: "#",
      icon: () => <Settings2 size={40} />,
      items: [
        { title: "Compte", url: "#" },
        { title: "Facturation", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: () => <BookOpen size={40} />,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Commencer", url: "#" },
        { title: "Retour / Feedback", url: "#" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSwitcher />
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                  <div className="space-y-2">
                  <SidebarMenuButton tooltip={item.title}>
                    <div className="w-6 h-6 flex items-center justify-center">
                      {item.icon && item.icon()}
                    </div>
                      <span>{item.title}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
