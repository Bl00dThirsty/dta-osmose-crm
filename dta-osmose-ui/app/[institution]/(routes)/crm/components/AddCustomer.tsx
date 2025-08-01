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
import { ChangeEvent, FormEvent, useState, useEffect } from "react"
import { useGetRolesQuery } from "@/state/api"
// import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';

type CustomerFormData = {
    customId: string;
    name: string;
    userName: string;
    phone: string;
    nameresponsable?: string;
    email: string;
    password: string;
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
    const { institution } = useParams() as { institution: string }
  
    const [formData, setFormData] = useState({
      customId: "",
      name: "",
      userName: "",
      phone: "",
      nameresponsable: "",
      email: "",
      password: "",
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
          userName: "",
          phone: "",
          nameresponsable: "",
          email: "",
          password: "",
          ville: "",
          website: "",
          type_customer: "",
          role:"",
          quarter:"",
          region:"",
      });
     };
    
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    validatePassword(formData.password)
  }, [formData.password])

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8) errors.push("8 caractères minimum")
    if (!/[A-Z]/.test(password)) errors.push("une majuscule")
    if (!/[0-9]/.test(password)) errors.push("un chiffre")
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("un caractère spécial")

    if (errors.length > 0) {
      setPasswordError(`Le mot de passe doit contenir ${errors.join(", ")}.`)
    } else {
      setPasswordError("")
    }
  }
    const { data: role = [] } = useGetRolesQuery();
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    };
  
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (passwordError) {
            toast.error("Le mot de passe est invalide. Veuillez corriger les erreurs.");
            return;
          }
      if (!formData.customId) {
        toast.error("Veuillez générer l'identifiant du client avant de soumettre.");
        return;
      }
      onCreate(formData);
      toast.success("Ajout du client reussi!")
      resetForm();
    };
  
    const handleGenerateCustomId = () => {
      const randomDigits = Math.floor(100000000 + Math.random() * 900000000); // 4 chiffres aléatoires
      if (institution) {
        const generatedId = `Cli_${institution}-${randomDigits}`;
        setFormData((prev) => ({ ...prev, customId: generatedId }));
      } else {
        toast.warning("Institution non définie.");
      }
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
            {/* ID Client + Génération */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customId" className="text-right">Id client</Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="customId"
                  name="customId"
                  type="text"
                  value={formData.customId}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleGenerateCustomId}>
                  Générer
                </Button>
              </div>
            </div>
  
            {/* Autres champs */}
            {[
              { label: "Désignation", name: "name" },
              { label: "Email", name: "email" },
              { label: "Téléphone", name: "phone" },
              //{ label: "Mot de passe", name: "password", type: "password" },
              { label: "Nom d'utilisateur", name: "userName" },
              { label: "Nom du responsable", name: "nameresponsable" },              
              { label: "Ville", name: "ville" },
              { label: "Site web", name: "website" },
              { label: "Quartier", name: "quarter" },
              { label: "Région", name: "region" },
            ].map((field) => (
              <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            ))}

            <div className="relative">
              <Label htmlFor="password">Mot de Passe</Label>
             <Input
               type={showPassword ? "text" : "password"}
               name="password"
               className="w-full border rounded-md p-2 mt-2"
               value={formData.password}
               onChange={handleChange}
               required
              />
             <div
               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer mt-4"
               onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
             </div>
               {passwordError && (
                <p className="text-sm text-red-500 mt-3">{passwordError}</p>
               )}
             </div>
  
            {/* Sélecteurs */}
            <div>
              <Label htmlFor="type_customer">Type de client</Label>
              <select
                name="type_customer"
                className="w-full border rounded-md p-2 mt-2"
                value={formData.type_customer}
                onChange={handleChange}
              >
                <option value="">Sélectionner</option>
                <option value="pharmacie">Pharmacie</option>
                <option value="distributeur">Distributeur</option>
                <option value="grossiste">Grossiste</option>
                <option value="boutique">Boutique</option>
              </select>
            </div>
  
            <div>
              <Label htmlFor="role">Rôle</Label>
              <select
                name="role"
                className="w-full border rounded-md p-2 mt-2"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Sélectionner</option>
                {role.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
  
            <DialogFooter>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }