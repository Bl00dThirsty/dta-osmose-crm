"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

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

import { AppSwitcher } from "./app-switcher";
import { NavUser } from "@/app/[institution]/(routes)/components/nav-user";
import {
  navUser,
  navCustomer,
  NavMainItem,
  NavSubItem,
} from "@/navigation/sidebar/sidebar_items";

const data = {
  user: {
    name: "john",
    email: "Mega Admin",
    avatar: "/avatars/shadcn.jpg",
  },
};
<<<<<<< HEAD
=======
 const  navUser = [
    {
      title: "Dashoard",
      path: "#",
      icon: () => <LayoutDashboard strokeWidth="1.5" className="w-5 h-5" />,
      isActive: true,
      items: [
        { title: "Mon dashboard", path: "" },
        { title: "Dashbord Ventes", path: "crm/dashboard" },       
      ],
    },
    {
      title: "Produits",
      path: "products",
      icon: () => <Package strokeWidth="1.5" className="w-5 h-5" />,
      items: [
        { title: "Listes des produits", path: "crm/products" },
        { title: "Statistiques", path: "#" },
      ],
    },
    {
      title: "Stock de produits",
      path: "#",
      icon: () => <TrendingUp strokeWidth="1.5" className="w-5 h-5" />,
      items: [
        { title: "Tableau de rotation", path: "#" },
        { title: "Inventaire", path: "inventory/all" },
        { title: "Tableau des Pertes", path: "perte" }
      ],
      
    },
    {
      title: "Ventes",
      path: "sales",
      icon: () => <ShoppingBag strokeWidth="1.5" className="w-5 h-5" />,
      items: [
        { title: "Ventes", path: "sales" },
        { title: "Liste des ventes", path: "sales/all" },
        {title:"Ajout Promesse d'achat", path:"salepromise"},
        { title:"Liste promesse d'achat", path:"salepromise/all"}
        
      ],
    },
    {
      title: "Réclamations",
      path: "#",
      icon: () => <BookAIcon strokeWidth="1.5" className="w-5 h-5" />,
      items: [
        { title: "Liste des Réclamations", path: "claims/all" },
        
      ],
    },
    {
      title: "Marketing",
      path: "#",
      icon: () => <ArrowBigDownDash strokeWidth="1.5" className="w-5 h-5" />,
      items: [
        { title: "Ajouter une Promotion", path: "promotions" },
        { title: "Promotions en Cours", path: "promotions/allInprogress" },
        { title: "Liste des Promotions", path: "promotions/all" },
      ],
    },
    {
      title: "Comptes clients",
      path: "customers",
      icon: () => <Crown strokeWidth="1.5" className="w-5 h-5" />,
      items: [
        { title: "Liste des comptes clients", path: "crm/customers" },
        { title: "Facturation", path: "sales/all" },
      ],
    },
    {
      title: "Utilisateurs",
      url: "#",
      icon: () => <User strokeWidth="1.5" className="w-5 h-5" />,
      items: [
        { title: "Ajouter un utilisateur", path: "user/add" },
        { title: "Liste des utilisateurs", path: "user/all" },
        { title: "Role & Permissions", path: "role" },
        { title: "Designations", path: "rh/designation" },
        { title: "Department", path: "rh/department" },
        
      ],
    },
    
    {
>>>>>>> origin/CRM-IBA-ASP-15

// Petit badge "Soon"
const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">
    Soon
  </span>
);

export function AppSidebar({
  institution,
  ...props
}: { institution: string } & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const userType =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const menuItems: NavMainItem[] =
    userType === "Particulier" ? navCustomer : navUser;

  // Active state
  const isActive = (path: string, items?: NavSubItem[]) => {
    if (items?.length) {
      return items.some((sub) => pathname.startsWith(`/${institution}/${sub.path}`));
    }
    return pathname === `/${institution}/${path}`;
  };

  const isSubmenuOpen = (items?: NavSubItem[]) => {
    return items?.some((sub) => pathname.startsWith(`/${institution}/${sub.path}`)) ?? false;
  };

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
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isSubmenuOpen(item.items)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    {item.items && !item.comingSoon ? (
                      <SidebarMenuButton
                        isActive={isActive(item.path, item.items)}
                        tooltip={item.title}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        aria-disabled={item.comingSoon}
                        isActive={isActive(item.path)}
                        tooltip={item.title}
                      >
                        <Link
                          href={`/${institution}/${item.path}`}
                          target={item.newTab ? "_blank" : undefined}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          {item.comingSoon && <IsComingSoon />}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </CollapsibleTrigger>

                  {item.items && !item.comingSoon && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              aria-disabled={subItem.comingSoon}
                              isActive={isActive(subItem.path)}
                              asChild
                            >
                              <Link
                                href={`/${institution}/${subItem.path}`}
                                target={subItem.newTab ? "_blank" : undefined}
                              >
                                <span>{subItem.title}</span>
                                {subItem.comingSoon && <IsComingSoon />}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
