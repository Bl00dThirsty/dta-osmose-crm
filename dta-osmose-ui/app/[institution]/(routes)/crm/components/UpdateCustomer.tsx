"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Customer } from "@/state/api"

export function UpdateCustomerForm({
  customer,
  open,
  onOpenChange,
  onUpdate
}: {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (data: Partial<Customer>) => Promise<void>
}) {
  const { register, handleSubmit, reset } = useForm<Customer>({
    defaultValues: customer
  })

  const onSubmit = async (data: Customer) => {
    await onUpdate(data)
    onOpenChange(false)
  }

  // Liste des champs avec leur typage correct
  const fields = [
    { label: "Nom", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Nom Utilisateur", name: "userName", type: "text" },
    { label: "Téléphone", name: "phone", type: "tel" },
    { label: "password", name: "password", type: "password" },
    { label: "Responsable", name: "nameresponsable", type: "text" },
    { label: "Ville", name: "ville", type: "text" },
    { label: "Quartier", name: "quarter", type: "text" },
    { label: "Région", name: "region", type: "text" },
    { label: "Site web", name: "website", type: "text" },
  ] as const

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ID Client (non modifiable) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customId" className="text-right">
              ID Client
            </Label>
            <Input
              id="customId"
              value={customer.customId}
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