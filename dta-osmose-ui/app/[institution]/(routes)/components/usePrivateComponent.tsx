"use client";
import React from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface Props {
  permission: string; // La permission requise pour afficher le contenu
  children: React.ReactNode; // Le contenu à afficher si l'utilisateur a la permission
}

/**
 * Composant qui conditionne l'affichage de son contenu en fonction des permissions utilisateur
 * 
 * Ce composant utilise le hook usePermissions pour vérifier si l'utilisateur actuel
 * possède la permission requise. Si c'est le cas, il affiche le contenfant (children).
 * Sinon, il retourne null (n'affiche rien).
 * 
 * @param {string} permission - La permission requise pour visualiser le contenu
 * @param {React.ReactNode} children - Le contenu à afficher conditionnellement
 * @returns {JSX.Element|null} Le contenfant si autorisé, null sinon
 */

export default function UserPrivateComponent({ permission, children }: Props) {
  const permissions = usePermissions();

  if (permissions.includes(permission)) {
    return <>{children}</>;
  }
  return null;
}

// Exemple d'utilisation dans un composant
{/* <UserPrivateComponent permission="create-product">
  <button>Creer un produit</button>
</UserPrivateComponent> */}