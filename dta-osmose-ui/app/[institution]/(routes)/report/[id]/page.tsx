"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetReportByIdQuery, useGetUsersQuery } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Container from "../../components/ui/Container";
import PrintreportSheet  from "./imprim"


const ReportPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { institution } = useParams<{ institution: string }>();
  const { data: report, isLoading } = useGetReportByIdQuery(Number(id));
  const [open, setOpen] = useState(false);
  const handleGoBack = () => router.back();
  const NomSrc =
   institution === "iba"
     ? "IBA BEAUTY CAMEROON"
     : institution === "asermpharma"
     ? "ASERMPHARMA"
     : "PAS DE NOM";

  return(
    <div className="space-y-6">
       <div className=" flex justify-between items-center p-4 mb-4">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
         <ArrowLeft className="w-5 h-5" />
            Retour
          </Button>
          <PrintreportSheet report={report} />
        </div>
      <Card className="max-w-3xl mx-auto mt-6 shadow">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Rapport de Prospection du <b>{new Date(report?.createdAt || new Date()).toLocaleDateString()}</b></CardTitle> 
          <h1 className="text-2xl text-center mb-8">De <b>{report?.user?.firstName || "aucun"} {report?.user?.lastName || "aucun"}</b></h1>       
        </CardHeader>

        <CardContent className="space-y-2 border gap-8 py-4 ">
            <p><strong>Date de la rencontre :</strong>  {report?.date ? new Date(report.date).toLocaleDateString() : 'Non spécifiée'}</p>
            <p><strong>Commercial :</strong> {report?.user?.firstName || "aucun"} {report?.user?.lastName || "aucun"} de {NomSrc}</p>
        </CardContent>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            
            <div className="space-y-2">
                
              <p><strong>Nom du prospect :</strong> {report?.prospectName}</p>
              <p><strong>Nom de l'Interlocuteur :</strong> {report?.responsable}</p>
              <p><strong>Adresse :</strong> {report?.address}</p>  
            </div>
            <div className="space-y-2">
              <p><strong>Email du Prospect :</strong> {report?.email}</p>
              <p><strong> Contact Téléphonique:</strong> {report?.contact}</p>  
            </div>
        </CardContent>
        <CardContent className="space-y-2 gap-8 py-4 border">
            <p><strong>Objet de la rencontre :</strong>  {report?.rdvObject || 'Non spécifiée'}</p>
            <p><strong>Pharmaco-Vigilance :</strong> {report?.pharmacoVigilance || "Non spécifiée"} </p>
            <p><strong>Dégré :</strong>  {report?.degree || 'Non spécifiée'}</p>
        </CardContent>
        <CardContent className="space-y-2 gap-8 py-4">
            <p><strong>Date de la prochaine rencontre :</strong>  {report?.nextRdv ? new Date(report.nextRdv).toLocaleDateString() : 'Non spécifiée'}</p>
            <p><strong>Heure de la prochaine rencontre :</strong> {report?.time || "Non spécifiée"} </p>
        </CardContent>

      </Card>
 </div>
)
};
export default ReportPage;