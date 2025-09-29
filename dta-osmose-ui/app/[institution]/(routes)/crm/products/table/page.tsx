"use client"

import { useEffect, useState } from "react"
import { columns } from "@/app/[institution]/(routes)/crm/products/table/components/columns"
import { DataTable } from "@/app/[institution]/(routes)/crm/products/table/components/data-table"
import { Product } from "@/state/api"
import { useParams } from "next/navigation"

export default function ProductsTable() {
  const { institution } = useParams() as { institution: string }

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!institution) return
    
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("accessToken")
        const res = await fetch(`http://localhost:8000/institutions/${institution}/products`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error(`Erreur serveur : ${res.status}`)
        }

        const data = await res.json()
        setProducts(data)
      } catch (err: any) {
        console.error("Erreur de chargement des produits :", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [institution])

  if (loading) return <div>Chargement des produits...</div>
  if (error) return <div className="text-red-500">Erreur : {error}</div>

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={products} />
    </div>
  )
}
