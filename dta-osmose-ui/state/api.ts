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

export interface Customer { 
  id:number;
  customId: string;
  name: string;
  phone: string;
  nameresponsable?: string;
  email: string;
  ville?: string;
  website?: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string; 
}

export interface NewCustomer {
  customId: string;
  name: string;
  phone: string;
  nameresponsable?: string;
  email: string;
  ville?: string;
  website?: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string; 

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
  id?: string;     
  invoiceNumber?:   string ;     
  customerId :     number;
  userId:          number;
  institutionId?:   String;
  totalAmount :    number;
  discount:        number;
  finalAmount?:     number;
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
    name: string;
    phone: string;
    email: string;
    type_customer?: string;
    ville?: string;

  }
   
}

export interface NewSaleInvoice{      
  invoiceNumber?:   string ;     
  customerId? :     number;
  userId:          number;
  institutionId?:   String;
  totalAmount :    number;
  discount:        number;
  finalAmount:     number;
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
    name: string;
    phone: string;
    email: string;
    type_customer?: string;
    ville?: string;
  }
   
}

export interface DashboardMetrics {
    popularProducts: Product[];
    salesByCity: Array<{
      ville: string;
      montant: number;
      nombreVentes: number;
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
    tagTypes: ["DashboardMetrics", "Products", "Users", "Designations", "Roles", "Customers", "Sales"],
    endpoints: (build) => ({
        getDashboardMetrics: build.query<DashboardMetrics, void>({
            query: () => "/dashboard",
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
          userId: number;
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

        getSales: build.query<SaleInvoice[], { institution: string }>({
          query: ({institution}) => `/sale/${institution}/sale`,
          providesTags: ['Sales']
        }),

        getSaleById: build.query<SaleInvoice, string>({
          query: (id) => `/sale/${id}`,
          providesTags: (result, error, id) => [{ type: 'Sales', id }]
        }),

        // Dans api.ts
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
            query: (id) => `/user/${id}`, // Construire l'URL avec l'ID de l'utilisateur
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
           getCustomerById: build.query<Customer, string>({
            query: (id) => `/customer/${id}`, // Construire l'URL avec l'ID de l'utilisateur
            providesTags: (result, error, id) => [{ type: "Customers", id }], // Associer un tag pour l'invalidation
          }),
          deleteCustomer: build.mutation<void, string>({
            query: (id) => ({
              url: `/customer/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ["Customers"],
          }),


          
          
    }),
});

export const { useGetDashboardMetricsQuery, useGetProductsQuery, useCreateProductMutation, useGetProductByIdQuery, useCreateSaleMutation, useGetSalesQuery,
    useGetSaleByIdQuery,useUpdateSaleStatusMutation, useGetDepartmentsQuery,
    useGetDesignationsQuery, useCreateDesignationsMutation, useDeleteDesignationMutation,useGetRolesQuery, useCreateRolesMutation, 
    useDeleteRoleMutation, useGetUsersQuery, useGetUserByIdQuery, useDeleteUserMutation,  useGetCustomersQuery, useCreateCustomersMutation,
    useGetCustomerByIdQuery, useDeleteCustomerMutation} = api;