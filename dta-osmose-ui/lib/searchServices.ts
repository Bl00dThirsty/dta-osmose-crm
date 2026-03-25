export interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  icon: string;
  roles?: string[]; // ✅ autoriser l’accès selon le rôle
}

export const searchModules = (
  query: string,
  institution: string,
  role: string | null
): SearchResult[] => {
  if (!query || typeof query !== "string") {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  const allModules: SearchResult[] = [
    {
      id: "sales",
      title: "Ventes",
      description: "Liste des ventes et commandes",
      path: `/${institution}/sales/all`,
      category: "Vente",
      icon: "📝",
      roles: ["admin", "staff", "manager"], // visible uniquement pour admin/staff
    },
    {
      id: "sales-create",
      title: "Nouvelle Vente",
      description: "Créer une nouvelle vente",
      path: `/${institution}/sales/`,
      category: "Vente",
      icon: "➕",
      roles: ["admin", "staff", "manager", "Particulier"],
    },
    {
      id: 'salepromise',
      title: 'Promesses d\'achat',
      description: 'Liste des promesses d\'achat',
      path: `/${institution}/salepromise/all`,
      category: 'Vente',
      icon: '🤝',
      roles: ['admin', 'manager', 'staff', 'Particulier'] // ← Client aussi
    },
    {
      id: 'salepromise-create',
      title: 'Nouvelle Promesse',
      description: 'Créer une promesse d\'achat',
      path: `/${institution}/salepromise/`,
      category: 'Vente',
      icon: '➕',
      roles: ['admin', 'manager', 'staff', 'Particulier']
    },
    {
      id: "customers",
      title: "Clients",
      description: "Gestion de la clientèle",
      path: `/${institution}/crm/customers`,
      category: "Clients",
      icon: "👥",
      roles: ["admin", "staff"],
    },
    {
      id: "claims",
      title: "Réclamations",
      description: "Gestion des réclamations clients",
      path: `/${institution}/claims/all`,
      category: "Service Client",
      icon: "📝",
      roles: ["admin", "staff" ], // dispo pour tout le monde
    },
    {
      id: "promotions",
      title: "Promotions",
      description: "Liste des promotions disponibles",
      path: `/${institution}/promotions/all`,
      category: "Catalogue",
      icon: "🎉",
      roles: ["admin", "staff" ], // visible aussi aux clients
    },
    {
      id: "promotions-create",
      title: "Nouvelle promotion",
      description: "Créer une nouvelle promotion",
      path: `/${institution}/promotions/`,
      category: "Catalogue",
      icon: "➕",
      roles: ["admin"], // réservé à l’admin
    },
    {
      id: "report-create",
      title: "Nouveau rapport",
      description: "Créer un nouveau rapport",
      path: `/${institution}/report/`,
      category: "Suivi personnel",
      icon: "➕",
      roles: ["admin", "staff"],
    },
    {
      id: "rapports",
      title: "Rapports",
      description: "Gestion des rapports",
      path: `/${institution}/report/all`,
      category: "Suivi personnel",
      icon: "📊",
      roles: ["admin", "staff"],
    },
  ];

  // filtrer d’abord par rôle
  const modulesByRole = allModules.filter((module) =>
    module.roles ? module.roles.includes(role || "") : true
  );

  // filtrer par recherche
  const categories = [
    "vente", "ventes", "commandes", "promesse", "promesses",
    "client", "clients", "produit", "produits",
    "réclamation", "réclamations", "suivi", "catalogue"
  ];

  if (categories.includes(normalizedQuery)) {
    return modulesByRole.filter((module) =>
      module.category.toLowerCase().includes(normalizedQuery)
    );
  }

  return modulesByRole.filter(
    (module) =>
      module.title.toLowerCase().includes(normalizedQuery) ||
      module.description.toLowerCase().includes(normalizedQuery) ||
      module.category.toLowerCase().includes(normalizedQuery) ||
      module.path.toLowerCase().includes(normalizedQuery)
  );
};
