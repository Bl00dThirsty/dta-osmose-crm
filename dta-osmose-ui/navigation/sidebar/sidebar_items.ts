// navigation/sidebar/sidebar_items.ts
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  ShoppingBag,
  BookAIcon,
  ArrowBigDownDash,
  Crown,
  Mail,
  Kanban,
  User,
  Settings2,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;          // ex: "crm/products" ou "user/:id"
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavMainItem {
  title: string;
  path: string;          // utilisé si pas de sous-menus (items)
  icon?: LucideIcon;
  items?: NavSubItem[];  // sous-menus
  comingSoon?: boolean;  // si true => bouton simple + badge "Soon", pas de collapsible
  isActive?: boolean;
  newTab?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const navUser: NavMainItem[] = [
  {
    title: "Dashboard",
    path: "#",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Mon dashboard", path: "" },
      { title: "Dashboard Ventes", path: "crm/dashboard" },
    ],
  },
  {
    title: "Produits",
    path: "products",
    icon: Package,
    items: [
      { title: "Liste des produits", path: "crm/products" },
      { title: "Statistiques", path: "#" },
    ],
  },
  {
    title: "Stock de produits",
    path: "#",
    icon: TrendingUp,
    items: [
      { title: "Tableau de rotation", path: "#" },
      { title: "Inventaire", path: "inventory/all" },
      { title: "Tableau des Pertes", path: "perte" },
    ],
  },
  {
    title: "Ventes",
    path: "sales",
    icon: ShoppingBag,
    items: [
      { title: "Ventes", path: "sales" },
      { title: "Liste des ventes", path: "sales/all" },
    ],
  },
  {
    title: "Réclamations",
    path: "#",
    icon: BookAIcon,
    items: [{ title: "Liste des Réclamations", path: "claims/all" }],
  },
  {
    title: "Marketing",
    path: "#",
    icon: ArrowBigDownDash,
    items: [
      { title: "Ajouter une Promotion", path: "promotions" },
      { title: "Promotions en Cours", path: "promotions/allInprogress" },
      { title: "Liste des Promotions", path: "promotions/all" },
    ],
  },
  {
    title: "Comptes clients",
    path: "customers",
    icon: Crown,
    items: [
      { title: "Liste des comptes clients", path: "crm/customers" },
      { title: "Facturation", path: "sales/all" },
    ],
  },
  {
    title: "Utilisateurs",
    path: "#",
    icon: User,
    items: [
      { title: "Ajouter un utilisateur", path: "user/add" },
      { title: "Liste des utilisateurs", path: "user/all" },
      { title: "Role & Permissions", path: "role" },
      { title: "Designations", path: "rh/designation" },
      { title: "Department", path: "rh/department" },
    ],
  },
  {
    title: "Paramètres",
    path: "#",
    icon: Settings2,
    items: [
      { title: "Compte", path: "user/:id" },
      { title: "Facturation", path: "crm/setting" },
    ],
  },
  {
    title: "Documentation",
    path: "#",
    icon: BookOpen,
    comingSoon: true,
  },
  {
    title: "Email",
    path: "#",
    icon: Mail,
    comingSoon: true,
  },
  {
    title: "Kanban",
    path: "#",
    icon: Kanban,
    comingSoon: true,
  },
];

export const navCustomer: NavMainItem[] = [
  {
    title: "Dashboard",
    path: "#",
    icon: LayoutDashboard,
    isActive: true,
    items: [{ title: "Mon dashboard", path: "" }],
  },
  {
    title: "Achats",
    path: "sales",
    icon: ShoppingBag,
    items: [
      { title: "Boutiques", path: "sales" },
      { title: "Liste des Achats", path: "crm/customers/:id" },
    ],
  },
];
