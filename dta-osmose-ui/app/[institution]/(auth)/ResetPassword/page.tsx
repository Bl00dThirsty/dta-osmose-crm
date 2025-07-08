"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useResetPasswordMutation } from '@/state/api';
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword] = useResetPasswordMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { institution } = useParams() as { institution: string }

  const handleSubmit = async (e:any) => {
    e.preventDefault();   
    if (newPassword !== confirmPassword) return alert('Les mots de passe ne correspondent pas');
    if (!token) return alert('Token invalide ou inexistant ou expiré');
    setIsSubmitting(true);
    try {
      await resetPassword({ token, newPassword, institution }).unwrap();
      alert('Mot de passe mis à jour avec succès');
      toast.success("Mot de passe mis à jour avec succès")
    } catch {
      
      alert('Lien invalide ou expiré');
      toast.error("Lien expiré ou invalide")
    }
  };

  return (
    <div className="flex justify-center items-start pt-8 px-4">
      <Card className="shadow-lg w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 border rounded shadow">
      <CardHeader className="space-y-1">
      <CardTitle className="text-2xl">Réinitialisez votre mot de passe</CardTitle>
        {/* <h2 className="text-xl font-semibold mb-4">Réinitialisez votre mot de passe</h2> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <Input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirmez le mot de passe"
          className="mt-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Réinitialisation en cours..." : "Réinitialiser"}
        </Button>
        </CardContent>
     </form>
     <CardFooter className="flex flex-col space-y-5 mt-3">
      <p className="text-sm text-gray-500">
            Retour à la page de connexion ?{" "}
            <Link href={`/${institution}/sign-in`} className="text-blue-500">
              Cliquez ici
            </Link>
      </p>
    </CardFooter>
     </Card>
    </div>
  );
}
