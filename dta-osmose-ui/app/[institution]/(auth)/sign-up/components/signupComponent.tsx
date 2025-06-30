"use client";

import { useState } from "react";
import { useAuth } from "../../sign-in/context/authContext";
import { FingerprintIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner"
import { useCreateCustomersMutation } from "@/state/api"

export default function RegisterComponent() {
  const { register, error, clearError } = useAuth();
  const [formValues, setFormValues] = useState({
    customId: "",
    name: "",
    userName: "",
    phone: "",
    password: "",
    email: "",
    
  });
  const router = useRouter();
  const resetForm= () => {
    setFormValues({
      customId: "",
      name: "",
      userName: "",
      phone: "",
      password: "",
      email: "",
    });
   };
  //const [userName, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const { institution } = useParams() as { institution: string }

  const handleGenerateCustomId = () => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    if (institution) {
      const generatedId = `Cli_${institution}-${randomDigits}`;
      setFormValues((prev) => ({ ...prev, customId: generatedId }));
      return generatedId;
    } else {
      toast.warning("Institution non définie.");
      return null;
    }
  };
  const [createCustomer] = useCreateCustomersMutation();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const generatedId = handleGenerateCustomId();
      if (!generatedId) return;
  
      const dataToSend = {
        ...formValues,
        customId: generatedId,
      };
  
      await createCustomer(dataToSend).unwrap();
      toast.success("Compte client créé avec succès !");
      resetForm();
      router.push(`/${institution}/sign-in`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  

  return (
    <div className="flex justify-center items-start pt-8 px-4">
      <Card className="shadow-lg w-full max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
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
             name="email"
              placeholder="Email"
              type="text"
              value={formValues.email}
              onChange={handleChange}
              required
            />
            <Input
             name="name"
              placeholder="Designation"
              type="text"
              value={formValues.name}
              onChange={handleChange}
              required
            />
            <div className="flex items-center w-full">
              <Input
                name="password"
                placeholder="Mot de passe"
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                onChange={handleChange}
                required
              />
              <span
                className="flex px-4 pt-7 w-16"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FingerprintIcon size={25} className="text-gray-400 cursor-pointer" />
              </span>
            </div>
            <Input
              name="userName"
              placeholder="Nom utilisateur"
              type="text"
              value={formValues.userName}
              onChange={handleChange}
              required
            />
            <Input
              name="phone"
              placeholder="Téléphone"
              type="text"
              value={formValues.phone}
              onChange={handleChange}
              required
            />
            <Button
              className="w-full h-12"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création en cours..." : "S'inscrire"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-5">
          <p className="text-sm text-gray-500">
            Vous avez déjà un compte ?{" "}
            <Link href={`/${institution}/sign-in`} className="text-blue-500">
              Connectez-vous ici
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
