<<<<<<< HEAD
"use client"

import * as React from "react"
import { ChevronsUpDown, GalleryVerticalEnd, Binoculars, Command } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const apps = [
  {
    name: "Gestion de Stocks",
    logo: GalleryVerticalEnd,
    plan: "Management",
  },
  {
    name: "Ressources humaines",
    logo: Binoculars,
    plan: "Productivité et management",
  },
  {
    name: "Gestion des soins",
    logo: Command,
    plan: "Management",
  },
];

export function AppSwitcher() {
  const { isMobile } = useSidebar()
  const [activeApp, setActiveApp] = React.useState(apps[0])

  if (!activeApp) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeApp.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeApp.name}</span>
                <span className="truncate text-xs">{activeApp.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Apps
            </DropdownMenuLabel>
            {apps.map((app, index) => (
              <DropdownMenuItem
                key={app.name}
                onClick={() => setActiveApp(app)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <app.logo className="size-3.5 shrink-0" />
                </div>
                {app.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
=======
"use client"

import * as React from "react"
import { ChevronsUpDown, GalleryVerticalEnd, Binoculars, Command } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const apps = [
  {
    name: "Gestion de Stocks",
    logo: GalleryVerticalEnd,
    plan: "Management",
  },
  {
    name: "Ressources humaines",
    logo: Binoculars,
    plan: "Productivité et management",
  },
  {
    name: "Gestion des soins",
    logo: Command,
    plan: "Management",
  },
];

export function AppSwitcher() {
  const { isMobile } = useSidebar()
  const [activeApp, setActiveApp] = React.useState(apps[0])

  if (!activeApp) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeApp.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeApp.name}</span>
                <span className="truncate text-xs">{activeApp.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Apps
            </DropdownMenuLabel>
            {apps.map((app, index) => (
              <DropdownMenuItem
                key={app.name}
                onClick={() => setActiveApp(app)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <app.logo className="size-3.5 shrink-0" />
                </div>
                {app.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
>>>>>>> origin/yvana
