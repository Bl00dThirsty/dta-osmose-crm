
"use client"

import Image from "next/image"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { useGetUsersQuery } from "@/state/api"

import { labels } from "@/app/[institution]/(routes)/crm/products/table/data/data"

const UserPage = () => {
  const { data: user, isLoading, isError } = useGetUsersQuery()

  if (isLoading) return <p>Chargement...</p>
  if (isError) return <p>Vous n'avez pas accès à ces informations. Erreur lors du chargement.</p>

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hey! 👋🏽</h2>
          <p className="text-muted-foreground">
            Ici vous trouverez la liste de tous les utilisateurs enregistrés !
          </p>
        </div>
      </div>
      <DataTable data={user || []} columns={columns} />
    </div>
  )
}

export default UserPage;