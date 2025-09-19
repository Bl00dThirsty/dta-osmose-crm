"use client";

import { useParams } from "next/navigation";
import { useGetProductByIdQuery } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ArrowLeft,
} from "lucide-react";

export default function DetailUserPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const InfoItem = ({ label, value, values }: { label: string; value?: string | null; values?: number }) => (
    <div className="flex">
      <span className="font-medium text-gray-600 w-40 flex-shrink-0">{label} :</span>
      <span className="text-gray-800">{value !== undefined && value !== null ? value : values !== undefined ? values : 'Non renseigné'}</span>
    </div>
  );

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id as string);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error || !product) return <p>Produit introuvable.</p>;

  // Vérif si promo active
  const activePromos = product?.Promotion?.filter((promo: any) => promo && promo.status === true) || [];
  const hasPromo = activePromos.length > 0;
  const currentPromo = hasPromo ? activePromos[0] : null; // Prendre la première promo active
  const discountPercentage = currentPromo ? currentPromo.discount : 0;
  const reducedPrice = hasPromo 
    ? product.sellingPriceTTC - (product.sellingPriceTTC * discountPercentage / 100)
    : product.sellingPriceTTC;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      
      {/* Message Promo si actif */}
      {hasPromo && currentPromo && (
        <div className="mb-4 p-4 rounded-lg bg-green-100 border border-green-300 text-green-800 shadow">
          Promo en cours : <span className="font-semibold">{currentPromo.title}</span>  
           <span className="font-semibold"> -{discountPercentage}%</span> de remise sur le produit <span className="font-semibold">{product.designation}</span> !
        </div>
      )}

      <Card className="shadow-lg">
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
          <CardTitle className="text-3xl font-semibold text-center ">
            {product.designation}
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Informations détaillées
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">Informations</h3>
                <div className="space-y-3">
                  <InfoItem label="EANCode" value={product.EANCode} />
                  <InfoItem label="Catégorie" value={product.brand} />
                  <InfoItem label="Quantité" values={product.quantity} />
                  <InfoItem label="Seuil réapprovisionnement" values={product.restockingThreshold} />
                </div>
              </div>
            </div>
            
            {/* Colonne droite */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b">Prix</h3>
                <div className="space-y-3">
                  
                  {/* Prix avec promo */}
                  {hasPromo ? (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">Prix de Vente :</span>
                      <span className="line-through text-red-500">{product.sellingPriceTTC} FCFA</span>
                      <span className="font-bold text-green-600">{reducedPrice.toFixed(2)} FCFA</span>
                    </div>
                  ) : (
                    <InfoItem label="Prix de vente" values={product.sellingPriceTTC} />
                  )}

                  <InfoItem label="Prix d'achat" values={product.purchase_price} />
                  <InfoItem label="Entrepôt" value={product.warehouse} />
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}