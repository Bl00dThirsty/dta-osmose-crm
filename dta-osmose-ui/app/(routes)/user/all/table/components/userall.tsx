// app/users/page.tsx

"use client";

import Link from "next/link";
import { useGetUsersQuery } from "@/state/api"; // adapte selon ton setup
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserListPage() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();

  if (isLoading) return <p>Chargement...</p>;
   if (error) return <p>Erreur lors du chargement des utilisateurs.</p>;

  return (
    <Card className="max-w-5xl mx-auto mt-6 shadow">
      <CardHeader>
        <CardTitle className="text-2xl">Liste des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Prénom</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Téléphone</th>
              <th className="p-2 border">Poste</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border text-blue-600">
                  {/* <Link href={`/user/${user.id}`}> */}
                    {user.lastName}
                  {/* </Link> */}
                </td>
                <td className="p-2 border">{user.firstName}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">{user.designation?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
