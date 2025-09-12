"use client";

import React, { forwardRef, useRef } from "react";
import { useGetSaleByIdQuery, useGetSettingsQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";

interface PrintToPdfProps {
    report: any;
}

const PrintToPdf = forwardRef<HTMLDivElement, PrintToPdfProps>(({ report }, ref) => {
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
        <div className="h-full w-full overflow-x-auto">
            <h1 className="text-2xl text-center mb-5">RAPPORT DE PROSPECTION</h1>
            <div className="mb-5"> 
            <p>De : {report?.user?.firstName || "aucun"} {report?.user?.lastName || "aucun"}</p>
            <p>Fait le : {new Date(report?.createdAt || new Date()).toLocaleDateString()}</p>
        </div>
        </div>
        
        <Card className="">
        {/* <CardHeader>
          <CardTitle className="text-2xl text-center">RAPPORT DE PROSPECTION </CardTitle> 
               
        </CardHeader> */}
        
        <CardContent className="space-y-2 gap-8 py-4 ">
            <p><strong>Date de la rencontre :</strong>  {report?.date ? new Date(report.date).toLocaleDateString() : 'Non spécifiée'}</p>
            <p><strong>Commercial :</strong> {report?.user?.firstName || "aucun"} {report?.user?.lastName || "aucun"}</p>
        </CardContent>
        <CardContent className="space-y-2 gap-8 py-4 border">                
              <p><strong>Nom du prospect :</strong> {report?.prospectName}</p>
              <p><strong>Nom de l'Interlocuteur :</strong> {report?.responsable}</p>
              <p><strong>Adresse :</strong> {report?.address}</p>  
              <p><strong>Email du Prospect :</strong> {report?.email}</p>
              <p><strong> Contact Téléphonique:</strong> {report?.contact}</p>  
            
        </CardContent>
        <CardContent className="space-y-2 gap-8 py-4 border">
            <p><strong>Objet de la rencontre :</strong> {report?.rdvObject || 'Non spécifiée'} </p>
            <p><strong>Pharmaco-Vigilance :</strong> {report?.pharmacoVigilance || "Non spécifiée"}</p>
            <p><strong>Dégré :</strong>  {report?.degree || 'Non spécifiée'}</p>
        </CardContent>
        <CardContent className="space-y-2 gap-8 py-4">
            <p><strong>Date de la prochaine rencontre :</strong>  {report?.nextRdv ? new Date(report.nextRdv).toLocaleDateString() : 'Non spécifiée'}</p>
            <p><strong>Heure de la prochaine rencontre :</strong> {report?.time || "Non spécifiée"} </p>
        </CardContent>

      </Card>
    </div>
    </div>
   );
});

const PrintreportSheet = ({ report }: any) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef });

    return (
        <div>
            
        <div>
           <div className="hidden">
             <PrintToPdf ref={contentRef} report={report} />
           </div>
             <Button className="text-white-500 px-4 py-2 rounded hover:bg-orange-500" onClick={handlePrint}>
               Imprimer
             </Button>
        </div>
            
        </div>
    );
};

export default PrintreportSheet;