"use client"

import { useReactTable, Table } from "@tanstack/react-table"
import { X, ArrowDownToLine } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import * as XLSX from 'xlsx'
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddProductDialog } from "../../../components/AddProductDialog"

import { useCreateProductMutation } from "@/state/api"
import { quantityLevel, statuses } from "../data/data"
import { toast } from "react-toastify";



type ProductFormData = {
  quantity: number
  EANCode: string
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
      await createProduct({ data: productData, institution }).unwrap()
      toast.success("Produit ajouté");
    } catch (error: any) {
        console.log("Erreur lors de la création :", error?.data || error.message || error)
        toast.error("Erreur lors l'ajout d'un produit, essayez à nouveau");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
  }
  const handleUpload = async () => {
  if (!file) {
    toast.error("Aucun fichier sélectionné.");
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = e.target?.result;
      if (!data) {
        toast.error("Aucune donnée lue dans le fichier.");
        return;
      }

      // Lis les données Excel
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!excelData || excelData.length === 0) {
        toast.error("Le fichier est vide ou mal formaté.");
        return;
      }

      // Envoi vers l’API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/institutions/${institution}/products/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(excelData),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        console.error("Réponse serveur :", err);
        toast.error("Erreur d'importation côté serveur.");
        return;
      }

      toast.success("Produits importés avec succès !");
      setFile(null); // reset file input
    } catch (err) {
      console.error("Erreur lors de la lecture ou l'importation :", err);
      toast.error("Erreur lors de la lecture ou de l'envoi du fichier.");
    }
  };

  reader.onerror = (err) => {
    console.error("Erreur de lecture du fichier :", err);
    toast.error("Impossible de lire le fichier.");
  };

  // Lis en mode binaire pour éviter les erreurs de parsing
  reader.readAsBinaryString(file);
};



  const handleExport = () => {
    const rows = table.getFilteredRowModel().rows
  
    const exportData = rows.map(row => {
      const original = row.original as any
      return {
        EANCode: original.EANCode,
        brand: original.brand,
        designation: original.designation,
        quantity: original.quantity,
        purchase_price: original.purchase_price,
        sellingPriceTTC: original.sellingPriceTTC,
        restockingThreshold: original.restockingThreshold,
        warehouse: original.warehouse,
      }
    })
  
    const csv = Papa.unparse(exportData)
  
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
  
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "produits.csv")
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
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
        <AddProductDialog onCreate={(productData) => handleCreateProduct(productData)} institution={institution}/>


        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="px-2 lg:px-3">
              <Upload className="mr-2 h-4 w-4" />
              Importer CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md space-y-4">
            <DialogHeader>
              <DialogTitle>Importer un fichier Excel</DialogTitle>
            </DialogHeader>
            <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!file}>
              Envoyer
            </Button>
          </DialogContent>
        </Dialog>
        <Button variant="outline" className="px-2 lg:px-3" onClick={handleExport}>
           Exporter CSV
        </Button>


        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
{/* <AddProductDialog onCreate={handleCreateProduct} institution={institution} /> */}
