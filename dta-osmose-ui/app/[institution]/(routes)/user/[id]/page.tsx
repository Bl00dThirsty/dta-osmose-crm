"use client";

import { useParams } from "next/navigation";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UpdateUserForm } from "@/app/[institution]/(routes)/user/add/components/updateUser";
import {
  AudioWaveform,
  BookOpen,
  ArrowLeft,
  ArrowBigDownDash,
  Crown,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataTable } from "../all/table/components/data-table";
import { columns } from "../all/table/components/columns";

export default function DetailUserPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex">
      <span className="font-medium text-gray-600 w-40 flex-shrink-0">{label} :</span>
      <span className="text-gray-800">{value || 'Non renseigné'}</span>
    </div>
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
   const [dates, setDates] = useState({
      startDate: '',
      endDate: ''
    });
  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);

  const { id } = useParams();
  const { data: user, isLoading, error,refetch } = useGetUserByIdQuery(id as string);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleGoBack = () => {
    router.back();
  };

  // Gestion de la mise à jour
    const handleUpdate = async (updatedData: Partial<User>) => {
      try {
        if (!user?.id) {
          throw new Error("ID client manquant");
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
  if (isLoading) return <p>Chargement...</p>;
  if (error || !user) return <p>Utilisateur introuvable.</p>;

  return (
     <div className="space-y-6">
    <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
      <div className="flex justify-between items-center p-4">
      <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white-600 hover:bg-blue-500 transition-colors bg-blue-800 px-2 py-1 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
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
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne de gauche */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">Informations personnelles</h3>
              <div className="space-y-3">
                <InfoItem label="📩 Email" value={user.email} />
                <InfoItem label="📞 Téléphone" value={user.phone} />
                <InfoItem label="Sexe" value={user.gender} />
                <InfoItem label="Date de naissance" value={user.birthday} />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">Poste</h3>
              <div className="space-y-3">
                <InfoItem label="Poste" value={user.designation?.name} />
                <InfoItem label="📊 Département" value={user.department?.name} />
                <InfoItem label="Matricule" value={user.employeeId} />
                <InfoItem label="CNPS" value={user.CnpsId} />
              </div>
            </div>
          </div>
          
          {/* Colonne de droite */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">📫 Adresse</h3>
              <div className="space-y-3">
                <InfoItem 
                  label="Adresse complète" 
                  value={`${user.street}, ${user.city} ${user.zipCode}`} 
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">☎ Contacts d'urgence</h3>
              <div className="space-y-3">
                <InfoItem 
                  label={user.emergencyname1 || "Contact 1"} 
                  value={`${user.emergencylink1} - ${user.emergencyPhone1}`} 
                />
                {/* Vous pouvez ajouter d'autres contacts d'urgence ici */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>  

    {/* Historique des commandes */}
          <Card className="max-w-6xl mx-auto shadow">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>Historique des commandes</CardTitle>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dates.startDate}
                    onChange={(e) => setDates(prev => ({...prev, startDate: e.target.value}))}
                    className="border p-2 rounded text-sm"
                  />
                  <input
                    type="date"
                    value={dates.endDate}
                    onChange={(e) => setDates(prev => ({...prev, endDate: e.target.value}))}
                    className="border p-2 rounded text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={user.saleInvoice || []}
                columns={columns}
              />
            </CardContent>
          </Card>
          {/* Formulaire de modification */}
          {user && (
            <UpdateUserForm
              user={user}
              open={isUpdateDialogOpen}
              onOpenChange={setIsUpdateDialogOpen}
              onUpdate={handleUpdate}
              isLoading={isUpdating}
            />
          )}
         </div>
       );
  
  // Composant réutilisable pour afficher les informations
  
}
