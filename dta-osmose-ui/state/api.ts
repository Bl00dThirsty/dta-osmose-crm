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
  restockingThreshold: number;
  warehouse: string;
}

export interface NewProduct {
  id?: string; 
  EANCode?: string;  
  quantity: number;       
  brand: string;
  designation: string;
  sellingPriceTTC: number;
  purchase_price: number;
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
  phone: string;
  nameresponsable?: string;
  email: string;
  password: string;
  ville?: string;
  website?: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string; 
  saleInvoice?: SaleInvoice[];
  credits?: Credit[];
}

export interface NewCustomer {
  customId: string;
  name: string;
  userName: string;
  phone: string;
  nameresponsable?: string;
  email: string;
  password: string;
  ville?: string;
  website?: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string; 
  saleInvoice?: SaleInvoice[];
  credits?: Credit[];
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

export interface DashboardMetrics {
    popularProducts: Product[];
    salesByCity: Array<{
      ville: string;
      montant: number;
      nombreVentes: number;
    }>;
    saleProfitCount: Array<{
      type: string; // "Ventes" | "Profits" | "nombre de facture"
      date: string;
      amount: number;
    }>;
    totalUsers: User[];
    totalAvailableCredit: Array<{
      amount: number;
      usedAmount: number
    }>
    formattedData3: Array<{
      type: string; // "Ventes" | "Profits" | "nombre de facture"
      date: string;
      amount: number;
    }>;
    customerStats?: {
      totalAchats: number;
      nombreCommandes: number;
      avoirDisponible: number;
      nombreCommandesImpaye: number;
    };
    
    
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
    tagTypes: ["DashboardMetrics", "Products", "Users", "Designations", "Roles", "Customers", "Sales", "AppSettings", "Claims"],
    endpoints: (build) => ({
        getDashboardMetrics: build.query<DashboardMetrics, { institution: string, startDate?: string; endDate?: string  }>({
            query: ({ institution, startDate, endDate }) => {
              const params = new URLSearchParams();
              if (startDate) params.append("startDate", startDate);
              if (endDate) params.append("endDate", endDate);
          
              return `/dashboard/${institution}?${params.toString()}`;
            },
            providesTags: ["DashboardMetrics"]
        }),
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

        // Sales
        
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
          institution: string;
         }>({
          query: ({ institution, ...data }) => ({
              url: `/sale/${institution}/sale`,
              method: 'POST',
              body: data
          }),
          invalidatesTags: ['Sales', 'Products']
        }),

        getCustomerDebtStatus: build.query<{ hasDebt: boolean }, number>({
          query: (customerId) => `/sale/${customerId}/debt-status`,
        }),        

        getSales: build.query<SaleInvoice[], { institution: string, startDate?: string; endDate?: string }>({
          query: ({institution, startDate, endDate}) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
        
            return `/sale/${institution}/sale?${params.toString()}`;
          },
          providesTags: ['Sales']
        }),

        getSaleById: build.query<SaleInvoice, string>({
          query: (id) => `/sale/${id}`,
          providesTags: (result, error, id) => [{ type: 'Sales', id }]
        }),

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
        invalidatesTags: (result, error, { id }) => [{ type: 'Sales', id }]
       }),

       updateSalePayment: build.mutation<SaleInvoice, { id: string; paymentMethod: string; paidAmount: number; dueAmount:number; discount?:number }>({
        query: ({ id, paymentMethod, paidAmount, dueAmount, discount }) => ({
          url: `/sale/${id}/payment`,
          method: 'PATCH',
          body: { paymentMethod, paidAmount, dueAmount, discount }
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Sales', id }]
      }),
      
       deleteSaleInvoice: build.mutation<void, string>({
        query: (id) => ({
          url: `/sale/${id}`, 
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id ) => [{ type: "Sales", id }, "Products"],
      }),
      
       //claims
       createClaim: build.mutation<Claim, { institution: string; invoiceId: string; productId: string; quantity: number; unitPrice: number; reason: string; description?: string }>({
        query: ({ institution, ...data }) => ({
          url: `/claim/${institution}/claims`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Sales", "Claims"],
      }),

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
      
      getClaim: build.query<Claim[], { institution: string, startDate?: string; endDate?: string }>({
        query: ({institution, startDate, endDate}) => {
          const params = new URLSearchParams();
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
      
          return `/claim/${institution}/claims?${params.toString()}`;
        },
        providesTags: ['Claims']
      }),

      getClaimById: build.query<Claim, string>({
        query: (id) => `/claim/${id}`,
        providesTags: (result, error, id) => [{ type: 'Claims', id }]
      }),

      deleteClaim: build.mutation<void, string>({
        query: (id) => ({
          url: `/claim/${id}`, 
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id ) => [{ type: "Claims", id }],
      }),
          getDepartments: build.query<{ id: number; name: string }[], void>({
            query: () => "/department",
          }),

          //Designation
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

          //role
          getRoles: build.query<{ id: number; name: string }[], void>({
            query: () => "/role?query=all",
            providesTags: ["Roles"],
          }),
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

          //Users
          getUsers: build.query<User[], string | void>({
            
            query: (search) => ({
                url: "/user",
                params: search ? { search } : {}
            }),
            
            providesTags: ["Users"]
          }),
          getUserById: build.query<User, string>({
            query: (id) => `/user/${id}`, 
            providesTags: (result, error, id) => [{ type: "Users", id }], // Associer un tag pour l'invalidation
          }),
          deleteUser: build.mutation<void, string>({
            query: (id) => ({
              url: `/user/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
          }),

          //customer
          getCustomers: build.query<Customer[], string | void>({            
            query: (search) => ({
                url: "/customer",
                params: search ? { search } : {}
            }),
            
          }),
          createCustomers: build.mutation<Customer, NewCustomer>({
            query: (NewCustomer) => ({
              url: "/customer",
              method: "POST",
              body: NewCustomer,
            }),
            invalidatesTags: ["Customers"],
           }),
           
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
            invalidatesTags: ["Customers"],
          }),

          //setting
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
          
      
    }),
});

export const { useGetDashboardMetricsQuery, useGetProductsQuery, useCreateProductMutation, useGetProductByIdQuery, useCreateSaleMutation, useGetCustomerDebtStatusQuery, useGetSalesQuery,
    useGetSaleByIdQuery,useUpdateSaleStatusMutation, useUpdateSalePaymentMutation, useDeleteSaleInvoiceMutation, useCreateClaimMutation, 
    useRespondToClaimMutation, useUpdateClaimResponseMutation, useGetClaimQuery, useGetClaimByIdQuery, useDeleteClaimMutation, useGetDepartmentsQuery,
    useGetDesignationsQuery, useCreateDesignationsMutation, useDeleteDesignationMutation,useGetRolesQuery, useCreateRolesMutation, 
    useDeleteRoleMutation, useGetUsersQuery, useGetUserByIdQuery, useDeleteUserMutation,  useGetCustomersQuery, useCreateCustomersMutation,
    useGetCustomerByIdQuery, useDeleteCustomerMutation, useGetSettingsQuery, useUpdateSettingsMutation} = api;
