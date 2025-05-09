"use client"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Papa from "papaparse"
import { useCreateProductMutation } from "@/state/api"
import { useState } from "react"
import { PlusIcon, Upload } from "lucide-react"

export const UploadCSVDialog = () => {
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
              quantity: Number(product.quantity),
              signature: product.signature,
              gtsPrice: Number(product.gtsPrice),
              sellingPriceHT: Number(product.sellingPriceHT),
              sellingPriceTTC: Number(product.sellingPriceTTC),
              purchase_price: Number(product.purchase_price),
              label: product.label,
              collisage: Number(product.collisage),
              status: product.status === "true",
            }).unwrap()
          } catch (error) {
            console.error("Erreur lors de l'ajout du produit :", error)
          }
        }
        alert("Produits importés avec succès 🎉")
      },
      error: (err) => {
        console.error("Erreur lors de la lecture du CSV :", err)
      }
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
