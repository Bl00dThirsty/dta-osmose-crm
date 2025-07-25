"use client";

import React, { forwardRef, useRef } from "react";
import { useGetSaleByIdQuery, useGetSettingsQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button"

interface PrintToPdfProps {
    inventory: any;
}

const PrintToPdf = forwardRef<HTMLDivElement, PrintToPdfProps>(({ inventory }, ref) => {
  const { institution } = useParams<{ institution: string }>();
  const { data: settings = [] } = useGetSettingsQuery({ institution });
  const setting = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
  
   // Définir le logo en fonction de l'institution
   const logoSrc =
   institution === "iba"
     ? "/logo/logo-iba.png"
     : institution === "asermpharma"
     ? "/logo/logo-asermpharma.png"
     : "/logo/default-logo.png"; // Logo par défaut si aucune institution ne correspond
  return (
    <div ref={ref} className="container mx-auto p-4 max-w-4xl">
        <div className="p-6 rounded-lg shadow text-black print:shadow-none">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <img
              src={logoSrc}
              alt="Logo"
              //className="w-10 h-auto object-contain" // Ajustez la taille du logo
              style={{
                maxWidth: "100px", // Limite la largeur à 100px
                maxHeight: "100px", // Limite la hauteur à 100px
                objectFit: "cover"
              }}
            />
          </div>
          {setting && (
            <div>
              <p className="uppercase font-bold">{setting.company_name}</p>
              <p>{setting.address}</p>
              <p>{setting.phone}</p>
              <p>{setting.email}</p>
              
            </div>
          )}
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
          <p><strong>Titre :</strong> {inventory.titre}</p>
            <p><strong>Date :</strong> {new Date(inventory.createdAt! ).toLocaleDateString()}</p>
            <p><strong>Lieu (entrepôt) :</strong> {inventory.location}</p>
            
          </div>
          <div className="space-y-4">
            <p><strong>Initiateur :</strong> {inventory.user?.firstName} {inventory.user?.lastName}</p>
            <p><strong>Note :</strong> {inventory.note}</p>
            <p><strong>Date de dernière modification :</strong>{new Date(inventory.updatedAt!).toLocaleDateString()}</p>
            
          </div>
          </div>
        <table className="w-full mb-8 border">
          <thead>
            <tr className="border">
              <th className="text-center py-2 border">Produit</th>
              {/* <th className="text-center py-2 border">Qté</th> */}
              <th className="text-center py-2 border">Qté système</th>
              <th className="text-center py-2 border">Qté réelle</th>
              <th className="text-center py-2 border">Ecart</th>
              <th className="text-center py-2 border">Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {inventory.inventoryItems.map((item: any) => (
              <tr key={item.productId} className="border">
                <td className="py-2 text-center">{item.product?.designation}</td>
                {/* <td className="py-2 text-center border">{item.designation}</td> */}
                <td className="py-2 text-center border">{item.systemQty}</td>
                <td className="py-2 text-center border">{item.countedQty}</td>
                <td className="py-2 text-center border">{item.difference}</td>
                <td className="py-2 text-center border">{item.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
   );
});

const PrintInventorySheet = ({ inventory }: any) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const handlePrint = useReactToPrint({ contentRef });

	return (
		<div>
			
        <div>
           <div className="hidden">
             <PrintToPdf ref={contentRef} inventory={inventory} />
           </div>
             <Button className="text-white-500 px-4 py-2 rounded hover:bg-blue-500" onClick={handlePrint}>
               Imprimer
             </Button>
        </div>
			
		</div>
	);
};

export default PrintInventorySheet;