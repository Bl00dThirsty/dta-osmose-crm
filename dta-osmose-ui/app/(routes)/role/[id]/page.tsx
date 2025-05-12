"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Permission {
  id: number
  permissionId: number
  name: string
  createdAt: string
}

export default function RolePermissionsPage() {
  const { id } = useParams()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 10
  const skip = (page - 1) * limit

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/role/${id}/permission`)
      const data = await res.json()
      setPermissions(data)
    } catch (error) {
      console.error("Erreur lors du chargement des permissions", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (permissionId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/role/${id}/permission/${permissionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      setPermissions(prev => prev.filter(p => p.permissionId !== permissionId))
    } catch (error) {
      console.error("Erreur lors de la suppression", error)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [id, page])
  const totalPages = Math.ceil(total / limit)

  if (loading) return <p>Chargement...</p>
  if (!fetchPermissions) return <p>Utilisateur introuvable.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Permissions du rôle</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-black-100 text-left">
            <th className="p-2">Nom</th>
            <th className="p-2">Créé le</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((perm) => (
            <tr key={perm.id} className="border-t">
              <td className="p-2">{perm.name}</td>
              <td className="p-2">{new Date(perm.createdAt).toLocaleDateString()}</td>
              <td className="p-2">
                <Button variant="destructive" onClick={() => handleDelete(perm.permissionId)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Précédent
        </Button>
        <span>Page {page} sur {totalPages}</span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Suivant
        </Button>
      </div>
    </div>
  )
}
