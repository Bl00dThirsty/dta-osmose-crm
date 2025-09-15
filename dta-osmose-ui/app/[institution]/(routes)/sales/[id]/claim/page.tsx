"use client";

import { useCreateClaimMutation, useGetSaleByIdQuery } from '@/state/api';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Container from "../../../components/ui/Container";
import { toast } from "react-toastify";

export default function CreateClaimForm() {
  console.log('ClaimPage rendered');
  const [createClaim] = useCreateClaimMutation();
  const [form, setForm] = useState({ productId: '', quantity: 1, reason: '', description: '' });
  const [quantityError, setQuantityError] = useState("");
  const router = useRouter();
  const { id, institution } = useParams<{ id: string; institution: string }>();

  const { data: invoice, isLoading } = useGetSaleByIdQuery(id);

  const selectedItem = invoice?.items.find((item) => item.productId === form.productId);
  const maxQuantity = selectedItem?.quantity ?? 1;
  const unitPrice = selectedItem?.unitPrice ?? 0;

  const total = unitPrice * form.quantity;

  const isQuantityInvalid = form.quantity > maxQuantity;
  if (isLoading || !invoice) return <div>Chargement...</div>;

  useEffect(() => {
    console.log('ClaimPage mounted');
  }, []);

  const handleClaimSubmit = async () => {
    if (isQuantityInvalid) {
      setQuantityError("La quantité que vous avez entrée est supérieure à la quantité commandée.");
      return;
    }
    console.log("numero de facture:", invoice.id)
    try{
    await createClaim({
      institution,
      invoiceId: invoice.id,
      productId: form.productId,
      quantity: form.quantity,
      reason: form.reason,
      description: form.description,
      unitPrice,
      
    }).unwrap();
    toast.success("Réclamation créée !");
    setForm({ productId: '', quantity: 1, reason: '', description: '' });
    setQuantityError("");
    router.push(`/${institution}/sales/${id}`);
    } catch (error){
      console.log('Erreur création reclam:', error);
      toast.error("Échec de l'enregistrement");
    }
  };

  return (
    <Container
      //title="Paramètres de l'entreprise"
      title="Création d'une réclamation"
      description=""
    >
    <div className="max-w-4xl mx-auto p-4 bg-white-800 rounded border">
      <h3 className="text-xl mb-4 text-center">Créer une réclamation</h3>
      <Label className='mb-2'>Désignation Produits</Label>
      <select value={form.productId} onChange={e => {
            const productId = e.target.value;
            const item = invoice.items.find(i => i.productId === productId);
            setForm({ ...form, productId, quantity: 1 });
            setQuantityError(""); // reset
          }}
           className="w-full border rounded-md p-2 mb-5">
        <option value="">Sélectionnez un produit</option>
        {invoice.items.map(item => (
          <option key={item.productId} value={item.productId}>
            {item.product?.designation ?? 'Produit inconnu'}
          </option>
        ))}
      </select>
      <Label className='mb-2'>Quantité</Label>
      <Input
        type="number"
        min="1"
        max={invoice.items.find(i => i.productId === form.productId)?.quantity || 1}
        value={form.quantity}
        onChange={e => {
            const quantity = Number(e.target.value);
            setForm({ ...form, quantity });
            if (quantity > maxQuantity) {
              setQuantityError("La quantité que vous avez entrée est supérieure à la quantité commandée.");
            } else {
              setQuantityError("");
            }
          }}
        className="w-full mb-5"
      />
      {quantityError && (
          <p className="text-red-600 text-sm mb-4">{quantityError}</p>
        )}

       <Label className="mb-2">Prix unitaire</Label>
        <Input
          type="text"
          value={unitPrice.toFixed(2) + " FCFA"}
          disabled
          className="w-full mb-5 bg-gray-100"
        />

        <Label className="mb-2">Montant total</Label>
       <Input
          type="text"
          value={total.toFixed(2) + " FCFA"}
          disabled
          className="w-full mb-5 bg-gray-100"
       />
      <Label className='mb-2'>Nature de la réclamation</Label>
      <select value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
        className="w-full border rounded-md p-2 mb-5">
        <option value="">Sélectionnez ...</option>
        <option value="NON_LIVRÉ">Non livré</option>
        <option value="AVARIÉ">Avarié</option>
        <option value="PÉRIMÉ">Périmé</option>
        <option value="DÉFECTUEUX">Défectueux</option>
        <option value="AUTRES">Autres ... description</option>
      </select>

      <Label className='mb-2'>Description</Label>
      <textarea
        value={form.description}
        onChange={e => setForm({...form, description: e.target.value})}
        placeholder="Description…"
        className="w-full mb-4 border rounded"
      />
      
      <button onClick={handleClaimSubmit} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500" disabled={isQuantityInvalid || !form.productId || !form.reason}>
        Envoyer
      </button>
    </div>
    </Container>
  );
}
