"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { User } from "@/types"

type Field = {
  label: string;
  name: keyof User; // Assurez-vous que c'est un type de chaîne
  type?: string; // type est optionnel
  required?: boolean; // required est optionnel
  disabled?: boolean; // disabled est optionnel
};

export function UpdateUserForm({
  user,
  open,
  onOpenChange,
  onUpdate
}: {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (data: Partial<User>) => Promise<void>
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<User>({
    defaultValues: user
  })

  const onSubmit = async (data: User) => {
    await onUpdate(data)
    onOpenChange(false)
  }

  const fields: Field[] = [
    { label: "Prénom", name: "firstName", required: true },
    { label: "Nom", name: "lastName", required: true },
    { label: "Nom d'utilisateur", name: "userName", disabled: true },
    { label: "Nouveau mot de passe", name: "password", type: "password" },
    { label: "Email 📩", name: "email", type: "email", required: true },
    { label: "Téléphone 📞", name: "phone" },
    { label: "Adresse", name: "street" },
    { label: "Ville", name: "city" },
    { label: "Code postal", name: "zipCode" },
    { label: "Date de naissance", name: "birthday", type: "date" },
    { label: "Date d'embauche", name: "joinDate", type: "date" },
    { label: "Matricule CNPS", name: "CnpsId" },
    { label: "Salaire 💰", name: "salary", type: "number" },
    { label: "Numéro d'urgence", name: "emergencyPhone1" },
    { label: "Contact d'urgence", name: "emergencyname1" },
    { label: "Lien de parenté", name: "emergencylink1" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name as string} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name as string} className="text-right">
                {field.label}
              </Label>
              <Input
                id={field.name as string}
                type={field.type}
                className="col-span-3"
                {...register(field.name as string, { required: field.required })}
                disabled={field.disabled}
              />
              {errors[field.name] && (
                <span className="text-red-500">{field.label} est requis.</span>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}