"use client";


import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/authContext';
import { FingerprintIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation"

export function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { institution } = useParams() as { institution: string }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push(`/${institution}/`);
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte... Donc ne touchez à r ici
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-8 px-4">
      <Card className="shadow-lg w-full max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
                <span 
                  className="absolute top-0 right-0 px-4 py-3" 
                  onClick={clearError}
                >
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Fermer</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="grid gap-4">
            <Input 
              placeholder="Email" 
              type="text" // Changé de "email" à "text" pour le nom d'utilisateur
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex items-center w-full">
              <Input 
                placeholder="Mot de passe" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="flex px-4 pt-7 w-16" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <FingerprintIcon size={25} className="text-gray-400 cursor-pointer" />
              </span>
            </div>
            <Button 
              className="w-full h-12"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-5">
          <p className="text-sm text-gray-500">
            Un problème avec votre compte? Contactez un administrateur{" "}
            <Link href="/sign-up" className="text-blue-500">
              ici
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Mot de passe oublié? Cliquez
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger className="text-blue-500">
                <span className="px-2">ici</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="p-5">Réinitialisation du mot de passe</DialogTitle>
                  <DialogDescription className="p-5">
                    Entrez votre nom d'utilisateur
                  </DialogDescription>
                </DialogHeader>
                <DialogTrigger className="w-full text-right pt-5">
                  <Button variant="destructive">Annuler</Button>
                </DialogTrigger>
              </DialogContent>
            </Dialog>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}