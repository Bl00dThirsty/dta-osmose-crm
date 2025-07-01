"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useRouter} from 'next/navigation';
import Container from "../../components/ui/Container";
import { useGetSaleByIdQuery, useUpdateSalePaymentMutation } from '@/state/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
} from "lucide-react";

const PaymentPage = () => {
    const params = useParams();
    const id = params?.id as string;
    const { institution } = useParams<{ institution: string }>();
  const router = useRouter();
  const { data: sale, isLoading } = useGetSaleByIdQuery(id);
  const [updatePayment] = useUpdateSalePaymentMutation();
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userRole === "Particulier";
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paidAmount, setpaidAmount] = useState(0);
  const [dueAmount, setdueAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (sale) {
        setdueAmount(sale.dueAmount ?? 0);
      setpaidAmount(0);
      setPaymentMethod(sale.paymentMethod || '');
    }
  }, [sale]);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const newDiscount = Number(e.target.value) || 0;
    setDiscount(newDiscount);
    const originalDue = sale?.dueAmount ?? 0;
    const newDue = originalDue - newDiscount;
    setdueAmount(newDue > 0 ? newDue : 0);
  };

  const handleMontantDonneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setpaidAmount(val);
    const restant = (sale?.dueAmount ?? 0) - val;
    setdueAmount(restant > 0 ? restant : 0);
  };

  const handleSubmit = async () => {
    if (!id) return;
    await updatePayment({
      id: id,
      paymentMethod,
      paidAmount,
      dueAmount,
      discount,
    }).unwrap();
    router.push(`/${institution}/sales/${id}`); // retour détail facture
  };
  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) return <p>Chargement...</p>;
  if (!sale) return <p>Facture introuvable</p>;

  return (
    <Container
      //title="Paramètres de l'entreprise"
      title={`FACTURE N°: ${sale?.invoiceNumber}`}
      description=""
    >
      <div className="mb-4 ml-4">
        <button
          onClick={handleGoBack}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          ← Retour
        </button>
      </div>
    <div className="max-w-4xl mx-auto p-4 border-5">
      <h2 className="text-xl mb-4 text-center">Paiement de la facture de vente</h2>
      
      <Label className='mb-3'>Montant total</Label>
      <Input disabled value={sale.finalAmount} className="w-full mb-2" />
      {!isParticulier && (
        <Label className='mb-3'>Remise additionnelle</Label>
      )}
      {!isParticulier && (
        <Input
          type="number"
          value={discount}
          min={0}
          max={sale.dueAmount ?? 0}
          onChange={handleDiscountChange}
          className="w-full mb-4"
        />
     )}

      <Label className='mb-3'>Montant à payer</Label>
      <Input value={dueAmount} disabled className="w-full mb-2" />

      <Label className='mb-3'>Méthode de paiement</Label>
       <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border rounded-md p-2 mb-3">
          <option value="">Sélectionnez</option>
          <option value="mobile">Paiement mobile</option>
          <option value="bancaire">Paiement bancaire</option>
          <option value="espece">Espèces</option>
          <option value="cheque">Par chèque</option>
          <option value="remise">Remise</option>
       </select>

      <Label className='mb-3'>Montant donné</Label>
      <Input
        type="number"
        value={paidAmount}
        min={0}
        max={sale.finalAmount ?? 0}
        onChange={handleMontantDonneChange}
        className="w-full mb-4"
      />

      <button
        onClick={handleSubmit}
        //disabled={!paymentMethod || paidAmount <= 0}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Valider paiement
      </button>
    </div>
    </Container>
  );
};

export default PaymentPage;
