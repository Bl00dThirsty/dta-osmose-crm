"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"
import { useParams } from "next/navigation"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"

import { quantityLevel, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddProductDialog } from "../../../components/AddProductDialog"
import { NewProduct, useCreateProductMutation } from "@/state/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"

type ProductFormData = {
  quantity: number,
  EANCode: string,
  brand: string,
  designation: string,
  restockingThreshold: number,
  warehouse: string,
  sellingPriceTTC: number,
  purchase_price: number,
  institution: string,
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  }
  const params = useParams();
  const institution = params?.institution as string;

  const [file, setFile] = useState<File | null>(null)
  const [createProduct] = useCreateProductMutation()
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        setFile(selectedFile)
      }
    }
    const handleUpload = () => {
      if (!file) return
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const products = results.data as any[]
  
          for (const product of products) {
            try {
              await createProduct({
                quantity: Number(product.quantity) || 0,
                brand: product.brand,
                designation: product.designation,
                restockingThreshold: Number(product.restockingThreshold) || 0,
                sellingPriceTTC: Number(product.sellingPriceTTC) || 0,
                purchase_price: Number(product.purchase_price) || 0,
                warehouse: product.warehouse,
                institution: product.institution,            
              }).unwrap()
            } catch (error) {
              console.error("Erreur lors de l'ajout du produit :", error)
            }
          }
          alert("Produits importés avec succès...")
        },
        error: (err) => {
          console.error("Erreur lors de la lecture du CSV :", err)
        }
      })
    }
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les produits..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
            <X />
          </Button>
        )}
      </div>
      <AddProductDialog onCreate={handleCreateProduct} institution={institution} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="px-2 lg:px-3"><Upload className="mr-2" /> Importer CSV</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
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
  )
}
