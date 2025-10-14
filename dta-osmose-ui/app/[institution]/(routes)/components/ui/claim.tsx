"use client";

import { Bell, AlertTriangleIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useGetClaimPendingQuery } from "@/state/api"; // <-- ton hook RTK Query
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function PendingClaimsNotification() {
  const { institution } = useParams() as { institution: string };
  const router = useRouter();
  const { data: pendingClaims = [], isLoading } = useGetClaimPendingQuery({ institution });

  const count = pendingClaims.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <AlertTriangleIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          {count >= 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 rounded-full px-1.5 py-0 text-xs"
            >
              {count}
            </Badge>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-72">
        {count === 0 ? (
          <p className="text-sm text-gray-500">Aucune réclamation en attente</p>
        ) : (
          <div
            onClick={() => router.push(`/${institution}/claims/all`)}
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {count} réclamation(s) en attente
            </p>
            <p className="text-xs text-gray-500">
              Cliquez ici pour consulter et traiter les réclamations.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
