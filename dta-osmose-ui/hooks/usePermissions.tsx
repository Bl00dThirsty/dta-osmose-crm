
/**
 * Hook personnalisé qui récupère les permissions de l'utilisateur depuis le localStorage
 * 
 * Ce hook est conçu pour être utilisé côté client uniquement (dans le navigateur).
 * Il vérifie d'abord si window est défini pour s'assurer qu'on est côté client.
 * Ensuite, il vérifie la présence d'un token d'accès avant de tenter de récupérer les permissions.
 * 
 * @returns {string[]} Un tableau des permissions de l'utilisateur ou un tableau vide si:
 * - On est côté serveur (SSR)
 * - Aucun token d'accès n'est trouvé
 * - Les permissions ne sont pas définies dans le localStorage
 * - Une erreur se produit lors du parsing des permissions
 */

export function usePermissions(): string[] {
  if (typeof window === "undefined") return [];
  const token = localStorage.getItem("accessToken");
  if (!token) { return [];}
  try {
    const perms = localStorage.getItem("permissions");
    return perms ? JSON.parse(perms) : [];
  } catch {
    return [];
  }
}

