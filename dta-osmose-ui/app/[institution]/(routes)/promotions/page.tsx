"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetProductsQuery, useCreatePromotionsMutation, useGetUsersQuery } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Container from "../components/ui/Container";

const CreatePromotion = () => {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const { institution } = useParams() as { institution: string };

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  const { data: products = [] } = useGetProductsQuery({ institution });
  const { data: users = [] } = useGetUsersQuery();
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [creatorId, setCreatorId] = useState<number | undefined>();
  const [productId, setProductId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createPromotion] = useCreatePromotionsMutation();

   //  Récupérer le produit sélectionné
  const selectedProduct = products.find((p: any) => String(p.id) === productId);
  const productPrice = selectedProduct?.sellingPriceTTC ?? 0;

  // Calcul du prix final avec remise
  const finalPrice = productPrice - (productPrice * discount) / 100;

  const handleSubmit = async () => {
    if (!title || !discount || !productId || !startDate || !endDate) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const now = new Date();

   // sont convertir startDate et endDate  en objets Date
     const parsedStartDate = new Date(startDate);
     const parsedEndDate = new Date(endDate);

    if (parsedStartDate < now || parsedEndDate < now) {
      toast.error("La date de début et de fin doivent être dans le futur.");
      return;
    }

    try {
      await createPromotion({
        institution,
        title,
        discount,
        productId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: true, // promotion active par défaut
      }).unwrap();

      toast.success("Promotion enregistrée avec succès !");
      router.push(`/${institution}/promotions/all`);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
      toast.info("Verifier si une promo🎉 sur ce produit n'existe déjà pas ou réessayer autrement")
      console.error(error);
    }
  };

  return (
    <Container
          //title="Paramètres de l'entreprise"
          title="Création d'une promotion"
          description="🎉 Ici vous enregistrez les remises affectées a des produits suivant une période donnée 🎉"
        >
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle promotion</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="max-w-4xl mx-auto p-4 bg-white-800 rounded border">
          <div>
            <Label className="mb-2">Titre</Label>
            <Input className="mb-5" placeholder="Ajouter un titre" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Produit</Label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-5"
              value={productId ?? ""}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">-- Sélectionner --</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.designation} ({p.sellingPriceTTC} FCFA)
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="mb-2">Remise (%)</Label>
            <Input
              type="number"
              value={discount}
              className="mb-5"
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
          {/* {productId && ( */}
              <div>
                <Label className="mb-2">Prix final (après remise)</Label>
                <Input
                  type="text"
                  readOnly
                  value={finalPrice > 0 ? `${finalPrice.toFixed(2)} FCFA` : ""}
                  className="mb-5 bg-gray-100"
                />
              </div>
            {/* )} */}
          <div>
            <Label className="mb-2">Date début de promotion</Label>
            <Input className="mb-5" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Date fin de promotion</Label>
            <Input className="mb-5" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          {/* <div>
            <Label className="mb-2">Créateur</Label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={creatorId ?? ""}
              onChange={(e) => setCreatorId(Number(e.target.value))}
            >
              <option value="">-- Sélectionner --</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div> */}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} className="justify-content-center">Enregistrer</Button>
      </CardFooter>
    </Card>
</Container>
  );
};

export default CreatePromotion;
