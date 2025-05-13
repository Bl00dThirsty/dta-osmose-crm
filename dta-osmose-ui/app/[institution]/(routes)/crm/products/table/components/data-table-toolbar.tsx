"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddProductDialog } from "../../../components/AddProductDialog"

import { useCreateProductMutation } from "@/state/api"
import { quantityLevel, statuses } from "../data/data"

type ProductFormData = {
  quantity: number
  EANCode?: string
  brand: string
  designation: string
  restockingThreshold: number
  warehouse: string
  sellingPriceTTC: number
  purchase_price: number
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { institution } = useParams() as { institution: string }

  const [createProduct] = useCreateProductMutation()
  const [file, setFile] = useState<File | null>(null)

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      await createProduct({ ...productData, institution }).unwrap()
    } catch (error) {
      console.error("Erreur lors de la création :", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
  }

  const handleUpload = () => {
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }: Papa.ParseResult<any>) => {
        for (const rawProduct of data) {
          try {
            await createProduct({
              quantity: Number(rawProduct.quantity) || 0,
              brand: rawProduct.brand,
              designation: rawProduct.designation,
              restockingThreshold: Number(rawProduct.restockingThreshold) || 0,
              sellingPriceTTC: Number(rawProduct.sellingPriceTTC) || 0,
              purchase_price: Number(rawProduct.purchase_price) || 0,
              warehouse: rawProduct.warehouse,
              institution,
            }).unwrap()
          } catch (error) {
            console.error("Erreur lors de l'import d'un produit :", error)
          }
        }

        alert("Produits importés avec succès.")
      },
      error: (err) => {
        console.error("Erreur de lecture CSV :", err)
      },
    })
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Rechercher un produit..."
          value={(table.getColumn("designation")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("designation")?.setFilterValue(e.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Statut"
            options={statuses}
          />
        )}

        {table.getColumn("quantity") && (
          <DataTableFacetedFilter
            column={table.getColumn("quantity")}
            title="Quantité"
            options={quantityLevel}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <AddProductDialog onCreate={handleCreateProduct} institution={institution} />

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="px-2 lg:px-3">
              <Upload className="mr-2 h-4 w-4" />
              Importer CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md space-y-4">
            <DialogHeader>
              <DialogTitle>Importer un fichier CSV</DialogTitle>
            </DialogHeader>
            <Input type="file" accept=".csv" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!file}>
              Envoyer
            </Button>
          </DialogContent>
        </Dialog>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
