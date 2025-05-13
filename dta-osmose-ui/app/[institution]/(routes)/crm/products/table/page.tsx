"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { columns } from "@/app/[institution]/(routes)/crm/products/table/components/columns"
import { DataTable } from "@/app/[institution]/(routes)/crm/products/table/components/data-table"
import { Product } from "@/state/api"

export default function ProductsTable() {
  const searchParams = useSearchParams()
  const institution = searchParams.get("institution") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:8000/products?institution=${institution}`)
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
