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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import type { NavMainItem } from "@/navigation/sidebar/sidebar_items";

interface NavMainProps {
  readonly items: readonly NavMainItem[];
  readonly institution: string;
}

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">
    Soon
  </span>
);

export function NavMain({ items, institution }: NavMainProps) {
  const path = usePathname();
  const { state, isMobile } = useSidebar();

  const isItemActive = (url: string, subItems?: NavMainItem["items"]) => {
    if (subItems?.length) {
      return subItems.some((sub) => path.startsWith(`/${institution}/${sub.path}`));
    }
    return path === `/${institution}/${url}`;
  };

  const isSubmenuOpen = (subItems?: NavMainItem["items"]) => {
    return subItems?.some((sub) => path.startsWith(`/${institution}/${sub.path}`)) ?? false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            // Cas 1 : ComingSoon => simple bouton désactivé
            if (item.comingSoon) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton aria-disabled tooltip={item.title}>
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.title}</span>
                    <IsComingSoon />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Cas 2 : Item avec sous-menus (collapsible)
            if (item.items && item.items.length > 0) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isSubmenuOpen(item.items)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isItemActive(item.path, item.items)}
                        tooltip={item.title}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isItemActive(subItem.path)}
                            >
                              <Link href={`/${institution}/${subItem.path}`}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // Cas 3 : Simple lien
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isItemActive(item.path)}
                  tooltip={item.title}
                >
                  <Link href={`/${institution}/${item.path}`}>
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
