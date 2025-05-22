"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"

<<<<<<< HEAD
import { quantityLevel, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddProductDialog } from "../../../components/AddProductDialog"
import { NewProduct, useCreateProductMutation } from "@/state/api"
=======
import { quantityLevel, statuses } from "@/app/[institution]/(routes)/crm/products/table/data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddCustomerDialog } from "../../../components/AddCustomer"
import { NewProduct, useCreateCustomersMutation } from "@/state/api"
>>>>>>> origin/yvana
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"

<<<<<<< HEAD
type ProductFormData = {
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
=======
type CustomerFormData = {
  customId: string;
  name: string;
  phone: string;
  nameresponsable?: string;
  email: string;
  ville?: string;
  website: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string;
>>>>>>> origin/yvana
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

<<<<<<< HEAD
  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  }
  
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
                name: product.name,
                quantity: Number(product.quantity) || 0,
                signature: product.signature,
                gtsPrice: Number(product.gtsPrice) || 0,
                sellingPriceHT: Number(product.sellingPriceHT) || 0,
                sellingPriceTTC: Number(product.sellingPriceTTC) || 0,
                purchase_price: Number(product.purchase_price) || 0,
                label: product.label,
                collisage: Number(product.collisage) || 0,
                status: product.status?.toString().toLowerCase() === "true",
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
=======
  const handleCreateProduct = async (customerData: CustomerFormData) => {
    await createCustomer(customerData);
  }
  
  const [file, setFile] = useState<File | null>(null)
  const [createCustomer] = useCreateCustomersMutation()
  
   
>>>>>>> origin/yvana
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
<<<<<<< HEAD
          placeholder="Filtrer les produits..."
=======
          placeholder="Filtrer les customers..."
>>>>>>> origin/yvana
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
<<<<<<< HEAD
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
=======
        {table.getColumn("email") && (
          <DataTableFacetedFilter
            column={table.getColumn("email")}
            title="email"
            options={statuses}
          />
        )}
        
>>>>>>> origin/yvana
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
<<<<<<< HEAD
      <AddProductDialog onCreate={handleCreateProduct} />
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
=======
      <AddCustomerDialog onCreate={handleCreateProduct} />
>>>>>>> origin/yvana
      <DataTableViewOptions table={table} />
    </div>
  )
}
