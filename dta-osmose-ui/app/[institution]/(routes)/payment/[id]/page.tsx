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
import { toast } from 'react-toastify';

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

  // const handleMontantDonneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = Number(e.target.value);
  //   setpaidAmount(val);
  //   const restant = (sale?.dueAmount ?? 0) - val;
  //   setdueAmount(restant > 0 ? restant : 0);
  // };

// const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const newDiscount = Number(e.target.value) || 0;
//   setDiscount(newDiscount);

//   const finalAmount = sale?.finalAmount ?? 0;
//   const newDue = finalAmount - newDiscount - paidAmount;
//   setdueAmount(newDue > 0 ? newDue : 0);
// };


const handleMontantDonneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const val = Number(e.target.value);
  setpaidAmount(val);
  // if(val > dueAmount){
  //   toast.error("le montant donné est superieur au montant a donner")
  //   return
  // }
  const restant = (sale?.dueAmount ?? 0) - (discount ?? 0) - val;
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

  const handleCinetPay = () => {
    const transactionId = Math.floor(Math.random() * 100000000).toString();
  
    const cinetpayConfig = {
      apikey: process.env.NEXT_PUBLIC_CINETPAY_APIKEY!,
      site_id: process.env.NEXT_PUBLIC_CINETPAY_SITE_ID!,
      notify_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/cinetpay/notify`,
      mode: 'PRODUCTION',
    };
  
    const checkoutParams = {
      transaction_id: transactionId,
      amount: paidAmount, 
      currency: 'XOF',
      channels: 'ALL',
      description: `Paiement partiel facture ${sale?.invoiceNumber}`,
      customer_name: 'Nom',
      customer_surname: 'Prenom',
      customer_email: 'email@exemple.com',
      customer_phone_number: '000000000',
      customer_address: 'Adresse',
      customer_city: 'Ville',
      customer_country: 'CI',
      customer_state: 'CI',
      customer_zip_code: '00000'
    };
  
    // if (window.CinetPay) {
    //   window.CinetPay.setConfig(cinetpayConfig);
    //   window.CinetPay.getCheckout(checkoutParams);
    //   window.CinetPay.waitResponse(function (data: any) {
    //     if (data.status === "ACCEPTED") {
    //       alert("Paiement réussi !");
    //       // Redirige vers le backend pour maj de la facture
    //       fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/${sale?.id}/payment`, {
    //         method: 'PATCH',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           invoiceId: sale?.id,
    //           amount: paidAmount,
    //           paymentMethod,
    //           dueAmount,
    //           discount,
    //         }),
    //       }).then(() => router.push(`/${institution}/sales/${sale?.id}`));
    //     } else {
    //       alert("Paiement refusé !");
    //     }
    //   });
  
    //   window.CinetPay.onError(function (err: any) {
    //     console.error("Erreur CinetPay:", err);
    //   });
    // }
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://cdn.cinetpay.com/seamless/main.js';
      script.async = true;
      document.body.appendChild(script);
    }, []);
    
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
          <option value="chèque">Par chèque</option>
          <option value="remise">Remise</option>
       </select>
       
      <Label className='mb-3'>Montant donné</Label>
      <Input
        type="number"
        value={paidAmount}
        min={0}
        max={sale.finalAmount ?? 0}
        onChange={handleMontantDonneChange}
        className="w-full mb-3"
      />
      
      {(paymentMethod === "mobile" || paymentMethod === "bancaire") && paidAmount > 0 && (
       <button
          onClick={handleCinetPay}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mb-4 mr-3 w-50"
       >
          Payer avec CinetPay
       </button>
      )}

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
