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
  getNavCustomer ,
  NavMainItem,
  NavSubItem,
} from "@/navigation/sidebar/sidebar_items";
const id = typeof window !== 'undefined' ? localStorage.getItem('id') : null;
const data = {
  user: {
    name: "john",
    email: "Mega Admin",
    avatar: "/avatars/shadcn.jpg",
  },
};

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
  const navCustomer = getNavCustomer(); 
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