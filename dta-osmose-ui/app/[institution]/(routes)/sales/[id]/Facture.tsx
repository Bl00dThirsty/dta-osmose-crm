"use client";

import React, { forwardRef, useRef } from "react";
import { useGetSaleByIdQuery, useGetSettingsQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button"

interface PrintToPdfProps {
  sale: any;
}

const PrintToPdf = forwardRef<HTMLDivElement, PrintToPdfProps>(({ sale }, ref) => {
  const { institution } = useParams<{ institution: string }>();
  const { data: settings = [] } = useGetSettingsQuery({ institution });
  const setting = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;

  return (
    <div ref={ref} className="container mx-auto p-4 max-w-4xl">
      <div className="p-6 rounded-lg shadow text-black print:shadow-none">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Facture N°: {sale.invoiceNumber}</h1>
            <p className="text-gray-500">Date: {new Date(sale.createdAt).toLocaleDateString()}</p>
          </div>
          {setting && (
            <div>
              <p className="uppercase font-bold">{setting.company_name}</p>
              <p>{setting.phone}</p>
              <p>{setting.email}</p>
              <p>{setting.website}</p>
            </div>
          )}
        </div>

        {/* Informations Client */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-bold mb-2">Client</h2>
            <p>ID: {sale.customer.customId}</p>
            <p>Nom: {sale.customer.name}</p>
            <p>Téléphone: {sale.customer.phone}</p>
          </div>
        </div>

        {/* Table des produits */}
        <table className="w-full mb-8 border">
          <thead>
            <tr className="border">
              <th className="text-center py-2 border">Produit</th>
              <th className="text-center py-2 border">Qté</th>
              <th className="text-center py-2 border">Prix unitaire</th>
              <th className="text-center py-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item: any) => (
              <tr key={item.id} className="border">
                <td className="py-2 text-center border">{item.product?.designation}</td>
                <td className="py-2 text-center border">{item.quantity}</td>
                <td className="py-2 text-center border">{item.unitPrice} FCFA</td>
                <td className="py-2 text-center border">{item.totalPrice} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="ml-auto w-64 space-y-2">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{sale.totalAmount} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span>Remise:</span>
            <span>{sale.discount} FCFA</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{sale.finalAmount} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const PrintUserSheet = ({ sale }: any) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const handlePrint = useReactToPrint({ contentRef });

	return (
		<div>
			
        <div>
           <div className="hidden">
             <PrintToPdf ref={contentRef} sale={sale} />
           </div>
             <Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500" onClick={handlePrint}>
               Imprimera
             </Button>
        </div>
			
		</div>
	);
};

export default PrintUserSheet;