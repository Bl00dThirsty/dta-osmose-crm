// app/users/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";
import { useGetUserByIdQuery } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DetailUserPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

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
          Détails de {user.firstName} {user.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Téléphone :</strong> {user.phone}</p>
        <p><strong>Sexe :</strong> {user.gender}</p>
        <p><strong>Poste :</strong> {user.designation?.name}</p>
        <p><strong>Département :</strong> {user.department?.name}</p>
        <p><strong>Date de naissance :</strong> {user.birthday}</p>
        <p><strong>Matricule :</strong> {user.employeeId}</p>
        <p><strong>CNPS :</strong> {user.CnpsId}</p>
        <p><strong>Adresse :</strong> {user.street}, {user.city}, {user.zipCode}</p>
        <p><strong>Contact d'Urgence :</strong> {user.emergencyname1} ({user.emergencylink1}) - {user.emergencyPhone1}</p>
      </CardContent>
    </Card>
  );
}
