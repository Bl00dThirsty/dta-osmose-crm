"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { User} from "@/types"

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
  const { register, handleSubmit, reset } = useForm<User>({
    defaultValues: User
  })

  const onSubmit = async (data: User) => {
    await onUpdate(data)
    onOpenChange(false)
  }

  // Liste des champs avec leur typage correct
  const fields =[
              { label: "Prénom", name: "firstName" },
              { label: "Nom", name: "lastName" },
              { label: "Nom d'utilisateur", name: "userName", disabled: true },
              { label: "Nouveau mot de passe", name: "password", type: "password", optional: true },
              { label: "Email 📩", name: "email", type: "email" },
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
              { label: "Lien de parenté", name: "emergencylink1" }] as const

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ID Client (non modifiable) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userId" className="text-right">
              ID Client
            </Label>
            <Input
              id="userId"
              value={User.userId}
              readOnly
              className="col-span-3 bg-gray-100"
            />
          </div>

          {/* Champs modifiables */}
          {fields.map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                {field.label}
              </Label>
              <Input
                id={field.name}
                type={field.type}
                className="col-span-3"
                {...register(field.name)}
              />
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