import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export interface Product {
  id: string; 
  EANCode?: string;  
  quantity: number;       
  brand: string;
  designation: string;
  sellingPriceTTC: number;
  purchase_price: number;
  sellingPriceCFA: number;
  purchasePriceCFA?: number;
  restockingThreshold: number;
  warehouse: string;
  Promotion?: Promotion[];
}

export interface NewProduct {
  id?: string; 
  EANCode?: string;  
  quantity: number;       
  brand: string;
  designation: string;
  sellingPriceTTC: number;
  purchase_price: number;
  sellingPriceCFA: number;
  purchasePriceCFA?: number;
  restockingThreshold: number;
  warehouse: string;
}

export interface User {
    id:number;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    email: string;
    phone?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    gender?: string;
    birthday?: string;
    CnpsId?: string;
    joinDate?: string;
    employeeId?: string;
    bloodGroup?: string;
    salary?: number;
    role: string;
    status?: boolean;
    departmentId?: number;
    designationId?: number;
    emergencyPhone1?: string;
    emergencyname1?: string;
    emergencylink1?: string; 
    designation?: {
        name: string;
    };
    department?: {   
       name: string;
    };
}
export interface Department {
  id:number;
  name: string;
}

export interface Designation {
  id:number;
  name: string;
}
export interface NewDesignation {
  name: string;
}
export interface Role {
  id:number;
  name: string;
  rolePermission?: {
    permission:{
      id: number;
      name: string;
    }
  }
}
export interface NewRole {
  name: string;
  rolePermission?: {
    permission:{
      id:number;
      name: string;
    }
  }

}

export interface salePromiseProduct{
  id: number;
  product_id: string;
  product_quantity: number;
  product_sale_price: number;
  totalPrice: number;
  product?:{
    designation: string;
    quantity: number;
    EANCode?: string;
    sellingPriceTTC: number;
    sellingPriceCFA?: number;
    purchasePriceCFA?: number;
  }
}

export interface salePromise {
  id: number;
  dueDate: Date;
  reminderDate: Date;
  createdAt: Date;
  customerId?: number;
  userId?: number;
  customerCreatorId?:  number;
  saleId: string;
  institutionId?: string;
  customer_address?: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  discount: number;
  note: string;
  status: string;
  items: salePromiseProduct[];
  user: {
    id: number;
    firstName: string;
    lastName: string;
  } 
  customer:{
    id: number;
    customId: string;
    name: string;
    phone: string;
    email: string;
    type_customer?: string;
    ville?: string;
    quarter?: string;
    credits?: Credit[];

  }
}

export interface SaleItemInput {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?:{
    designation: string;
    quantity: number;
    EANCode?: string;
    sellingPriceTTC: number;
    sellingPriceCFA?: number;
    purchasePriceCFA?: number;
  }
}

export interface SaleInvoice{
  id: string;     
  invoiceNumber?:   string ;     
  customerId :     number;
  userId?:          number;
  customerCreatorId?: number;
  institutionId?:   string;
  totalAmount :    number;
  discount:        number;
  finalAmount?:     number;
  paidAmount?:  number;
  dueAmount?:     number;
  paymentStatus?:   string ;     
  paymentMethod?:   string ;
  ready?: boolean;
  delivred?: boolean;
  profit: number;
  createdAt:  Date;
  date?: Date;
  salePromiseId?: number;
  items: SaleItemInput[];
  user: {
    id: number;
    firstName: string;
    lastName: string;
  } 
  customer:{
    id: number;
    customId: string;
    name: string;
    phone: string;
    email: string;
    type_customer?: string;
    ville?: string;
    quarter?: string;
    credits?: Credit[];

  }
  claims?: Claim[];
   
}

export interface NewSaleInvoice{      
  invoiceNumber?:   string ;     
  customerId? :     number;
  userId?:          number;
  customerCreatorId?: number;
  institutionId?:   string;
  totalAmount :    number;
  discount:        number;
  finalAmount:     number;
  paidAmount?:     number;
  dueAmount?:     number;
  paymentStatus?:   string ;     
  paymentMethod?:   string ;
  ready?: boolean;
  delivred?: boolean;
  profit: number;
  createdAt?:  Date;
  date?: Date;
  salePromiseId?: number;
  items: SaleItemInput[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  } 
  customer?:{
    id: number;
    customId: string;
    name: string;
    phone: string;
    email: string;
    type_customer?: string;
    ville?: string;
    quarter?: string;
    credits?: Credit[];
  }
  claims?: Claim[];
   
}

export interface Credit{
  id   : string;     
  customerId: number;
  amount: number; 
  usedAmount:  number;           
  createdAt :  Date;    

}

