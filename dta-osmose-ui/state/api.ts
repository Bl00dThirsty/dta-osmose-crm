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