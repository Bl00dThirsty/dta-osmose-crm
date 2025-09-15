"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCustomersMutation, useCreateReportMutation } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Container from "../components/ui/Container";
import { AddCustomerDialog } from "../crm/components/AddCustomer"

type CustomerFormData = {
  customId: string;
  name: string;
  userName: string;
  phone: string;
  nameresponsable?: string;
  email: string;
  password: string;
  ville?: string;
  website: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string;
}

const CreatePromotion = () => {
  const router = useRouter();
  const [createCustomer] = useCreateCustomersMutation()
  const handleCreateProduct = async (customerData: CustomerFormData) => {
    await createCustomer(customerData);
  }
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const { institution } = useParams() as { institution: string };

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  const [ prospectName, setprospectName] = useState("");
  const [address, setaddress] = useState("");
  const [contact, setcontact] = useState("");
  const [responsable, setresponsable] = useState("");
  const [email, setemail] = useState("");
  const [degree, setdegree] = useState("");
  const [pharmacoVigilance, setpharmacoVigilance] = useState("");
  const [time, settime] = useState("");
  const [rdvObject, setrdvObject] = useState("");
  const [date, setdate] = useState("");
  const [nextRdv, setnextRdv] = useState("");
  const [createReport] = useCreateReportMutation();


  const handleSubmit = async () => {
    if (!prospectName || !address || !rdvObject || !date || !nextRdv) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const result = await createReport({
        institution,
        prospectName,
        rdvObject,
        responsable,
        degree,
        address,
        time,
        contact,
        email,
        pharmacoVigilance,
        date: new Date(date),
        nextRdv: new Date(nextRdv),
      }).unwrap();

      toast.success("Promotion enregistrée avec succès !");
      router.push(`/${institution}/report/${result.id}`);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
      console.error(error);
    }
  };

  return (
    <Container
          //title="Paramètres de l'entreprise"
          title="Création d'un rapport"
          description="Ici vous enregistrez les rapports après une prospection"
    >
      {/* Conteneur pour le message et le bouton */}
   <div className="flex justify-end mb-4">
       <div className="text-right">
           <p className=" text-red-600 font-medium">
             Si vous voulez ajouter le prospect comme nouveau client
           </p>
           <AddCustomerDialog onCreate={handleCreateProduct} />
        </div>
    </div>
            
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Créer une nouveau rapport</CardTitle>
        
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="max-w-4xl mx-auto p-4 rounded border">

         <div>
            <Label className="mb-2">Date de la rencontre*</Label>
            <Input className="mb-5" type="date" value={date} onChange={(e) => setdate(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Nom du Prospect*</Label>
            <Input className="mb-5" placeholder="Ajouter un nom" value={prospectName} onChange={(e) => setprospectName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Contact*</Label>
            <Input className="mb-5" placeholder="Ajouter un numero" value={contact} onChange={(e) => setcontact(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Adresse*</Label>
            <Input className="mb-5" placeholder="Ajouter une adresse" value={address} onChange={(e) => setaddress(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">email*</Label>
            <Input className="mb-5" placeholder="Ajouter une adresse mail" value={email} onChange={(e) => setemail(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Nom de l'interlocuteur</Label>
            <Input className="mb-5" placeholder="Ajouter le nom et le poste de l'interlocuteur" value={responsable} onChange={(e) => setresponsable(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Objet du RDV*</Label>
            <Textarea className="mb-5" placeholder="Ajouter un objet" value={rdvObject} onChange={(e) => setrdvObject(e.target.value)} />
          </div>
         
          <div>
            <Label className="mb-2">Date du prochain RDV</Label>
            <Input className="mb-5" type="date" value={nextRdv} onChange={(e) => setnextRdv(e.target.value)} />
          </div>

          <div>
            <Label className="mb-2">Heure du prochain RDV</Label>
            <Input className="mb-5" placeholder="12:00" value={time} onChange={(e) => settime(e.target.value)} />
          </div>

          <div>
            <Label className="mb-2">Pharmaco-Vigilance</Label>
            <Textarea className="mb-5" placeholder="Ajouter un descriptif" value={pharmacoVigilance} onChange={(e) => setpharmacoVigilance(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Dégré</Label>
            <Input className="mb-5" placeholder="Ajouter un dégré pour le prospect" value={degree} onChange={(e) => setdegree(e.target.value)} />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} className="justify-content-center">Enregistrer</Button>
      </CardFooter>
    </Card>
</Container>
  );
};

export default CreatePromotion;
