<<<<<<< HEAD
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
    id: string; 
    EANCode: string;  
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
    EANCode: string;  
    quantity: number;       
    brand: string;
    designation: string;
    sellingPriceTTC: number;
    purchase_price: number;
    restockingThreshold: number;
    warehouse: string;
}
export interface DashboardMetrics {
    popularProducts: Product[];
}
export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
    reducerPath: "api",
    tagTypes: ["DashboardMetrics", "Products"],
    endpoints: (build) => ({
        getDashboardMetrics: build.query<DashboardMetrics, void>({
            query: () => "/dashboard",
            providesTags: ["DashboardMetrics"]
        }),
        getProducts: build.query<Product[], { institution: string; search?: string }>({
            query: ({ institution, search }) => ({
                url: `/institutions/${institution}/products`,
                params: search ? { search } : {},
            }),
            providesTags: ["Products"],
        }),

        createProduct: build.mutation<Product, { data: NewProduct; institution: string }>({
            query: ({ data, institution }) => ({
                url: `/institutions/${institution}/products`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Products"],
        }),
 
    }),
});

export const { useGetDashboardMetricsQuery, useGetProductsQuery, useCreateProductMutation } = api;
=======
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  website: string;
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
  website: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string; 
}

export interface DashboardMetrics {
    popularProducts: Product[];
    popularUsers: User[];
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
    tagTypes: ["DashboardMetrics", "Products", "Users", "Designations", "Roles"],
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
           }),
          
          
    }),
});

export const { useGetDashboardMetricsQuery, useGetProductsQuery, useCreateProductMutation, useGetDepartmentsQuery,
    useGetDesignationsQuery, useCreateDesignationsMutation, useDeleteDesignationMutation,useGetRolesQuery, useCreateRolesMutation, 
    useDeleteRoleMutation, useGetUsersQuery, useGetUserByIdQuery, useDeleteUserMutation,  useGetCustomersQuery, useCreateCustomersMutation,} = api;
>>>>>>> origin/yvana
