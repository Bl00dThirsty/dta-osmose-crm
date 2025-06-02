import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { v4 } from "uuid"

type ProductFormData = {
  quantity: number;
  EANCode: string;
  brand: string;
  designation: string;
  restockingThreshold: number;
  warehouse: string;
  sellingPriceTTC: number;
  purchase_price: number;
}

type AddProductDialogProps = {
  onCreate: (productData: ProductFormData) => void
  institution: string;
}

export const AddProductDialog = ({ onCreate, institution }: AddProductDialogProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    quantity: 0,
    EANCode: "",
    brand: "",
    designation: "",
    restockingThreshold: 0,
    warehouse: "",
    sellingPriceTTC: 0,
    purchase_price: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter <PlusIcon className="ml-2" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:w-3/4">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du produit, puis cliquez sur <b>Ajouter</b>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {[
            { label: "Code EAN", name: "EANCode", type: "text" },
            { label: "Marque", name: "brand", type: "text" },
            { label: "Désignation", name: "designation", type: "text" },
            { label: "Quantité", name: "quantity", type: "number" },
            { label: "Prix d'achat", name: "purchase_price", type: "number" },
            { label: "Prix TTC", name: "sellingPriceTTC", type: "number" },
            { label: "Seuil de réapprovisionnement", name: "restockingThreshold", type: "number" },
            { label: "Entrepôt", name: "warehouse", type: "text" },
          ].map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          ))}

          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
