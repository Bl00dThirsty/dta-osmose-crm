//useCreateInventoryMutation
"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetProductsQuery, useCreateInventoryMutation, useGetUsersQuery } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateInventory = () => {
    const { institution } = useParams() as { institution: string }
  const [titre, setTitre] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [performedById, setPerformedById] = useState<number | undefined>();
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [createdAt, setcreatedAt] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const { data: products = [] } = useGetProductsQuery({ institution });
  const { data: users = [] } = useGetUsersQuery();
  const [createInventory] = useCreateInventoryMutation();
  const router = useRouter();


  useEffect(() => {
    const initialItems = products.map((product: any) => ({
      productId: product.id,
      designation: product.designation,
      systemQty: product.quantity,
      countedQty: 0,
      comment: ""
    }));
    setInventoryItems(initialItems);
  }, [products]);

  const handleQtyChange = (index: number, value: number) => {
    const updated = [...inventoryItems];
    updated[index].countedQty = value;
    setInventoryItems(updated);
  };

  const handleCommentChange = (index: number, value: string) => {
    const updated = [...inventoryItems];
    updated[index].comment = value;
    setInventoryItems(updated);
  };

  const handleSubmit = async () => {
    if (!titre || !location || !performedById) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    try {
      await createInventory({
        institution,
        titre,
        location,
        performedById,
        note,
        inventoryItems
      }).unwrap();
      toast.success("Inventaire enregistré avec succès !");
      // Reset fields
      setTitre("");
      setLocation("");
      setNote("");
      setPerformedById(undefined);
      setcreatedAt("");
      router.push(`/${institution}/inventory/all`);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
      console.error(error);
    }
  };
  

  const currentProducts = inventoryItems.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(inventoryItems.length / productsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouvel inventaire</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2">Titre</Label>
            <Input value={titre} onChange={(e) => setTitre(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Lieu (entrepôt)</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Date</Label>
            <Input type="date" value={createdAt} onChange={(e) => setcreatedAt(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Initiateur</Label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={performedById ?? ""}
              onChange={(e) => setPerformedById(Number(e.target.value))}
            >
              <option value="">-- Sélectionner --</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label className="mb-2">Note</Label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="mt-6">
          <Label className="text-lg font-semibold">Produits</Label>
          <table className="w-full border mt-2">
            <thead className="bg-white-100">
              <tr>
                <th className="border px-2 py-1">Produit</th>
                <th className="border px-2 py-1">Quantité système</th>
                <th className="border px-2 py-1">Quantité réelle</th>
                <th className="border px-2 py-1">Différence</th>
                <th className="border px-2 py-1">Commentaire</th>
              </tr>
            </thead>
            <tbody>
            {currentProducts.map((item, index) => {
              const realIndex = indexOfFirstProduct + index;
              return (
                <tr key={item.productId}>
                  <td className="border px-2 py-1">{item.designation}</td>
                  <td className="border px-2 py-1 text-center">{item.systemQty}</td>
                  <td className="border px-2 py-1 text-center">
                    <Input
                      type="number"
                      value={item.countedQty}
                      onChange={(e) => handleQtyChange(realIndex, Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                 {item.countedQty > 0 && Math.abs(item.countedQty - item.systemQty)} 
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      value={item.comment}
                      onChange={(e) => handleCommentChange(realIndex, e.target.value)}
                    />
                  </td>
                </tr>
              );

            })}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 space-x-2">
           <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
             ← Précédent
           </button>

         {Array.from({ length: totalPages }, (_, i) => (
           <button
               key={i + 1}
               onClick={() => setCurrentPage(i + 1)}
               className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white-200 border'}`}
            >
             {i + 1}
          </button>
        ))}

         <button
           disabled={currentPage === totalPages}
           onClick={() => setCurrentPage(currentPage + 1)}
           className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
         >
           Suivant →
         </button>
        </div>
      </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="justify-content-center">Enregistrer l’inventaire</Button>
      </CardFooter>
      {/* <ToastContainer /> */}
    </Card>
  );
};

export default CreateInventory;
