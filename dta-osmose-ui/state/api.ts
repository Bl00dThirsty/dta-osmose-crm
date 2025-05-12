import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
    id: string; 
    name: string;  
    quantity: number;       
    signature: string;
    gtsPrice: number;
    sellingPriceHT: number;
    sellingPriceTTC: number;
    purchase_price: number;
    label: string;
    status?: boolean;
    collisage: number;
}

export interface NewProduct {
    name: string;  
    quantity: number;       
    signature: string;
    gtsPrice: number;
    sellingPriceHT: number;
    sellingPriceTTC: number;
    purchase_price: number;
    label: string;
    status?: boolean;
    collisage: number;
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
        getProducts: build.query<Product[], string | void>({
            query: (search) => ({
                url: "/products",
                params: search ? { search } : {}
            }),
            providesTags: ["Products"]
        }),
        createProduct: build.mutation<Product, NewProduct>({
            query: (newProduct) => ({
              url: "/products",
              method: "POST",
              body: newProduct,
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
           getRoleById: build.query<Role, string>({
            query: (id) => `/role/${id}`, // Construire l'URL avec l'ID de l'utilisateur
            providesTags: (result, error, id) => [{ type: "Roles", id }], // Associer un tag pour l'invalidation
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
          
          
    }),
});

export const { useGetDashboardMetricsQuery, useGetProductsQuery, useCreateProductMutation, useGetDepartmentsQuery,
    useGetDesignationsQuery, useCreateDesignationsMutation, useDeleteDesignationMutation,
    useGetRolesQuery, useCreateRolesMutation, useGetRoleByIdQuery, useDeleteRoleMutation, useGetUsersQuery, useGetUserByIdQuery, useDeleteUserMutation} = api;