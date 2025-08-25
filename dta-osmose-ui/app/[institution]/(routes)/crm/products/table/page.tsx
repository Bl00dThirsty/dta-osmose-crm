"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { columns } from "@/app/[institution]/(routes)/crm/products/table/components/columns"
import { DataTable } from "@/app/[institution]/(routes)/crm/products/table/components/data-table"
import { Product } from "@/state/api"
import { useParams } from "next/navigation"

export default function ProductsTable() {
  const { institution } = useParams() as { institution: string }


  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!institution) return;
    
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:5003/institutions/${institution}/products`)
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Erreur de chargement des produits :", error)
      } finally {
        setLoading(false)
      }
    }

    if (institution) {
      fetchProducts()
    }
  }, [institution])

  if (loading) return <div>Chargement des produits...</div>

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={products} />
    </div>
  )
}
