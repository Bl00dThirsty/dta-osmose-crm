<<<<<<< HEAD
"use client";

import * as React from "react";

import { NavUser } from "@/app/[institution]/(routes)/components/nav-user";
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
  navMain: [
    {
      title: "Dashoard",
      path: "dashboard",
      icon: () => <LayoutDashboard className="w-20 h-20" />,
      isActive: true,
      items: [
        { title: "Dashbord Ventes", path: "dashboard" },
        { title: "Mon dashboard", path: "#" },
      ],
    },
    {
      title: "Produits",
      path: "products",
      icon: () => <Package size={40} />,
      items: [
        { title: "Listes des produits", path: "crm/products" },
        { title: "Statistiques", path: "#" },
      ],
    },
    {
      title: "Stock de produits",
      path: "#",
      icon: () => <TrendingUp size={40} />,
      items: [{ title: "Tableau de rotation", path: "#" }],
    },
    {
      title: "Fournisseurs",
      path: "#",
      icon: () => <ArrowBigDownDash size={40} />,
      items: [
        { title: "Liste des fournisseurs", path: "#" },
        { title: "Commandes", path: "#" },
      ],
    },
    {
      title: "Comptes clients",
      path: "customers",
      icon: () => <Crown size={40} />,
      items: [
        { title: "Liste des comptes clients", path: "crm/customers" },
        { title: "Facturation", path: "#" },
      ],
    },
    {
      title: "Paramètres",
      path: "#",
      icon: () => <Settings2 size={40} />,
      items: [
        { title: "Compte", path: "#" },
        { title: "Facturation", path: "#" },
        { title: "Billing", path: "#" },
      ],
    },
    {
      title: "Documentation",
      path: "#",
      icon: () => <BookOpen size={40} />,
      items: [
        { title: "Introduction", path: "#" },
        { title: "Commencer", path: "#" },
        { title: "Retour / Feedback", path: "#" },
      ],
    },
  ],
};

export function AppSidebar({
  institution,
  ...props
}: { institution: string } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSwitcher />
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden" />
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
                            <a
                              href={
                                subItem.path.startsWith("#")
                                  ? "#"
                                  : `/${institution}/${subItem.path}`
                              }
                            >
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
=======
"use client";

import * as React from "react";

import { NavUser } from "@/app/[institution]/(routes)/components/nav-user";
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
  navMain: [
    {
      title: "Dashoard",
      path: "dashboard",
      icon: () => <LayoutDashboard className="w-20 h-20" />,
      isActive: true,
      items: [
        { title: "Dashbord Ventes", path: "dashboard" },
        { title: "Mon dashboard", path: "#" },
      ],
    },
    {
      title: "Produits",
      path: "products",
      icon: () => <Package size={40} />,
      items: [
        { title: "Listes des produits", path: "crm/products" },
        { title: "Statistiques", path: "#" },
      ],
    },
    {
      title: "Stock de produits",
      path: "#",
      icon: () => <TrendingUp size={40} />,
      items: [{ title: "Tableau de rotation", path: "#" }],
    },
    {
      title: "Fournisseurs",
      path: "#",
      icon: () => <ArrowBigDownDash size={40} />,
      items: [
        { title: "Liste des fournisseurs", path: "#" },
        { title: "Commandes", path: "#" },
      ],
    },
    {
      title: "Comptes clients",
      path: "customers",
      icon: () => <Crown size={40} />,
      items: [
        { title: "Liste des comptes clients", path: "crm/customers" },
        { title: "Facturation", path: "#" },
      ],
    },
    {
      title: "Utilisateurs",
      url: "#",
      icon: () => <User size={40} />,
      items: [
        { title: "Ajouter un utilisateur", path: "user/add" },
        { title: "Liste des utilisateurs", path: "user/all" },
        { title: "Role & Permissions", path: "role" },
        { title: "Designations", path: "rh/designation" },
        
      ],
    },
    
    {

      title: "Paramètres",
      path: "#",
      icon: () => <Settings2 size={40} />,
      items: [
        { title: "Compte", path: "#" },
        { title: "Facturation", path: "#" },
        { title: "Billing", path: "#" },
      ],
    },
    {
      title: "Documentation",
      path: "#",
      icon: () => <BookOpen size={40} />,
      items: [
        { title: "Introduction", path: "#" },
        { title: "Commencer", path: "#" },
        { title: "Retour / Feedback", path: "#" },
      ],
    },
  ],
};

export function AppSidebar({
  institution,
  ...props
}: { institution: string } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSwitcher />
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden" />
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
                            <a
                              href={
                                subItem.path.startsWith("#")
                                  ? "#"
                                  : `/${institution}/${subItem.path}`
                              }
                            >
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
>>>>>>> origin/yvana