export interface Customer { 
  id:number;
  customId: string;
  name: string;
  userName: string;
  userId?:  number;
  phone: string;
  nameresponsable?: string;
  email: string;
  password: string;
  ville?: string;
  website?: string;
  status?: boolean;
  type_customer?: string;
  institutionId?: string
  role: string;
  quarter?: string;
  region?: string; 
  saleInvoice?: SaleInvoice[];
  credits?: Credit[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  } 
}

export interface NewCustomer {
  customId: string;
  name: string;
  userName: string;
  userId?:  number;
  phone: string;
  nameresponsable?: string;
  email: string;
  password: string;
  ville?: string;
  website?: string;
  status?: boolean;
  type_customer?: string;
  institutionId?: string
  role?: string;
  quarter?: string;
  region?: string; 
  saleInvoice?: SaleInvoice[];
  credits?: Credit[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  } 
}

export interface ClaimResponse{
  id: string;
  claimId: string;
  status: string;
  description?: string
}

export interface Claim { 
  id:string;
  invoiceId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  reason: string;
  description?: string;
  response?: ClaimResponse;
  createdAt:  Date;
  invoice?: {
    id: string;
    invoiceNumber: string;
    createdAt:  Date;
    customer?: {
      id: number;
      customId: string;
      name: string;
      phone: string;
      ville?: string;
      quarter?: string;
    };
    items?: SaleItemInput[]; // ou un type plus précis si nécessaire
  };
  product:{
    id: string;
    designation: string;
  }
}

export interface Notification{
  id: string;
  title: string;
  message: string;
  type?: string;
  institutionId: string
  isRead: boolean;
  userId: number;
  customerId: number;
  saleId: number;
  createdAt: Date;
}

export interface AppSetting{
  id: number;
  company_name: string;
  tag_line: string;
  address: string
  phone: string;
  email : string;
  website: string;
  footer: string;
}
export interface NewAppSetting{
  company_name: string;
  tag_line: string;
  address: string
  phone: string;
  email : string;
  website: string;
  footer: string;
}
export interface InventoryItem {
  productId: string;
  designation: string;
  systemQty: number;
  countedQty: number;
  difference: number;
  comment?: string;
  product?:{
    designation: string;
    quantity: number;
    EANCode?: string;
    brand: string;
    sellingPriceTTC: number;
  }
};

export interface Inventory {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  titre?: string;
  note?: string;
  location?: string;
  institutionId?:   String;
  performedById: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  } 
  inventoryItems: InventoryItem[];
};

export interface Promotion {
  id: string
  title: string
  discount: number    // remise en pourcentage
  startDate: Date
  endDate: Date
  status: boolean 
  creatorId?: number
  productId?: string 
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  }
  product?:{
    designation: string;
    quantity: number;
    EANCode?: string;
    sellingPriceTTC: number;
    sellingPriceCFA: number;
    purchasePriceCFA: number;
  }  
}

export interface NewPromotion {
  title: string
  discount: number    // remise en pourcentage
  startDate: Date
  endDate: Date
  status: boolean
  creatorId?: number
  productId: string  
  user: {
    id: number;
    firstName: string;
    lastName: string;
  } 
  product?:{
    designation: string;
    quantity: number;
    EANCode?: string;
    sellingPriceTTC: number;
    sellingPriceCFA: number;
    purchasePriceCFA?: number;
  }
}

export interface Report{
  id: number;
  prospectName: string;
  date: Date;
  userId?: number
  degree?: string;
  responsable?: string;
  rdvObject: string;
  nextRdv?: Date;
  time: string;
  contact: string;
  address: string;
  email?: string;
  pharmacoVigilance?: string;
  institution:   string;
  createdAt: Date;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  }
}

export type MetricItem = {
  count: number;
  type: string; // "Ventes" | "Profits" | "nombre de facture"
  date?: string;
  amount?: number;
};
export interface DashboardMetrics {
  salesByCity: { ville: string; montant: number; nombreVentes: number; }[];
  saleProfitCount: { type: string; amount?: number }[];
  formattedData3: { type: string; count?: number }[];
  /*previousMetrics?: {
    saleProfitCount: { type: string; amount?: number }[];
    formattedData3: { type: string; count?: number }[];
  };*/
  totalAvailableCredit?: number;
  totalUsers?: number;
  customerStats?: {
    avoirDisponible?: number;
    totalAchats?: number;
    nombreCommandes?: number;
    nombreCommandesImpaye?: number;
  };
    
chartData?: {
    date: string;
    totalVentes: number;
    nombreVentes: number;
    [key: string]: any;
  }[];

  creditTrend?: {
    trend: string;
    trendDirection: string;
  };
    
