"use client";

import { useState } from 'react';
import { useSendTokenResetPasswordMutation } from '@/state/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [sendTokenResetPassword] = useSendTokenResetPasswordMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { institution } = useParams() as { institution: string }
  
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendTokenResetPassword({ email, institution }).unwrap();
      alert('Email envoyé ! Vérifiez votre boîte de réception.');
      toast.success("Lien de réinitialisation envoyé ! Veuillez Consulter votre adresse e-mail");
    } catch {
      alert('Erreur lors de l’envoi de l’email.');
      toast.error("Erreur, cette adresse  e-mail n'existe pas.");
    }
  };

  return (
    
    <div className="flex justify-center items-start pt-8 px-4">
      <Card className="shadow-lg w-full max-w-lg mx-auto">
    <form onSubmit={handleSubmit}>
       <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Mot de passe oublié ?</CardTitle>
        <p className="mb-4 text-sm text-gray-500">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
        </CardHeader>
        <CardContent className="grid gap-4">
        <Input
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </Button>
        </CardContent>
    </form>
    <CardFooter className="flex flex-col space-y-5 mt-3">
      <p className="text-sm text-gray-500">
            Retour à la page de connexion ?{" "}
            <Link href={`/${institution}/sign-in`} className="text-blue-500">
              Connectez-vous ici
            </Link>
      </p>
    </CardFooter>
      </Card>
    </div>
  );
}
