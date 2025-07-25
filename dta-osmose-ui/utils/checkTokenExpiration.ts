"use client";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useRouter, useParams } from 'next/navigation';

export function middleware(request: NextRequest) {
  const { institution } = useParams() as { institution: string }
  // Récupérer le token dans les cookies (ou le localStorage si vous le gérez différemment)
  const token = request.cookies.get("accessToken");

  // Vérifier si l'utilisateur essaie d'accéder au dashboard sans être connecté
  const isDashboardRoute = request.nextUrl.pathname.startsWith(`/${institution}/`);

  // Si pas de token et accès au dashboard, rediriger vers la page de connexion
  if (!token && isDashboardRoute) {
    const signInUrl = new URL(`/${institution}/sign-in`, request.url); // Remplacez par la route de votre page de connexion
    return NextResponse.redirect(signInUrl);
  }

  // Sinon, permettre l'accès
  return NextResponse.next();
}
