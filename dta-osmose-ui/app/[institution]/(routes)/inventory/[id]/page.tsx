"use client";
import { useParams, useRouter } from "next/navigation";
import { useGetInventoryIdQuery } from "@/state/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import PrintInventorySheet from "./pdfImprim"

export default function DetailInventoryPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
 
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { institution } = useParams() as { institution: string };
  const { data: inventory, isLoading, error } = useGetInventoryIdQuery(id);

  const productsPerPage = 10;

  useEffect(() => {
    setIsMounted(true);
    setToken(localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    if (isMounted && !token) {
      router.push("/sign-in");
    }
  }, [token, isMounted, router]);

  const filteredItems = useMemo(() => {
    if (!inventory?.inventoryItems) return [];

    let items = inventory.inventoryItems;

    // Recherche
    if (searchTerm) {
      items = items.filter(item =>
        item.product?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri sur écart
    items = [...items].sort((a, b) =>
      sortOrder === "asc" ? a.difference - b.difference : b.difference - a.difference
    );

    return items;
  }, [inventory?.inventoryItems, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredItems.length / productsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredItems.map(item => ({
        Produit: item.product?.designation,
        "Quantité système": item.systemQty,
        "Quantité réelle": item.countedQty,
        Écart: item.difference,
        Commentaire: item.comment || "",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventaire");
    XLSX.writeFile(workbook, `Inventaire_${inventory?.titre}.xlsx`);
  };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Produit", "Qté système", "Qté réelle", "Écart", "Commentaire"]],
//       body: filteredItems.map(item => [
//         item.product?.designation,
//         item.systemQty,
//         item.countedQty,
//         item.difference,
//         item.comment || "",
//       ]),
//     });
//     doc.save(`Inventaire_${inventory?.titre}.pdf`);
//   };

  if (!isMounted || isLoading) return <p className="text-center py-8">Chargement en cours...</p>;
  if (error || !inventory) return <p className="text-center py-8 text-red-500">Inventaire introuvable</p>;

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto mt-6 shadow">
        <div className="flex justify-between items-center p-4">
          <Button onClick={() => router.back()} variant="outline" className="bg-blue-600 text-white">
            ← Retour
          </Button>
          <Button 
            onClick={() => router.push(`/${institution}/inventory/update/${id}`)}
            className="ml-auto bg-yellow-600 text-white hover:bg-yellow-700"  
          >
            Modifier
          </Button>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl text-center">{inventory.titre}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <p><strong>Date :</strong> {new Date(inventory.createdAt!).toLocaleDateString()}</p>
          <p><strong>Lieu :</strong> {inventory.location}</p>
          <p><strong>Initiateur :</strong> {inventory.user?.firstName} {inventory.user?.lastName}</p>
          <p><strong>Note :</strong> {inventory.note}</p>
        </CardContent>
      </Card>

      <Card className="max-w-6xl mx-auto shadow">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Liste des produits inventoriés</CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToExcel} variant="outline">Exporter Excel</Button>
            {/* <Button onClick={exportToPDF} variant="outline">Exporter PDF</Button> */}
            <PrintInventorySheet inventory={inventory} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Rechercher par désignation (Entrer le nom en majuscule)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-white-100">
                <th className="border px-2 py-1">Produit</th>
                <th className="border px-2 py-1">Qté système</th>
                <th className="border px-2 py-1">Qté réelle</th>
                <th className="border px-2 py-1 cursor-pointer" onClick={toggleSortOrder}>
                  Écart {sortOrder === "asc" ? "▲" : "▼"}
                </th>
                <th className="border px-2 py-1">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(item => (
                <tr key={item.productId}>
                  <td className="border px-2 py-1 text-center">{item.product?.designation}</td>
                  <td className="border px-2 py-1 text-center">{item.systemQty}</td>
                  <td className="border px-2 py-1 text-center">{item.countedQty}</td>
                  <td className="border px-2 py-1 text-center">{item.difference}</td>
                  <td className="border px-2 py-1 text-center">{item.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 gap-2">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              ← Précédent
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
              >
                {i + 1}
              </Button>
            ))}
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              Suivant →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
