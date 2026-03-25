
"use client"

import { useReactTable, Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import * as XLSX from 'xlsx'
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { DataTableViewOptions } from "@/app/[institution]/(routes)/components/table/data-table-view-options"
import { AddProductDialog } from "../../components/AddProductDialog"
import { DataTableFacetedFilter} from "@/app/[institution]/(routes)/components/table/data-table-faceted-filter"
import { useCreateProductMutation } from "@/state/api"
import { quantityLevel, statuses } from "@/app/[institution]/(routes)/components/data/data"
import UserPrivateComponent from "../../../components/usePrivateComponent";

import { toast } from "react-toastify";
import { saveAs } from "file-saver";

// Use the ProductFormData type from AddProductDialog to avoid type conflicts
// type ProductFormData = AddProductFormData;

// type ProductRow = {
//   id?: string;
//   EANCode?: string;
//   brand: string;
//   designation: string;
//   quantity: number;
//   purchase_price: number;
//   sellingPriceTTC: number;
//   restockingThreshold: number;
//   warehouse: string;
//   created_at?: Date;
//   updated_at?: Date;
//   institutionId?: string;
//   imageName?: string;
//   idSupplier?: number;
//   product_category_id?: number;
//   unit_measurement?: number;
//   unit_type?: string;
//   sku?: string;
//   reorder_quantity?: number;
// };

// interface DataTableToolbarProps {
//   table: Table<ProductRow>;
// }

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
  const isFiltered = table.getState().columnFilters.length > 0;
  const { institution } = useParams() as { institution: string };

  const [createProduct] = useCreateProductMutation();
  // Déplacé à l'intérieur du composant
  const [file, setFile] = useState<File | null>(null);

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
 console.log(process.env.NEXT_PUBLIC_API_BASE_URL, institution)

const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
   if (!file) {
    toast.error("❌ Aucun fichier sélectionné");
    return;
  }
   console.log("📁 Fichier sélectionné:", file.name, file.size, file.type);
  try {
    // Lire le fichier Excel
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    // Récupérer la première feuille
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir en JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    //  Adapter les clés pour correspondre à ton backend
    const products = (jsonData as any[]).map(item => ({
      EANCode: String(item.EANCode || item.EanCode || item.eancode || ""),
      brand: item.brand || "",
      designation: item.designation || "",
      quantity: item.quantity || 0,
      purchase_price: item.purchase_price || 0,
      sellingPriceTTC: item.sellingPriceTTC || 0,
      restockingThreshold: item.restockingThreshold || 0,
      warehouse: item.warehouse || "",
    }));

    if (!products.length) {
      alert("Aucun produit trouvé dans le fichier.");
      return;
    }
    console.log(jsonData); // brut depuis XLSX
    
    // Envoi au backend
     // ou récupérer dynamiquement depuis l’URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/institutions/${institution}/products/import`, {
      method: "POST",
      headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
      body: JSON.stringify({ products }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Erreur lors de l'import");
    }

    toast.success(`Import terminé : ${result.imported} ajoutés, ${result.updated} mis à jour, ${result.skipped} ignorés`);
  } catch (err: any) {
    console.error("Erreur import Excel:", err);
    toast.error("Erreur lors de l'import : " + err.message);
  }
};

  
  const handleExport = () => {
   const rows = table.getFilteredRowModel().rows;

   const exportData = rows.map(row => {
    const original = row.original as any;
    return {
      EANCode: original.EANCode,
      Brand: original.brand,
      Designation: original.designation,
      Quantity: original.quantity,
      Purchase_Price: original.purchase_price,
      SellingPriceTTC: original.sellingPriceTTC,
      RestockingThreshold: original.restockingThreshold,
      Warehouse: original.warehouse,
    };
   });

  // Créer une feuille Excel depuis les données
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Créer un classeur (workbook) et y ajouter la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Produits");

  // Générer le fichier Excel en mémoire
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Sauvegarder le fichier sur l’ordinateur
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "produits.xlsx");
};
  


  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Rechercher un produit (désignation ou marque)..."
          value={(table.getColumn("designation")?.getFilterValue() as string) ?? ""}
          onChange={(e) => {
          const value = e.target.value;
          table.getColumn("designation")?.setFilterValue(value);
          table.getColumn("brand")?.setFilterValue(value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("brand") && (
          <DataTableFacetedFilter
            column={table.getColumn("brand")}
            title="Marque"
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
        <AddProductDialog
          onCreate={(productData) => createProduct({ data: productData, institution })}
          institution={institution}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="px-2 lg:px-3">
              <Upload className="mr-2 h-4 w-4" />
              Importer Excel
            </Button>
          </DialogTrigger>
          <UserPrivateComponent permission="import-product">
              <DialogContent className="sm:max-w-md space-y-4">
                <DialogHeader>
                  <DialogTitle>Importer un fichier Excel</DialogTitle>
               </DialogHeader>
                <div className="space-y-4">
                  <Input
                   type="file"
                   accept=".xlsx, .xls"
                   onChange={handleUpload}
                   id="file-upload"
                  />
                   <Button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    variant="outline"
                   >
                     Sélectionner un fichier
                   </Button>
                </div>
          </DialogContent>
          </UserPrivateComponent>
        </Dialog>
        <Button variant="outline" className="px-2 lg:px-3" onClick={handleExport}>
           Exporter Excel
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}