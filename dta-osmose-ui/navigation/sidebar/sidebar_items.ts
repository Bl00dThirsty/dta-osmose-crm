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
  Grip,
  type LucideIcon,
} from "lucide-react";

const id = typeof window !== 'undefined' ? localStorage.getItem('id') : null;

export interface NavSubItem {
  title: string;
  path: string;          // ex: "crm/products" ou "user/:id"
  comingSoon?: boolean;
  permission?: string;
  newTab?: boolean;
}

export interface NavMainItem {
  title: string;
  path: string;          // utilisé si pas de sous-menus (items)
  icon?: LucideIcon;
  items?: NavSubItem[];  // sous-menus
  comingSoon?: boolean;
  permission?: string;  // si true => bouton simple + badge "Soon", pas de collapsible
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
      { title: "Dashboard Ventes", path: "crm/dashboard", permission: "view-dashboardSale", },
    ],
  },
  {
    title: "Produits",
    path: "products",
    icon: Package,
    permission: "view-product",
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
      { title: "Inventaire", path: "inventory/all", permission: "readAll-inventory" },
      { title: "Tableau des Pertes", path: "perte", permission: "readAll-user" },
    ],
  },
  {
    title: "Ventes",
    path: "sales",
    icon: ShoppingBag,
    permission: "create-sale",
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
    icon: BookAIcon,
    permission: "readAll-claim",
    items: [{ title: "Liste des Réclamations", path: "claims/all" }],
  },
  {
    title: "Marketing",
    path: "#",
    icon: ArrowBigDownDash,
    items: [
      { title: "Ajouter une Promotion", path: "promotions", permission: "create-promotion" },
      { title: "Promotions en Cours", path: "promotions/allInprogress" },
      { title: "Liste des Promotions", path: "promotions/all", permission: "readAll-promotion" },
    ],
  },
  {
    title: "Comptes clients",
    path: "customers",
    icon: Crown,
    items: [
      { title: "Liste des comptes clients", path: "crm/customers", permission: "readAll-customer" },
      { title: "Facturation", path: "sales/all", permission: "readAll-sale", },
    ],
  },
  {
    title: "Rapports",
    path: "#",
    icon: BookOpen,
    items: [
      { title: "Ajout d'un rapport", path: "report", permission: "create-report" },
      { title: "Liste des rapports", path: "report/all",  permission: "readAll-report"},
    ],
  },
  {
    title: "Utilisateurs",
    path: "#",
    icon: User,
    items: [
      { title: "Ajouter un utilisateur", path: "user/add", permission: "create-user" },
      { title: "Liste des utilisateurs", path: "user/all", permission: "readAll-user" },
      { title: "Role & Permissions", path: "role", permission: "readAll-role" },
      { title: "Designations", path: "rh/designation", permission: "readAll-designation" },
      { title: "Department", path: "rh/department", permission: "readAll-department" },
    ],
  },
  {
    title: "Paramètres",
    path: "#",
    icon: Settings2,
    items: [
      { title: "Compte", path: "user/all", permission: "readAll-user" },
      { title: "Facturation", path: "crm/setting", permission: "view-setting" },
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



// export const navCustomer: NavMainItem[] = [
//   {
//     title: "Dashboard",
//     path: "#",
//     icon: LayoutDashboard,
//     isActive: true,
//     items: [{ title: "Mon dashboard", path: "" }],
//   },
//   {
//     title: "Achats",
//     path: "sales",
//     icon: ShoppingBag,
//     items: [
//       { title: "Boutiques", path: "sales" },
//       { title: "Liste des Achats", path: "crm/customers/:id" },
//     ],
//   },
//   {
//     title: "Promesse d'achats",
//     path: "salepromise",
//     icon: ShoppingBag,
//     items: [
//       {title:"Ajout Promesse d'achat", path:"salepromise"},
//       { title:"Liste promesse d'achat", path:"salepromise/all"}
//     ],
//   },
// ];

export const getNavCustomer = (): NavMainItem[] => {
  const id = typeof window !== "undefined" ? localStorage.getItem("id") : null;

  return [
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
        { title: "Liste des Achats", path: id ? `crm/customers/${id}` : "crm/customers" },
      ],
    },
    {
      title: "Promesse d'achats",
      path: "salepromise",
      icon: ShoppingBag,
      items: [
        { title: "Ajout Promesse d'achat", path: "salepromise" },
        { title: "Liste promesse d'achat", path: "salepromise/allCustomer" },
      ],
    },
  ];
};
