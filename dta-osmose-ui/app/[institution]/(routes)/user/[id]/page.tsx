"use client";

import { useParams } from "next/navigation";
import { useGetUserByIdQuery } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  AudioWaveform,
  BookOpen,
  ArrowLeft,
  ArrowBigDownDash,
  Crown,
  User,
} from "lucide-react";

export default function DetailUserPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex">
      <span className="font-medium text-gray-600 w-40 flex-shrink-0">{label} :</span>
      <span className="text-gray-800">{value || 'Non renseigné'}</span>
    </div>
  );
  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);
  const { id } = useParams();
  const { data: user, isLoading, error } = useGetUserByIdQuery(id as string);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error || !user) return <p>Utilisateur introuvable.</p>;

  return (
    
    <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
      <div className="mb-4 ml-4 pt-4">
      <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white-600 hover:bg-blue-500 transition-colors bg-blue-800 px-2 py-1 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
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
  );
  
  // Composant réutilisable pour afficher les informations
  
}
