"use client";

import { useParams } from "next/navigation";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UpdateUserForm } from "../add/components/updateUser";
import { toast } from "react-toastify";
import { User } from "@/state/api";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCircle,
  Building,
  Briefcase,
  IdCard,
  ShieldCheck,
  HeartPulse,
  Contact,
  ArrowLeft,
  DollarSignIcon,
  User2
} from "lucide-react";

export default function DetailUserPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  // const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
  //   <div className="flex">
  //     <span className="font-medium text-gray-600 w-40 flex-shrink-0">{label} :</span>
  //     <span className="text-gray-800">{value || 'Non renseigné'}</span>
  //   </div>
  // );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token]);
  const { id } = useParams();
  const { data: user, isLoading, error, refetch } = useGetUserByIdQuery(id as string);

  const handleGoBack = () => {
    router.back();
  };
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
   const handleUpdate = async (updatedData: Partial<User>) => {
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

  if (isLoading) return <p>Chargement...</p>;
  if (error || !user) return <p>Vous n'avez pas accès à ces informations. Utilisateur introuvable.</p>;

  const avatarUrl =
    user.gender === "feminin"
      ? "https://cdn-icons-png.flaticon.com/512/3006/3006873.png" // icône homme
      : user.gender === "masculin"
      ? "https://cdn-icons-png.flaticon.com/512/3006/3006876.png" // icône femme
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // neutre

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number }) => (
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <span className="font-medium text-gray-600">{label} :</span>
      <span className="text-gray-800">{value || 'Non renseigné'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto mt-6 shadow-xl">
        {/* Header Profil */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-lg text-white">
          <div className="flex items-center gap-4">
            <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full border-2 border-white shadow" />
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-sm opacity-80">{user.designation?.name || "Poste non défini"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.back()} variant="outline" className="bg- hover:bg-gray-100">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
            <Button 
              onClick={() => setIsUpdateDialogOpen(true)} 
              className="bg-yellow-400 text-black hover:bg-yellow-500"
              disabled={isUpdating}
            >
              {isUpdating ? "Enregistrement..." : "Modifier"}
            </Button>
          </div>
        </div>

        {/* Contenu */}
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne gauche */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">👤 Informations personnelles</h3>
                <div className="space-y-3">
                  <InfoItem icon={Mail} label="Email" value={user.email} />
                  <InfoItem icon={Phone} label="Téléphone" value={user.phone} />
                  <InfoItem icon={UserCircle} label="Sexe" value={user.gender} />
                  <InfoItem icon={Calendar} label="Naissance" value={user.birthday} />
                  <InfoItem icon={HeartPulse} label="Groupe sanguin" value={user.bloodGroup} />
                </div>
              </div>

               <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">📍 Adresse</h3>
                <div className="space-y-3">
                  <InfoItem icon={MapPin} label="Adresse" value={`${user.street}, ${user.city} ${user.zipCode}`} />
                   <InfoItem icon={User2} label="Rôle" value={user.role} />
                </div>
              </div>
              
              
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">💼 Poste</h3>
                <div className="space-y-3">
                  <InfoItem icon={Briefcase} label="Poste" value={user.designation?.name} />
                  <InfoItem icon={Building} label="Département" value={user.department?.name} />
                  <InfoItem icon={IdCard} label="Matricule" value={user.employeeId} />
                  <InfoItem icon={ShieldCheck} label="CNPS" value={user.CnpsId} />
                  <InfoItem 
                    icon={DollarSignIcon} 
                    label="Salaire Mensuelle" 
                    value={`${(user.salary ?? 0).toLocaleString('fr-FR')} F CFA`} 
                  />
                 <InfoItem icon={Calendar} label="Date d'embauche" value={new Date(user.joinDate ).toLocaleDateString()} />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">☎ Urgences</h3>
                <div className="space-y-3">
                  <InfoItem icon={Contact} label={user.emergencyname1 || "Contact"} value={`${user.emergencylink1 || ""} - ${user.emergencyPhone1 || ""}`} />
                  
                </div>
              </div>
              
            </div>
          </div>
        </CardContent>
      </Card>

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
}
