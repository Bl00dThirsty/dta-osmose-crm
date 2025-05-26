"use client";

import { useParams } from "next/navigation";
import { useGetCustomerByIdQuery } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DetailCustomerPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);
  const { id } = useParams();
  const { data: customer, isLoading, error } = useGetCustomerByIdQuery(id as string);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error || !customer) return <p>Utilisateur introuvable.</p>;

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow">
      <div className="mb-4 ml-4">
        <button
          onClick={handleGoBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          ← Retour
        </button>
      </div>
      <CardHeader>
      
        <CardTitle className="text-2xl text-center">
          {customer.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 mt-5">
      <p><strong>ID client :</strong> {customer.customId}</p>
          <p><strong>Email :</strong> {customer.email}</p>
          <p><strong>Téléphone :</strong> {customer.phone}</p>
          <p><strong>Nom du responsable :</strong> {customer.nameresponsable}</p>
          
          <p><strong>Adresse :</strong> {customer.quarter}</p>
        <p><strong>Role :</strong> {customer.role}</p>
          <p><strong>Region :</strong> {customer.region}</p>
          <p><strong>Ville :</strong> {customer.ville}</p>
          <p><strong>Type de client :</strong> {customer.type_customer}</p>
          <p><strong>Site web :</strong> {customer.website}</p>
      </CardContent>
    </Card>
  );
}
{/* <CardContent className="flex space-x-9 space-y-7 mt-5">
        
        <div className="flex-1">
        <p><strong>ID client :</strong> {customer.customId}</p>
          <p><strong>Email :</strong> {customer.email}</p>
          <p><strong>Téléphone :</strong> {customer.phone}</p>
          <p><strong>Nom du responsable :</strong> {customer.nameresponsable}</p>
          
          <p><strong>Adresse :</strong> {customer.quarter}</p>
        </div>
       
        <div className="flex-1">
          <p><strong>Role :</strong> {customer.role}</p>
          <p><strong>Region :</strong> {customer.region}</p>
          <p><strong>Ville :</strong> {customer.ville}</p>
          <p><strong>Type de client :</strong> {customer.type_customer}</p>
          <p><strong>Site web :</strong> {customer.website}</p>
        </div>
      </CardContent> */}