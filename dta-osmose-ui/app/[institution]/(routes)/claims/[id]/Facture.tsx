"use client";

import React, { forwardRef, useRef } from "react";
import { useGetSaleByIdQuery, useGetSettingsQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import "./style.css";

interface PrintToPdfProps {
   claim: any;
}

const PrintToPdf = forwardRef<HTMLDivElement, PrintToPdfProps>(({ claim }, ref) => {
  const { institution } = useParams<{ institution: string }>();
  const { data: settings = [] } = useGetSettingsQuery({ institution });
  const setting = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
  
   // Définir le logo en fonction de l'institution
   const logoSrc =
   institution === "iba"
     ? "/logo/logo-iba.png"
     : institution === "asermpharma"
     ? "/logo/logo-asermpharma.png"
     : "/logo/default-logo.png"; // Logo par défaut si aucune institution ne correspond style={{ width: '210mm', height: '297mm' }}
  return (
    <div ref={ref} className="wrapper" >
      <div className="p-6 rounded-lg shadow text-black print:shadow-none" style={{ fontSize: '12px' }}>
        {/* Header */}
        <div className="flex justify-between mb-8">
          
          {setting && (
            <div>
              <p className="uppercase font-bold">{setting.company_name}</p>
              <p>{setting.address}</p>
              <p>{setting.phone}</p>
              <p>{setting.email}</p>
              
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold"> BON DE RECLAMATION</h1>
          </div>
          <div>
            <h1 className="text-gray-500 font-bold">TAMPON & SIGNATURE</h1>
            <textarea 
            className="w-full mb-4 border rounded"
            />
          </div>
        </div>
        <p className="font-bold">Date: {new Date(claim.createdAt ).toLocaleDateString()}</p>
        {/* Table des produits */}
        <table className="table1">
          <thead>
            <tr className="border bg-gray-50">
              <th className="text-center p-2 border">DESIGNATION</th>
              <th className="text-center p-2 border">Code produit</th>
              <th className="text-center p-2 border">Qté</th>
              <th className="text-center p-2 border">Prix Grossiste</th>
              <th className="text-center p-2 border">Montant réclamation</th>
              <th className="text-center p-2 border">N° Facture</th>
              <th className="text-center p-2 border">Date de la commande</th>
              <th className="text-center p-2 border">Nature de la réclamation</th>
              <th className="text-center p-2 border">Réponse</th>
            </tr>

          </thead>
          <tbody> 
            
              <tr className="border hover:bg-gray-50">
                <td className="py-2 text-center">{
              claim.invoice?.items?.find((item:any) => item.productId === claim.productId)?.product?.designation ?? "Produit inconnu"
             }</td>
                <td className="py-2 text-center border">{
              claim.invoice?.items?.find((item:any) => item.productId === claim.productId)?.product?.EANCode ?? "Produit inconnu"
             }</td>
                <td className="py-2 text-center border">{claim.quantity}</td>
                <td className="py-2 text-center border">{claim.unitPrice} FCFA</td>
                <td className="py-2  text-center border">{claim.totalAmount} FCFA</td>
                <td className="py-2 text-center border">{claim.invoice?.invoiceNumber}</td>
                <td className="py-2  text-center border">{new Date(claim.invoice?.createdAt ).toLocaleDateString()}</td>
                <td className="py-2  text-center border">{claim.reason}</td>
                <td className="py-2  text-center border"><span className={`px-2 py-1 rounded text-white ml-2 ${claim.response?.status === 'ACCEPTED' ? 'bg-green-500' : claim.response?.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                    {claim.response?.status || "PENDING"}
                </span></td>
              </tr>
          
          </tbody>
        </table>


        {/* Totaux */}
        
      </div>
    </div>
  );
});

const PrintUserSheet = ({ claim }: any) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const handlePrint = useReactToPrint({ contentRef });

	return (
		<div>
			
        <div>
           <div className="hidden">
             <PrintToPdf ref={contentRef} claim={claim} />
           </div>
             <Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500" onClick={handlePrint}>
               Imprimer
             </Button>
        </div>
			
		</div>
	);
};

export default PrintUserSheet;

{/* <th className="text-center p-2 border w-[15%]">DESIGNATION</th>
              <th className="text-center p-2 border w-[8%]">Code produit</th>
              <th className="text-center p-2 border w-[5%]">Qté</th>
              <th className="text-center p-2 border w-[10%]">Prix Grossiste</th>
              <th className="text-center p-2 border w-[12%]">Montant réclamation</th>
              <th className="text-center p-2 border w-[10%]">N° Facture</th>
              <th className="text-center p-2 border w-[12%]">Date de la commande</th>
              <th className="text-center p-2 border w-[15%]">Nature de la réclamation</th>
              <th className="text-center p-2 border w-[13%]">Réponse</th> */}