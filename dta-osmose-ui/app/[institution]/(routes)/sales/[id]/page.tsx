// pages/sales/[id].tsx
"use client";

import { useGetSaleByIdQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { Row } from "@tanstack/react-table"
import { useGetSettingsQuery } from '@/state/api';

const InvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { institution } = useParams<{ institution: string }>();
  //console.log('Institution from params:', institution);
  const { data: settings = [] } = useGetSettingsQuery({ institution });
  //const { id } = (row.original as any);
 
  const { data: sale, isLoading } = useGetSaleByIdQuery(id);

  const handlePrint = () => {
    window.print();
  };
  const setting = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;

  if (isLoading) return <div>Chargement...</div>;
  if (!sale) return <div>Facture non trouvée</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow text-gray-500 print:shadow-none">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Facture #{sale.invoiceNumber}</h1>
            <p className="text-gray-500">Date: {new Date(sale.createdAt ).toLocaleDateString()}</p>
          </div>
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 print:hidden"
          >
            Imprimer
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-bold mb-2">Vendeur</h2>
            <p>{sale.user.firstName} {sale.user.lastName}</p>
            {setting && (
              <>
                <p>{setting.company_name?.toUpperCase()}</p>
                <p>{setting.phone}</p>
                <p>{setting.email}</p>
                <p>{setting.website}</p>
              </>
            )}
          </div>
          <div>
            <h2 className="font-bold mb-2">Client</h2>
            <p>{sale.customer.name}</p>
            <p>{sale.customer.phone}</p>
            {sale.customer.email && <p>{sale.customer.email}</p>}
          </div>
        </div>
        
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Produit</th>
              <th className="text-right py-2">Qté</th>
              <th className="text-right py-2">Prix unitaire</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.product?.designation}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{item.unitPrice} FCFA</td>
                <td className="py-2 text-right">{item.totalPrice} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
        
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
};

export default InvoicePage;