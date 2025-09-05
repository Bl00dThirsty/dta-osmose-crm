"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { User, useGetDepartmentsQuery, useGetDesignationsQuery, useGetRolesQuery } from "@/state/api"

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
    defaultValues: user
  })

  const { data: roles = [] } = useGetRolesQuery()
  const { data: departments = [] } = useGetDepartmentsQuery()
  const { data: designations = [] } = useGetDesignationsQuery()

  const onSubmit = async (data: User) => {
    await onUpdate(data)
    onOpenChange(false)
  }

  // Liste des champs avec leur typage correct
  const fields =[
              { label: "Prénom", name: "firstName", type: "text" },
              { label: "Nom", name: "lastName", type: "text" },
              { label: "Nom d'utilisateur", name: "userName", disabled: true, type: "text" },
              { label: "Nouveau mot de passe", name: "password", type: "password", optional: true },
              { label: "Email 📩", name: "email", type: "email" },
              { label: "Téléphone 📞", name: "phone", type: "text" },
              { label: "Adresse", name: "street", type: "text" },
              { label: "Ville", name: "city", type: "text" },
              { label: "Code postal", name: "zipCode", type: "text" },
              { label: "Date de naissance", name: "birthday", type: "date" },
              { label: "Date d'embauche", name: "joinDate", type: "date" },
              { label: "Matricule CNPS", name: "CnpsId", type: "text" },
              { label: "Salaire 💰", name: "salary", type: "number" },
              { label: "Numéro d'urgence", name: "emergencyPhone1", type: "text" },
              { label: "Contact d'urgence", name: "emergencyname1", type: "text" },
              { label: "Lien de parenté", name: "emergencylink1", type: "text" }] as const

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
              value={user.id}
              readOnly
              className="col-span-3 bg-gray-100"
              disabled
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

           {/* === Champs Selects === */}

          {/* Sexe */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">Sexe</Label>
            <select
              id="gender"
              className="col-span-3 border rounded-md p-2"
              {...register("gender")}
              defaultValue={user.gender || ""}
            >
              <option value="">Sélectionner</option>
              <option value="masculin">Homme</option>
              <option value="feminin">Femme</option>
            </select>
          </div>

          {/* Rôle */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Rôle</Label>
            <select
              id="role"
              className="col-span-3 border rounded-md p-2"
              {...register("role")}
              defaultValue={user.role || ""}
            >
              <option value="">Sélectionner</option>
              {roles.map((r: any) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Département */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="departmentId" className="text-right">Département</Label>
            <select
              id="departmentId"
              className="col-span-3 border rounded-md p-2"
              {...register("departmentId")}
              defaultValue={user.departmentId || ""}
            >
              <option value="">Sélectionner</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Poste */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="designationId" className="text-right">Poste</Label>
            <select
              id="designationId"
              className="col-span-3 border rounded-md p-2"
              {...register("designationId")}
              defaultValue={user.designationId || ""}
            >
              <option value="">Sélectionner</option>
              {designations.map((des: any) => (
                <option key={des.id} value={des.id}>{des.name}</option>
              ))}
            </select>
          </div>

          {/* Groupe Sanguin */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bloodGroup" className="text-right">Groupe Sanguin 🩸</Label>
            <select
              id="bloodGroup"
              className="col-span-3 border rounded-md p-2"
              {...register("bloodGroup")}
              defaultValue={user.bloodGroup || ""}
            >
              <option value="">Sélectionner</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O-">O-</option>
              <option value="O+">O+</option>
            </select>
          </div>

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