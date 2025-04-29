"use client"

import Image from "next/image"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { useGetProductsQuery } from "@/state/api"


const ProductPage = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery()

  if (isLoading) return <p>Chargement...</p>
  if (isError) return <p>Erreur lors du chargement.</p>

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hey! 👋🏽</h2>
          <p className="text-muted-foreground">
            Ici vous trouverez la liste de tous les produits enregistrés !
          </p>
        </div>
      </div>
      <DataTable data={products || []} columns={columns} />
    </div>
  )
}

export default ProductPage;


