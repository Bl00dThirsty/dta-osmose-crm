"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,  
} from "lucide-react";


interface Permission {
  id: number
  permissionId: number
  name: string
  createdAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function RolePermissionsPage() {
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  //Fonction de retour a la page d'accueil si pas de accessToken
    useEffect(() => {
     const token = localStorage.getItem('accessToken')
     if (!token) {
        router.push('/')
      }
    }, [])
      //Fonction de retour a la page suivante
  const handleGoBack = () => {
    router.back();
  };
  const { id } = useParams()
  const name = useParams().name
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 10
  const skip = (page - 1) * limit

  const fetchPermissions = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/role/${id}/permission?page=${page}&count=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setPermissions(data.permissions); // Les permissions paginées
    setTotal(data.total); // Le total des permissions
  } catch (error) {
    console.error("Erreur lors du chargement des permissions", error);
  } finally {
    setLoading(false);
  }
};

  const fetchAllPermissions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/permission`, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
      })
      const data = await res.json()
      console.log('Structure des permissions:', data)
      setAllPermissions(data)
    } catch (error) {
      console.error("Erreur lors du chargement des permissions globales", error)
    }
  }
  
  const handleDelete = async (permissionId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/role/${id}/permission/${permissionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json'
        },
      })

      setPermissions(prev => prev.filter(p => p.permissionId !== permissionId))
    } catch (error) {
      console.error("Erreur lors de la suppression", error)
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedPermissionIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    )
  }

  const handleAddPermissions = async () => {
    if (selectedPermissionIds.length === 0) return
    setAdding(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/role-permission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          role_id: Number(id),
          permission_id: selectedPermissionIds,
        }),
      })
  
      if (res.ok) {
        setSelectedPermissionIds([])
        fetchPermissions()
      } else {
        console.error("Erreur lors de l'ajout des permissions")
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout", error)
    } finally {
      setAdding(false)
    }
  }
  

  useEffect(() => {
    setLoading(true);
    fetchPermissions()
    fetchAllPermissions()
  }, [id, page])
  const totalPages = Math.ceil(total / limit);

  if (loading) return <p>Chargement...</p>
  if (!fetchPermissions) return <p>Vous n'avez pas accès à ces informations. Role introuvable.</p>;

  return (
    
           
          
    <div className="p-4">
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 mb-5 hover:bg-blue-500 transition-colors bg-blue-800 px-2 py-1 rounded"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>
      <h1 className="text-xl font-bold mb-4">Permissions du rôle {name}</h1>
      <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Ajouter des permissions</h2>
          <div className="border rounded p-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto border p-2 rounded">
              {allPermissions.map((perm) => (
              <label key={perm.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedPermissionIds.includes(perm.id)}
                onChange={() => toggleSelect(perm.id)}
                />
               <span>{perm.name}</span>
              </label>
               ))}
          </div>
          </div>
           <Button
              onClick={handleAddPermissions}
              disabled={adding || selectedPermissionIds.length === 0}
              className="mt-3"
            >
            {adding ? "Ajout en cours..." : "Ajouter"}
           </Button>
      </div>

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
       {/* Pagination */}
      {/* Pagination */}
<div className="flex items-center justify-between mt-4">
  <Button
    disabled={page <= 1}
    onClick={() => setPage((prev) => prev - 1)}
  >
    Précédent
  </Button>
  <span>
    Page {page} sur {totalPages}
  </span>
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
