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
import { Textarea } from "@/components/ui/textarea"
import { NewProduct } from "@/state/api"
import { PlusIcon } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { v4 } from "uuid"

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
}

type AddProductDialogProps = {
  onCreate: (ProductData: ProductFormData & { institution: string }) => void;
  institution: string;
}

export const AddProductDialog = ({ onCreate, institution }: AddProductDialogProps) => {
  const [formData, setFormData] = useState({
    id: v4(),
    name: "",
    quantity: 0,
    signature: "",
    gtsPrice: 0,
    sellingPriceHT: 0,
    sellingPriceTTC: 0,
    purchase_price: 0,
    label: "",
    status: true,
    collisage: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate({ ...formData, institution });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter <PlusIcon /></Button>
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
            { label: "Nom", name: "name", type: "text" },
            { label: "Quantité", name: "quantity", type: "number" },
            { label: "Signature", name: "signature", type: "text" },
            { label: "Prix GTS", name: "gtsPrice", type: "number" },
            { label: "Prix HT", name: "sellingPriceHT", type: "number" },
            { label: "Prix TTC", name: "sellingPriceTTC", type: "number" },
            { label: "Prix d'achat", name: "purchase_price", type: "number" },
            { label: "Collisage", name: "collisage", type: "number" },
          ].map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">{field.label}</Label>
              <Input
                type={field.type}
                id={field.name}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          ))}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">Catégorie</Label>
            <input
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Entrez la catégorie de votre produit"
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
