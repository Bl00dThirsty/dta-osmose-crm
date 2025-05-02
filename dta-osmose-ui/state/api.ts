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
    }),
});

export const { useGetDashboardMetricsQuery, useGetProductsQuery, useCreateProductMutation } = api;