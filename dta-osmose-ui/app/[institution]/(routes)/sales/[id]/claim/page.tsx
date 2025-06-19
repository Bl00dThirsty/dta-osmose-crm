"use client";

import { useCreateClaimMutation, useGetSaleByIdQuery } from '@/state/api';
import { useParams, useRouter } from 'next/navigation';
import { useState } from "react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Container from "../../../components/ui/Container";

export default function CreateClaimForm() {
  const [createClaim] = useCreateClaimMutation();
  const [form, setForm] = useState({ productId: '', quantity: 1, reason: '', description: '' });
  const router = useRouter();
  const { institution } = useParams<{ institution: string }>();
  const params = useParams();
  const id = params?.id as string;

  const { data: invoice, isLoading } = useGetSaleByIdQuery(id);

  const selectedItem = invoice?.items.find((item) => item.productId === form.productId);
const unitPrice = selectedItem?.unitPrice ?? 0;
const total = unitPrice * form.quantity;


  if (isLoading || !invoice) return <div>Chargement...</div>;

  const handleClaimSubmit = async () => {
    console.log("numero de facture:", invoice.id)
    await createClaim({
      institution,
      invoiceId: invoice.id,
      productId: form.productId,
      quantity: form.quantity,
      reason: form.reason,
      description: form.description,
      unitPrice,
      
    }).unwrap();
    alert("Réclamation créée !");
    setForm({ productId: '', quantity: 1, reason: '', description: '' });
    router.push(`/${institution}/sales/${id}`);
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
      <select value={form.productId} onChange={e => setForm({...form, productId: e.target.value})} className="w-full border rounded-md p-2 mb-5">
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
        onChange={e => setForm({...form, quantity: Number(e.target.value)})}
        className="w-full mb-5"
      />

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
      
      <button onClick={handleClaimSubmit} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500">
        Envoyer
      </button>
    </div>
    </Container>
  );
}