    /*customerStats?: {
      totalAchats: number;
      nombreCommandes: number;
      avoirDisponible: number;
      nombreCommandesImpaye: number;
    };*/
    // ✅ Ajout : données de la période précédente
  previousMetrics?: {
    saleProfitCount: MetricItem[];
    formattedData3: MetricItem[];
    totalAvailableCredit?: number;
  };
}
 export interface DashboardSales {
  favoriteProductsByCustomer: any;
  topCustomers: any;
  topProducts: any;
  lowProducts: any;
  salesByProduct: {
    totalSales: any;
    productId: string;
    productName: string;
    totalQuantity: number;
    totalAmount: number;
  }[];

  salesByPharmacy: {
    totalSales: any;
    pharmacyId: string;
    pharmacyName: string;
    totalQuantity: number;
    totalAmount: number;
  }[];

  salesByCity: {
  cityName: string;
  totalSales: number;
  totalQuantity: number;
  invoiceCount: number;
  percentage: number;
  growth: string;
  isPositive: boolean;
}[];
  customers?: Array<{
    id: string;
    name: string;
  }>;
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ 
     baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
     prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      }, }),
    reducerPath: "api",
    tagTypes: ["DashboardMetrics", "DashboardSales","getTopProducts","getTopCustomers", "Products", "Users", "Departments", "Designations", "Roles", "Customers", "SalePromise", "Sales", "AppSettings", "Claims", "Notifications", 
      "Inventorys", "Promotions", "Reports"],

    endpoints: (build) => ({

      // ============================================================================
// DASHBOARD ENDPOINTS
// Auteur : Malonguem Laura
// Description : Gestion du contenu et de l'affichage des dashboards
// ============================================================================
      // dashboard principal
        getDashboardMetrics: build.query<DashboardMetrics, { institution: string, startDate?: string; endDate?: string  }>({
            query: ({ institution, startDate, endDate }) => {
              const params = new URLSearchParams();
              if (startDate) params.append("startDate", startDate);
              if (endDate) params.append("endDate", endDate);
          
              return `/dashboard/${institution}?${params.toString()}`;
            },
            providesTags: ["DashboardMetrics"]
        }),
        //dashboard des des ventes
        getDashboardSales: build.query< DashboardSales,  { institution?: string; startDate?: string; endDate?: string; customerId?: string } | void>({
        query: (args) => {
          if (!args?.institution) {
            // valeur par défaut si rien n’est passé
            return `/dashboard/iba/sales`;
          }

          const { institution, startDate, endDate, customerId } = args;

          const params = new URLSearchParams();
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
          if (customerId) params.append("customerId", customerId);

          return `/dashboard/${institution}/sales?${params.toString()}`;
        },
        providesTags: ["DashboardSales"],
      }),
        
// ============================================================================
// RAPPORTS ENDPOINTS
// Auteur : Azambou Yvana
// Description : Gestion des rapport de chaque employés (création, consultation, consultation par staff, suppression)
// ============================================================================
        createReport: build.mutation<Report, { institution: string; prospectName: string;
  date: Date; userId?: number; responsable?: string; email?: string; degree: string; rdvObject: string; nextRdv: Date; time: string; contact: string;
  address: string; pharmacoVigilance: string}>({
            query: ({ institution, ...data }) => ({
              url: `/report/${institution}/`,
              method: "POST",
              body: data,
            }),
            invalidatesTags: ["Reports"],
        }), 
        getReportById: build.query<Report, number>({
          query: (id) => `/report/${id}`, // Construire l'URL avec l'ID de l'utilisateur
          providesTags: (result, error, id) => [{ type: "Reports", id }], // Associer un tag pour l'invalidation
        }),
        getReport: build.query<Report[], { institution: string, startDate?: string; endDate?: string }>({
          query: ({institution, startDate, endDate}) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
        
            return `/report/${institution}/all?${params.toString()}`;
          },
          providesTags: ['Reports']
        }),

        getReportByStaff: build.query<Report[], { startDate?: string; endDate?: string }>({
          query: ({startDate, endDate}) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
        
            return `/report/staff?${params.toString()}`;
          },
          providesTags: ['Reports']
        }),
        deleteReport: build.mutation<void, number>({
          query: (id) => ({
            url: `/report/${id}`, 
            method: "DELETE",
          }),
          invalidatesTags: (result, error, id ) => [{ type: "Reports", id }],
        }),

