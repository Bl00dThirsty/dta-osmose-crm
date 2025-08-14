"use client";

import { Table } from "@tanstack/react-table";
import { X, ArrowDownToLine } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { AddProductDialog, ProductFormData as AddProductFormData } from "../../../components/AddProductDialog";

import { useCreateProductMutation, useImportProductsMutation } from "@/state/api";
import { quantityLevel } from "../data/data";
import { toast } from "react-toastify";

// Use the ProductFormData type from AddProductDialog to avoid type conflicts
type ProductFormData = AddProductFormData;

type ProductRow = {
  id?: string;
  EANCode?: string;
  brand: string;
  designation: string;
  quantity: number;
  purchase_price: number;
  sellingPriceTTC: number;
  restockingThreshold: number;
  warehouse: string;
  created_at?: Date;
  updated_at?: Date;
  institutionId?: string;
  imageName?: string;
  idSupplier?: number;
  product_category_id?: number;
  unit_measurement?: number;
  unit_type?: string;
  sku?: string;
  reorder_quantity?: number;
};

interface DataTableToolbarProps {
  table: Table<ProductRow>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { institution } = useParams() as { institution: string };

  const [createProduct] = useCreateProductMutation();
  const [importProducts] = useImportProductsMutation(); // Déplacé à l'intérieur du composant
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!institution) {
    toast.error("Institution non définie dans les paramètres URL.");
    return null;
  }

  const handleCreateProduct = (productData: ProductFormData) => {
    // Ensure institutionId is set
    const dataWithInstitution = { ...productData, institutionId: institution };
    createProduct({ data: dataWithInstitution, institution })
      .unwrap()
      .then(() => {
        toast.success("Produit ajouté");
      })
      .catch((error: any) => {
        console.error("Erreur lors de la création :", error?.data || error.message || error);
        toast.error("Erreur lors de l'ajout d'un produit, essayez à nouveau");
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Aucun fichier sélectionné.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) throw new Error("Aucune feuille trouvée dans le fichier Excel.");

        const excelData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const validatedData = excelData.map((row) => {
          const mappedRow = {
            EANCode: row["EANCode"] || row["Code EAN"],
            brand: row["brand"] || row["Marque"],
            designation: row["designation"] || row["Désignation"],
            quantity: Number(row["quantity"] || row["Quantité"]),
            restockingThreshold: Number(row["restockingThreshold"] || row["Seuil de réapprovisionnement"]),
            warehouse: row["warehouse"] || row["Entrepôt"],
            sellingPriceTTC: Number(row["sellingPriceTTC"] || row["Prix de vente TTC"]),
            purchase_price: Number(row["purchase_price"] || row["Prix d'achat"]),
          };

          // Validation complète des champs requis
          if (
            !mappedRow.EANCode ||
            !mappedRow.brand ||
            !mappedRow.designation ||
            !mappedRow.warehouse ||
            isNaN(mappedRow.quantity) ||
            mappedRow.quantity < 0 ||
            isNaN(mappedRow.restockingThreshold) ||
            mappedRow.restockingThreshold < 0 ||
            isNaN(mappedRow.sellingPriceTTC) ||
            mappedRow.sellingPriceTTC < 0 ||
            isNaN(mappedRow.purchase_price) ||
            mappedRow.purchase_price < 0
          ) {
            throw new Error(`Données invalides dans la ligne : ${JSON.stringify(row)}. Vérifiez les champs requis.`);
          }
          return mappedRow;
        });

        const response = await importProducts({ data: validatedData, institution }).unwrap();
        toast.success("Produits importés avec succès.");
        setFile(null);
      } catch (error: any) {
        console.error("Erreur lors de l'import :", error);
        toast.error(error.message || `Erreur d'importation: ${error.data?.message || error.status}`);
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = (err) => {
      console.error("Erreur de lecture du fichier :", err);
      toast.error("Erreur de lecture du fichier.");
      setIsUploading(false);
    };
  };

  const handleExport = () => {
    const rows = table.getFilteredRowModel().rows;

    const exportData = rows.map((row) => {
      const original = row.original;
      return {
        EANCode: original.EANCode,
        brand: original.brand,
        designation: original.designation,
        quantity: original.quantity,
        purchase_price: original.purchase_price,
        sellingPriceTTC: original.sellingPriceTTC,
        restockingThreshold: original.restockingThreshold,
        warehouse: original.warehouse,
      };
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "produits.csv");
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Rechercher un produit..."
          value={(table.getColumn("designation")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("designation")?.setFilterValue(e.target.value)}
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
        <AddProductDialog onCreate={handleCreateProduct} institution={institution} />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="px-2 lg:px-3">
              Importer XLS
              <ArrowDownToLine className="mr-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
        <DialogContent className="sm:max-w-md space-y-4">
          <DialogHeader>
            <DialogTitle>Importer un fichier Excel</DialogTitle>
          </DialogHeader>
          <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </DialogContent>
        </Dialog>
        <Button variant="outline" className="px-2 lg:px-3" onClick={handleExport}>
          Exporter CSV
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}