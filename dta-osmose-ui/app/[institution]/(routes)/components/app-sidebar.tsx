"use client";

import * as React from "react";
//import { useAuth } from "@/app/[institution]/(auth)/sign-in/context/authContext";
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
  BookAIcon,
  ShoppingBag
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
//const { user } = useAuth();
//const userType = user?.userType ?? "user";
const userType = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
const id = typeof window !== 'undefined' ? localStorage.getItem('id') : null;

const data = {
  user: {
    name: "john",
    email: "Mega Admin",
    avatar: "/avatars/shadcn.jpg",
  },
};
 const  navUser = [
    {
      title: "Dashoard",
      path: "#",
      icon: () => <LayoutDashboard className="w-20 h-20" />,
      isActive: true,
      items: [
        { title: "Mon dashboard", path: "" },
        { title: "Dashbord Ventes", path: "crm/dashboard" },       
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
      items: [
        { title: "Tableau de rotation", path: "#" },
        { title: "Tableau des Pertes", path: "perte" }
      ],
      
    },
    {
      title: "Ventes",
      path: "sales",
      icon: () => <ShoppingBag size={40} />,
      items: [
        { title: "Ventes", path: "sales" },
        { title: "Liste des ventes", path: "sales/all" },
        
      ],
    },
    {
      title: "Réclamations",
      path: "#",
      icon: () => <BookAIcon size={40} />,
      items: [
        { title: "Liste des Réclamations", path: "claims/all" },
        
      ],
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
        { title: "Facturation", path: "sales/all" },
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
        { title: "Facturation", path: "crm/setting" },
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
  ];
  const  navCustomer = [
    {
      title: "Dashoard",
      path: "#",
      icon: () => <LayoutDashboard className="w-20 h-20" />,
      isActive: true,
      items: [
        { title: "Mon dashboard", path: "" },
        //{ title: "Dashbord Ventes", path: "crm/dashboard" },       
      ],
    },
    {
      title: "Achats",
      path: "sales",
      icon: () => <ShoppingBag size={40} />,
      isActive: true,
      items: [
        { title: "Boutiques", path: "sales" },
        { title: "Liste des Achats", path: `crm/customers/${id}` },
      ],
    },
  ];
//};
const menuItems = userType === "Particulier" ? navCustomer : navUser;
export function AppSidebar({
  institution,
  ...props
}: { institution: string } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSwitcher />
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden" />
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
          {menuItems.map((item) => (
  <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
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
        
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
