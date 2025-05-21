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
}

type AddCustomerDialogProps = {
  onCreate: (customerData: CustomerFormData) => void
}

export const AddCustomerDialog = ({ onCreate }: AddCustomerDialogProps) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    customId: "",
    name: "",
    phone: "",
    nameresponsable: "",
    email: "",
    ville: "",
    website: "",
    type_customer: "",
    role:"",
    quarter:"",
    region:"",
  });

  const resetForm= () => {
    setFormData({
        customId: "",
        name: "",
        phone: "",
        nameresponsable: "",
        email: "",
        ville: "",
        website: "",
        type_customer: "",
        role:"",
        quarter:"",
        region:"",
    });
   };

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
          <DialogTitle>Ajouter un client</DialogTitle>
          <DialogDescription>
            Remplissez les informations du client, puis cliquez sur <b>Ajouter</b>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {[
            { label: "Id client", name: "customId", type: "text" },
            { label: "Désignation", name: "name", type: "text" },
            { label: "Téléphone", name: "phone", type: "text" },
            { label: "Nom du responsable", name: "nameresponsable", type: "text" },
            { label: "email", name: "email", type: "text" },
            { label: "ville", name: "ville", type: "text" },
            { label: "site web", name: "website", type: "text" },
            { label: "type du client", name: "type_customer", type: "text" },
            { label: "role", name: "role", type: "text" },
            { label: "quartier", name: "quarter", type: "text" },
            { label: "region", name: "region", type: "text" },
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
