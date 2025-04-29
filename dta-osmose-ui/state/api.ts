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