"use client"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Papa from "papaparse"
import { useCreateProductMutation } from "@/state/api"
import { useState } from "react"
import { PlusIcon, Upload } from "lucide-react"
import { useParams } from "next/navigation"

export const UploadCSVDialog = () => {
  const [file, setFile] = useState<File | null>(null)
  const [createProduct] = useCreateProductMutation()
  const { institution } = useParams() as { institution: string }

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
      complete: async ({ data }: Papa.ParseResult<any>) => {
        for (const rawProduct of data) {
          try {
            await createProduct({
              institution,
              data: {
                quantity: Number(rawProduct.quantity) || 0,
                brand: rawProduct.brand,
                designation: rawProduct.designation,
                restockingThreshold: Number(rawProduct.restockingThreshold) || 0,
                sellingPriceTTC: Number(rawProduct.sellingPriceTTC) || 0,
                purchase_price: Number(rawProduct.purchase_price) || 0,
                warehouse: rawProduct.warehouse,
                EANCode: rawProduct.EANCode || "",
              },
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Upload className="mr-2" /> Importer CSV</Button>
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
  )
}
