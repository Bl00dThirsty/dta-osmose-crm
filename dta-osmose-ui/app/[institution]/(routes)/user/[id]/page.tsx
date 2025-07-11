"use client";
import { useParams } from "next/navigation";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/state/api"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UpdateUserForm } from "@/app/[institution]/(routes)/crm/add/components/updateUser";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Assurez-vous que ce composant est importé

export default function DetailUserPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [dates, setDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [formValues, setFormValues] = useState({}); // Initialisation des valeurs du formulaire

  const router = useRouter();
  const { id } = useParams();

  // Initialisation côté client uniquement
  useEffect(() => {
    setIsMounted(true);
    setToken(localStorage.getItem('accessToken'));
    
    const now = new Date();
    setDates({
      startDate: new Date(now.getFullYear(), now.getMonth(), 1)
                .toISOString().split("T")[0],
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
              .toISOString().split("T")[0]
    });
  }, []);

  // Redirection si non authentifié
  useEffect(() => {
    if (isMounted && !token) {
      router.push('/sign-in');
    }
  }, [token, isMounted, router]);

  // Requêtes API
  const { 
    data: user,  // Change le nom pour plus de clarté
    isLoading, 
    error, 
    refetch 
  } = useGetUserByIdQuery({ 
    id: id as string, 
    startDate: dates.startDate, 
    endDate: dates.endDate 
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Gestion de la mise à jour
  const handleUpdate = async (updatedData: Partial<typeof user>) => {
    try {
      if (!user?.id) {
        throw new Error("ID utilisateur manquant");
      }

      const response = await updateUser({
        id: user.id,
        data: updatedData  // Correction ici pour matcher votre API
      }).unwrap();

      toast.success("Utilisateur mis à jour avec succès");
      await refetch();
      setIsUpdateDialogOpen(false);
      
      return response;
    } catch (error: any) {
      console.error("Échec de la mise à jour:", error);
      const errorMessage = error.data?.message || 
                         error.message || 
                         "Erreur lors de la mise à jour";
      toast.error(`Échec: ${errorMessage}`);
      throw error;
    }
  };

  if (!isMounted || isLoading) return <p className="text-center py-8">Chargement en cours...</p>;
  if (error || !user) return <p className="text-center py-8 text-red-500">Client introuvable</p>;

  return (
    <div className="space-y-6">
      {/* Carte principale */}
      <Card className="max-w-3xl mx-auto mt-6 shadow">
        <div className="flex justify-between items-center p-4">
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            ← Retour
          </Button>
          <Button 
            onClick={() => setIsUpdateDialogOpen(true)}
            className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isUpdating ? "Enregistrement..." : "Modifier"}
          </Button>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-semibold text-center text-white-800">
            {user.firstName} {user.lastName}
          </CardTitle>
          <CardDescription className="text-center text-white-500">
            Fiche d'information détaillée
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Prénom", name: "firstName" },
            { label: "Nom", name: "lastName" },
            { label: "Nom d'utilisateur", name: "userName" },
            { label: "Mot de passe", name: "password", type: "password" },
            { label: "Email 📩", name: "email", type: "email" },
            { label: "Téléphone 📞", name: "phone" },
            { label: "Adresse", name: "street" },
            { label: "Ville", name: "city" },
            { label: "Code postal", name: "zipCode" },
            { label: "Date de naissance", name: "birthday", type: "date" },
            { label: "Date d'embauche", name: "joinDate", type: "date" },
            { label: "Matricule", name: "employeeId" },
            { label: "Matricule CNPS", name: "CnpsId" },
            { label: "Salaire 💰", name: "salary", type: "number" },
            { label: "Numéro à contacter en cas d'urgence", name: "emergencyPhone1" },
            { label: "Nom de la personne", name: "emergencyname1" },
            { label: "Lien de parenté", name: "emergencylink1" }
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                name={name}
                type={type}
                value={formValues[name] || ""}
                onChange={e => setFormValues({ ...formValues, [name]: e.target.value })}
                className="mt-2"
              />
            </div>
          ))}

          <div>
            <Label htmlFor="gender">Sexe</Label>
            <select
              name="gender"
              className="w-full border rounded-md p-2 mt-2"
              value={formValues.gender || ""}
              onChange={e => setFormValues({ ...formValues, gender: e.target.value })}
            >
              <option value="">Sélectionner</option>
              <option value="masculin">Homme</option>
              <option value="feminin">Femme</option>
            </select>
          </div>

          {/* Rôle */}
          <div>
            <Label htmlFor="role">Rôle</Label>
            <select
              name="role"
              className="w-full border rounded-md p-2 mt-2"
              value={formValues.role || ""}
              onChange={e => setFormValues({ ...formValues, role: e.target.value })}
            >
              <option value="">Sélectionner</option>
              {/* Remplacez role par la liste des rôles */}
              {role.map(role => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Département */}
          <div>
            <Label htmlFor="departmentId">Département</Label>
            <select
              name="departmentId"
              className="w-full border rounded-md p-2 mt-2"
              value={formValues.departmentId || ""}
              onChange={e => setFormValues({ ...formValues, departmentId: e.target.value })}
            >
              <option value="">Sélectionner</option>
              {department.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Poste */}
          <div>
            <Label htmlFor="designationId">Poste</Label>
            <select
              name="designationId"
              className="w-full border rounded-md p-2 mt-2"
              value={formValues.designationId || ""}
              onChange={e => setFormValues({ ...formValues, designationId: e.target.value })}
            >
              <option value="">Sélectionner</option>
              {designation.map(des => (
                <option key={des.id} value={des.id}>{des.name}</option>
              ))}
            </select>
          </div>

          {/* Groupe Sanguin */}
          <div>
            <Label htmlFor="bloodGroup">Groupe Sanguin🩸</Label>
            <select
              name="bloodGroup"
              className="w-full border rounded-md p-2 mt-2"
              value={formValues.bloodGroup || ""}
              onChange={e => setFormValues({ ...formValues, bloodGroup: e.target.value })}
            >
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
        </CardContent>
      </Card>

      {/* Formulaire de modification */}
      {user && (
        <UpdateCustomerForm
          user={user}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onUpdate={handleUpdate}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}