// ============================================================================
// PROMOTIONS ENDPOINTS
// Auteur : Azambou Yvana
// Description : Gestion des promotions (création, consultation, mise à jour, suppression)
// ============================================================================
        createPromotions: build.mutation<Promotion, { institution: string; title?: string;
  discount: number; startDate: Date; endDate: Date; status: boolean; creatorId?: number; productId: string;}>({
            query: ({ institution, ...data }) => ({
              url: `/promotions/${institution}/`,
              method: "POST",
              body: data,
            }),
            invalidatesTags: ["Promotions"],
        }), 

        /* Récupère la liste des promotions actives (statut=true) avec possibilité de recherche */
        getActivePromotions: build.query<Promotion[], { institution: string; search?: string }>({
            query: ({ institution, search }) => ({
                url: `/promotions/${institution}/active`,
                params: search ? { search } : {}
            }),
            providesTags: ["Promotions"]
        }),

        /* Met à jour uniquement le statut (activation/désactivation) d'une promotion */
        updatePromotionStatus: build.mutation<Promotion, { id: string; status: boolean; }>({
          query: ({ id, status }) => ({
            url: `/promotions/${id}/status`,
            method: 'PATCH',
            body: { status }
          }),
         invalidatesTags: (result, error, { id }) => [{ type: 'Promotions', id }]
        }),
        getAllPromotions: build.query<Promotion[], { institution: string; search?: string }>({
            query: ({ institution, search }) => ({
                url: `/promotions/${institution}/promo`,
                params: search ? { search } : {}
            }),
            providesTags: ["Promotions"]
        }),

        /* Récupère les détails d'une promotion spécifique par son ID */
        getPromotionsById: build.query<Promotion, string>({
          query: (id) => `/promotions/${id}`, // Construire l'URL avec l'ID de l'utilisateur
          providesTags: (result, error, id) => [{ type: "Promotions", id }], // Associer un tag pour l'invalidation
        }),

        /* Met à jour complètement les informations d'une promotion */
        updatePromotions: build.mutation<Promotion, { id: string; title: string; discount: number; startDate: Date; endDate: Date; creatorId?: number; productId: string}>({
            query: ({ id, ...data }) => ({
              url: `/promotions/${id}/update`,
              method: "PUT",
              body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Promotions' }],
        }),
        deletePromotions: build.mutation<void, string>({
            query: (id) => ({
              url: `/promotions/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: (result, error, id ) => [{ type: "Promotions", id }]
        }),


// ============================================================================
// PRODUCTS ENDPOINTS  
// Auteur : Azambou Yvana 
// Description : Gestion du catalogue produits (CRUD complet + import massif)
// ============================================================================

/* Récupère la liste des produits avec recherche par designation ou categorie */

        getProducts: build.query<Product[], { institution: string; search?: string }>({
            query: ({ institution, search }) => ({
                url: `/institutions/${institution}/products`,
                params: search ? { search } : {}
            }),
            providesTags: ["Products"]
        }),
        createProduct: build.mutation<Product, { data: NewProduct; institution: string }>({
            query: ({ data, institution }) => ({
              url: `/institutions/${institution}/products`,
              method: "POST",
              body: data,
            }),
            invalidatesTags: ["Products"],
        }), 
        getProductById: build.query<Product, string>({
          query: (id) => `/institutions/${id}`, // Construire l'URL avec l'ID de l'utilisateur
          providesTags: (result, error, id) => [{ type: "Products", id }], // Associer un tag pour l'invalidation
        }),

        deleteProduct: build.mutation<void, string>({
            query: (id) => ({
              url: `/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: (result, error, id ) => [{ type: "Products", id }]
        }),

        /* Met à jour les informations d'un produit existant */
        updateProduct: build.mutation<Product, { id: string; EANCode: string; quantity: number; brand: string; designation: string;
  sellingPriceTTC: number; purchase_price: number; restockingThreshold: number; warehouse: string;}>({
            query: ({ id, ...data }) => ({
              url: `/${id}`,
              method: "PUT",
              body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Products' }],
        }),
         
/* Import massif de produits via fichier Excel */
        importProducts: build.mutation<void, { data: NewProduct[]; institution: string }>({
          query: ({ data, institution }) => ({
            url: `/institutions/${institution}/products/import`,
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["Products"],
        }),

// ============================================================================
// INVENTORY ENDPOINTS
// Auteur : Azambou Yvana 
// Description : Gestion des inventaires (comptages de stock)
// ============================================================================
        createInventory: build.mutation<Inventory, { 
          titre: string;
          location: string;
          performedById: number;
          inventoryItems: Array<{
          productId: string;
          systemQty: number;
          countedQty: number;
          comment?: string;
          }>;
          note?: string;
          institution: string;
         }>({
          query: ({ institution, ...data }) => ({
              url: `/inventory/${institution}/inventory`,
              method: 'POST',
              body: data
          }),
          invalidatesTags: ['Inventorys', 'Products']
        }),

        getInventory: build.query<Inventory[], { institution: string; search?: string }>({
          query: ({ institution, search }) => ({
              url: `/inventory/${institution}/all`,
              params: search ? { search } : {}
          }),
          providesTags: ["Inventorys"]
        }),

        getInventoryId: build.query<Inventory, string>({
          query: (id) => `/inventory/${id}`,
          providesTags: (result, error, id) => [{ type: 'Inventorys', id }]
        }),

        updateInventory: build.mutation<Inventory, {
          id: string;
          institution: string;
          titre: string;
          location: string;
          performedById: number;
          note?: string;
          inventoryItems: Array<{
            productId: string;
            systemQty: number;
            countedQty: number;
            comment?: string;
          }>;
        }>({
          query: ({ institution, id, ...data }) => ({
            url: `/inventory/${institution}/inventory/${id}`,
            method: "PUT",
            body: data
          }),
          invalidatesTags: ['Inventorys', 'Products']
        }),
        

        deleteInventory: build.mutation<void, string>({
          query: (id) => ({
            url: `/inventory/${id}`, 
            method: "DELETE",
          }),
          invalidatesTags: (result, error, id ) => [{ type: "Inventorys", id }],
        }),

// ============================================================================
// SALES PROMISE ENDPOINTS
// Auteur : Azambou yvana
// Description : Gestion des promesses de vente (pré-commandes)
// ============================================================================
        
/* Crée une nouvelle promesse de vente (pré-commande) */
       createSalePromise: build.mutation<salePromise, { 
          customerId?: number;
          userId?: number;
          customerCreatorId?: number;
          items: Array<{
          product_id: string;
          product_quantity: number;
          product_sale_price: number;
          }>;
          discount?: number;
          dueDate: Date;
          reminderDate: Date;
          note?: string;
          customer_address?: string;
          customer_name?: string;
          customer_phone?: string;
          institution: string;
         }>({
          query: ({ institution, ...data }) => ({
              url: `/salepromise/${institution}/promiseSale`,
              method: 'POST',
              body: data
          }),
          invalidatesTags: ['SalePromise', 'Products']
        }),

/* Récupère les promesses de vente par institution avec filtrage par période */
        getSalePromise: build.query<salePromise[], { institution: string, startDate?: string; endDate?: string }>({
          query: ({institution, startDate, endDate}) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
        
            return `/salepromise/${institution}/all?${params.toString()}`;
          },
          providesTags: ['SalePromise']
        }),

        /* Récupère les promesses de vente d'un client connecté avec filtrage par période */
        getSalePromiseByCustomer: build.query<salePromise[], { startDate?: string; endDate?: string }>({
          query: ({startDate, endDate}) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
        
            return `/salepromise/customer?${params.toString()}`;
          },
          providesTags: ['SalePromise']
        }),

        // getSalePromiseByCustomer: build.query<salePromise[], { search?: string }>({
        //     query: ({ search }) => ({
        //         url: `/salepromise/customer`,
        //         params: search ? { search } : {}
        //     }),
        //     providesTags: ["SalePromise"]
        // }),

        getSalePromiseById: build.query<salePromise, number>({
          query: (id) => `/salepromise/${id}`,
          providesTags: (result, error, id) => [{ type: 'SalePromise', id }]
        }),

        deleteSalePromise: build.mutation<void, number>({
        query: (id) => ({
          url: `/salepromise/${id}`, 
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id ) => [{ type: "SalePromise", id }, "Products"],
      }),

        // ============================================================================
// SALES ENDPOINTS
// Auteur : Azambou Yvana
// Description : Gestion complète des ventes et factures
// ============================================================================

        
      /* Crée une nouvelle vente/facture avec gestion des lignes de produits */
        createSale: build.mutation<SaleInvoice, { 
          customerId: number;
          userId?: number;
          customerCreatorId?: number;
          items: Array<{
          productId: string;
          quantity: number;
          unitPrice: number;
          }>;
          discount?: number;
          paymentMethod?: string;
          salePromiseId?: number;
          institution: string;
         }>({
          query: ({ institution, ...data }) => ({
              url: `/sale/${institution}/sale`,
              method: 'POST',
              body: data
          }),
          invalidatesTags: ['DashboardSales','Sales', 'Products', 'SalePromise']
        }),

        /* Vérifie si un client a des dettes en cours (statut de solde) */
        getCustomerDebtStatus: build.query<{ hasDebt: boolean}, {customerId: number, institution: string}>({
          query: ({customerId, institution}) => `/sale/${institution}/${customerId}/debt-status`,
        }),        

        /* Récupère l'historique des ventes avec filtrage par période */
        getSales: build.query<SaleInvoice[], { institution: string, startDate?: string; endDate?: string }>({
          query: ({institution, startDate, endDate}) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
        
            return `/sale/${institution}/sale?${params.toString()}`;
          },
          providesTags: ['Sales']
        }),

        /* Récupère les détails complets d'une vente spécifique par son ID */
        getSaleById: build.query<SaleInvoice, string>({
          query: (id) => `/sale/${id}`,
          providesTags: (result, error, id) => [{ type: 'Sales', id },{ type: 'DashboardSales' }]
        }),

        /* Met à jour le statut de préparation/livraison d'une vente */
       updateSaleStatus: build.mutation<SaleInvoice, {
         id: string;
         ready?: boolean;
         delivred?: boolean;
         institution: string;
       }>({
        query: ({ id, institution, ...status }) => ({
           url: `/sale/${institution}/sale/${id}/status`,
           method: 'PATCH',
           body: status
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Sales', id},{ type: 'DashboardSales' }] ,
       }),

       /* Gère le paiement d'une vente (méthode, montant, solde) */
       updateSalePayment: build.mutation<SaleInvoice, { id: string; paymentMethod: string; paidAmount: number; dueAmount:number; discount?:number }>({
        query: ({ id, paymentMethod, paidAmount, dueAmount, discount }) => ({
          url: `/sale/${id}/payment`,
          method: 'PATCH',
          body: { paymentMethod, paidAmount, dueAmount, discount }
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Sales', id }]
      }),
      
      /* Supprime une facture et restaure les stocks associés */
       deleteSaleInvoice: build.mutation<void, string>({
        query: (id) => ({
          url: `/sale/${id}`, 
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id ) => [{ type: "Sales", id }, "Products"],
      }),
      
       // ============================================================================
// CLAIMS ENDPOINTS (RÉCLAMATIONS)
// Auteur : Azambou Yvana
// Description : Gestion des réclamations clients sur les ventes
// ============================================================================

       /* Crée une nouvelle réclamation pour un produit vendu */
       createClaim: build.mutation<Claim, { institution: string; invoiceId: string; productId: string; quantity: number; unitPrice: number; reason: string; description?: string }>({
        query: ({ institution, ...data }) => ({
          url: `/claim/${institution}/claims`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Sales", "Claims"],
      }),

      /* Répond à une réclamation (acceptation/rejet) */
      respondToClaim: build.mutation<ClaimResponse, {
        institution: string;
        claimId: string;
        status: 'ACCEPTED' | 'REJECTED';
        description?: string;
      }>({
        query: ({ institution, claimId, ...data }) => ({
          url: `/claim/${institution}/claims/${claimId}/response`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: (result, error, { claimId }) => [{ type: 'Claims', id: claimId }],
      }),

       /* Modifie une réponse existante à une réclamation */
      updateClaimResponse: build.mutation<ClaimResponse, {
        responseId: string;
        status: 'ACCEPTED' | 'REJECTED';
        description?: string;
      }>({
        query: ({ responseId, ...data }) => ({
          url: `/claim/response/${responseId}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { responseId }) => [{ type: 'Claims' }], // tu peux affiner ici selon le contexte
      }),
      
      /* Récupère toutes les réclamations avec filtrage par période */
      getClaim: build.query<Claim[], { institution: string, startDate?: string; endDate?: string }>({
        query: ({institution, startDate, endDate}) => {
          const params = new URLSearchParams();
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
      
          return `/claim/${institution}/claims?${params.toString()}`;
        },
        //providesTags: ['Claims']
        providesTags: (result) =>
            result
              ? [...result.map(({ id }) => ({ type: 'Claims' as const, id })), { type: 'Claims', id: 'LIST' }]
              : [{ type: 'Claims', id: 'LIST' }],
      }),

      /* Récupère uniquement les réclamations en attente de traitement */
      getClaimPending: build.query<Claim[], { institution: string }>({  
            query: ({ institution }) => ({
                url: `/claim/${institution}/pendingClaim`,
                //params: search ? { search } : {}
            }),
            providesTags: ["Claims"]
      }), 
          
      /* Récupère les détails d'une réclamation spécifique */
      getClaimById: build.query<Claim, string>({
        query: (id) => `/claim/${id}`,
        providesTags: (result, error, id) => [{ type: 'Claims', id }]
      }),

      /* Supprime une réclamation et ses réponses associées */
      deleteClaim: build.mutation<void, string>({
        query: (id) => ({
          url: `/claim/${id}`, 
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id ) => [{ type: "Claims", id }],
      }),

// ============================================================================
// DEPARTMENTS ENDPOINTS (DÉPARTEMENTS)
// Auteur : Azambou Yvana
// Description : Gestion des départements/organisation interne
// ============================================================================

          getDepartments: build.query<{ id: number; name: string }[], void>({
            query: () => "/department",
            providesTags: (result) =>
            result
              ? [...result.map(({ id }) => ({ type: 'Departments' as const, id })), { type: 'Departments', id: 'LIST' }]
              : [{ type: 'Departments', id: 'LIST' }],
            }),
          createDepartments: build.mutation<Department, { name: string }>({
            query: (data) => ({
              url: "/department",
              method: "POST",
              body: data,
            }),
            invalidatesTags: ["Departments"],
           }),
           deleteDepartments: build.mutation<void, string>({
            query: (id) => ({
              url: `/department/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Departments', id: 'LIST' }],
          }),


// ============================================================================
// DESIGNATIONS ENDPOINTS (POSTES/FONCTIONS)
// Auteur : Azambou Yvana
// Description : Gestion des postes et fonctions des employés
// ============================================================================
          getDesignations: build.query<{ id: number; name: string }[], void>({
            query: () => "/designation",
            providesTags: ["Designations"],
          }),
          createDesignations: build.mutation<Designation, NewDesignation>({
            query: (NewDesignation) => ({
              url: "/designation",
              method: "POST",
              body: NewDesignation,
            }),
            invalidatesTags: ["Designations"],
           }),
           deleteDesignation: build.mutation<void, string>({
            query: (id) => ({
              url: `/designation/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Designations', id }],
          }),

// ============================================================================
// ROLES ENDPOINTS (RÔLES UTILISATEURS)
// Auteur : Azambou Yvana
// Description : Gestion des rôles et permissions système
// ============================================================================

/* Récupère tous les rôles disponibles dans le système */
          getRoles: build.query<{ id: number; name: string }[], void>({
            query: () => "/role?query=all",
            providesTags: ["Roles"],
          }),

/* Crée un nouveau rôle et ses permissions sont attribués plus tard dans le fichier role/[id]/page.tsx 
les endpoint d'affectation des permissions aux roles sont defini */
          createRoles: build.mutation<Role, NewRole>({
            query: (NewRole) => ({
              url: "/role",
              method: "POST",
              body: NewRole,
            }),
            invalidatesTags: ["Roles"],
           }),
           deleteRole: build.mutation<void, string>({
            query: (id) => ({
              url: `/role/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ["Roles"],
          }),

// ============================================================================
// USERS ENDPOINTS (UTILISATEURS)
// Auteur : Azambou Yvana
// Description : Gestion complète des utilisateurs de l'application
// ============================================================================

/* Récupère la liste des utilisateurs */
          getUsers: build.query<User[], string | void>({            
            query: (search) => ({
                url: "/user",
                params: search ? { search } : {}
            }),            
            providesTags: ["Users"]
          }),

           /* Récupère le profil détaillé d'un utilisateur spécifique */
          getUserById: build.query<User, string>({
            query: (id) => `/user/${id}`, 
            providesTags: (result, error, id) => [{ type: "Users", id }], // Associer un tag pour l'invalidation
          }),

          /* Désactive/supprime un compte utilisateur */
          deleteUser: build.mutation<void, string>({
            query: (id) => ({
              url: `/user/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
          }),

          /* Met à jour les informations d'un utilisateur (profil,etc.) */
          updateUser: build.mutation<User, { id: number; data: Partial<User> }>({
            query: ({ id, data }) => ({
              url: `/user/${id}`,
              method: "PUT",
              body: data,
            }),
            invalidatesTags: ["Users"],
          }),

// ============================================================================
// CUSTOMERS ENDPOINTS (CLIENTS)
// Auteur : Azambou Yvana
// Description : Gestion de la base clients et opérations associées
// ============================================================================
          getCustomers: build.query<Customer[], { institution?: string }>({            
            query: ({ institution }) => ({
                url: `/customer/${institution}`,
               
            }),
            providesTags: (result) =>
            result
              ? [...result.map(({ id }) => ({ type: 'Customers' as const, id })), { type: 'Customers', id: 'LIST' }]
    : [{ type: 'Customers', id: 'LIST' }],
            
          }),
          createCustomers: build.mutation<Customer, { newCustomer: NewCustomer; institution: string }>({
              query: ({ newCustomer, institution }) => ({
                url: `/customer/${institution}`,
                method: "POST",
                body: newCustomer,
              }),
              invalidatesTags: ["Customers"],
          }),
           
           /* Récupère le profil client avec historique des commandess sur période */
           getCustomerById: build.query<Customer, { id: string; startDate?: string; endDate?: string }>({
            query: ({ id, startDate, endDate }) => {
              const params = new URLSearchParams();
              if (startDate) params.append("startDate", startDate);
              if (endDate) params.append("endDate", endDate);
      
              return `/customer/${id}?${params.toString()}`;
            },
            providesTags: (result, error, { id }) => [{ type: "Customers", id }],
          }),
      

          deleteCustomer: build.mutation<void, string>({
            query: (id) => ({
              url: `/customer/${id}`,
              method: 'DELETE',
            }),
             invalidatesTags: (result, error, id) => [{ type: 'Customers', id }],
          }),

          /* Envoie un email de réinitialisation de mot de passe au client */
          sendTokenResetPassword: build.mutation<Customer, { email: string, institution: string }>({
            query: ({ email, institution }) => ({
              url: `/customer/${institution}/sendTokenResetPassword`,
              method: 'POST',
              body: { email },
            }),
          }),
          
          /* Réinitialise le mot de passe client avec token de validation */
          resetPassword: build.mutation<Customer, { token: string; newPassword: string; institution: string }>({
            query: ({ token, newPassword, institution }) => ({
              url: `/customer/${institution}/resetPassword`,
              method: 'POST',
              body: { token, newPassword },
              headers: {
                "Content-Type": "application/json", // ✅ Important
              },
            }),
          }),

          /* Met à jour les informations d'un client existant */
          updateCustomer: build.mutation<Customer, { id: number; data: Partial<Customer> }>({
            query: ({ id, data }) => ({
              url: `/Customer/${id}`,
              method: "PUT",
              body: data,
            }),
            invalidatesTags: ["Customers"],
          }),
          

// ============================================================================
// SETTINGS ENDPOINTS (PARAMÈTRES DE L'ENTRPRISE<ASERMPHARMA/IBA>: nom, e-mail, slogan, adresse 
// à inserer lors de l'impression des factures ou autre documents)
// Auteur : Azambou Yvana
// Description : Gestion des paramètres de configuration par institution
// ============================================================================
          getSettings: build.query<AppSetting[], { institution: string }>({
            query: ({ institution }) => ({
                url: `/setting/${institution}`,
            }),
            providesTags: ["AppSettings"]
          }),
          updateSettings: build.mutation<AppSetting, { id: number; data: Partial<AppSetting> }>({
            query: ({ id, data }) => ({
              url: `/setting/${id}`,
              method: "PUT",
              body: data,
            }),
            invalidatesTags: ["AppSettings"],
          }),

// ============================================================================
// NOTIFICATIONS ENDPOINTS
// Auteur : Azambou Yvana
// Description : Gestion des notifications et alertes système
// ============================================================================

          
          getAllNotifications: build.query<Notification[], { institution: string }>({  
            query: ({ institution }) => ({
                url: `/notification/${institution}/all`,
                //params: search ? { search } : {}
            }),
            providesTags: ["Notifications"]
          }), 
          
          /* Récupère les notifications spécifiques au client connecté */
          getCustomerNotifications: build.query<Notification[], string | void>({  
            query: (search) => ({
                url: `/notification/customer`,
                params: search ? { search } : {}
            }),
            providesTags: ["Notifications"]
          }), 
          
          /* Supprime une notification (marquer comme lue)  pas utiliser*/
          deleteNotifications: build.mutation<void, string>({
            query: (id) => ({
              url: `/notification/${id}`, 
              method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Notifications', id }],
          }),
      
    }),
});


export const { useGetDashboardMetricsQuery,useGetDashboardSalesQuery, useCreateReportMutation, useGetReportByIdQuery, useGetReportQuery, useGetReportByStaffQuery, useDeleteReportMutation,
  useCreatePromotionsMutation, useGetActivePromotionsQuery, useUpdatePromotionStatusMutation, useGetAllPromotionsQuery, useGetPromotionsByIdQuery, useUpdatePromotionsMutation, useDeletePromotionsMutation, 
  useGetProductsQuery, useCreateProductMutation, useGetProductByIdQuery, useDeleteProductMutation,useUpdateProductMutation, useImportProductsMutation,
  useCreateInventoryMutation, useGetInventoryQuery, useGetInventoryIdQuery, useUpdateInventoryMutation, useDeleteInventoryMutation, useCreateSaleMutation, useGetCustomerDebtStatusQuery, 
  useCreateSalePromiseMutation, useGetSalePromiseQuery, useGetSalesQuery, useGetSalePromiseByIdQuery, useDeleteSalePromiseMutation, useGetSalePromiseByCustomerQuery,
    useGetSaleByIdQuery,useUpdateSaleStatusMutation, useUpdateSalePaymentMutation, useDeleteSaleInvoiceMutation, useCreateClaimMutation, 
    useRespondToClaimMutation, useUpdateClaimResponseMutation, useGetClaimQuery, useGetClaimPendingQuery, useGetClaimByIdQuery, useDeleteClaimMutation, useGetDepartmentsQuery, 
    useCreateDepartmentsMutation, useDeleteDepartmentsMutation,
    useGetDesignationsQuery, useCreateDesignationsMutation, useDeleteDesignationMutation,useGetRolesQuery, useCreateRolesMutation, 
    useDeleteRoleMutation, useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation,  useGetCustomersQuery, useCreateCustomersMutation,
    useGetCustomerByIdQuery, useDeleteCustomerMutation,useUpdateCustomerMutation, useSendTokenResetPasswordMutation, useResetPasswordMutation, 
    useGetSettingsQuery, useUpdateSettingsMutation, useGetAllNotificationsQuery, useGetCustomerNotificationsQuery, useDeleteNotificationsMutation} = api;

