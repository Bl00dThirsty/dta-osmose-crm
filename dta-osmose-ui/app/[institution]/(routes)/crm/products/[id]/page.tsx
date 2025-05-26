// app/users/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";
import { useGetProductByIdQuery } from "@/state/api"; 
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
  const InfoItem = ({ label, value, values }: { label: string; value?: string | null; values?:number }) => (
    <div className="flex">
      <span className="font-medium text-gray-600 w-40 flex-shrink-0">{label} :</span>
      <span className="text-gray-800">{value || values || 'Non renseigné'}</span>
    </div>
  );
  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id as string);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error || !product) return <p>Produit introuvable.</p>;

  return (
    
    <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
      <div className="mb-4 ml-4 pt-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-semibold text-center text-white-800">
          {product.designation}
        </CardTitle>
        <CardDescription className="text-center text-white-500">
          Informations détaillées
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne de gauche */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">Informations</h3>
              <div className="space-y-3">
                <InfoItem label="EANCode" value={product.EANCode} />
                <InfoItem label="Catégorie" value={product.brand} />
                <InfoItem label="Quantité" values={product.quantity} />
                <InfoItem label="Quantité de réapprovisionnement" values={product.restockingThreshold} />
              </div>
            </div>
          </div>
          
          {/* Colonne de droite */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">Prix</h3>
              <div className="space-y-3">
                {/* <InfoItem 
                  label="Adresse complète" 
                  value={`${user.street}, ${user.city} ${user.zipCode}`} 
                  
                /> */}
                <InfoItem label="Prix de vente" values={product.sellingPriceTTC} />
                <InfoItem label="Prix d'achat" values={product.purchase_price} />
                <InfoItem label="Entrepôt" value={product.warehouse} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Composant réutilisable pour afficher les informations
  
}
