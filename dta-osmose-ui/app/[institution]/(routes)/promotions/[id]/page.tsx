"use client";
import { useGetPromotionsByIdQuery, useUpdatePromotionsMutation, useGetProductsQuery } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { useState } from "react"
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogCancel,
  DialogAction,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"

export default function PromotionsPage() {
  const { institution } = useParams() as { institution: string }
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { id } = useParams() as { id:string };
  const { data: promo, isLoading, error } = useGetPromotionsByIdQuery(id);
  useEffect(() => {
      if (!token) {
        router.push('/');
      }
  }, [token]);
  
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updatePromotion] = useUpdatePromotionsMutation()
   const { data: products = [] } = useGetProductsQuery({ institution });
   const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    discount: 0,
    productId: "",
  });
  
  const handleOpenUpdate = () => {
    
    setFormData({
      title: promo?.title || "",
      startDate: promo?.startDate
        ? new Date(promo?.startDate).toISOString().split("T")[0]
        : "",
      endDate: promo?.endDate
        ? new Date(promo?.endDate).toISOString().split("T")[0]
        : "",
      discount: promo?.discount || 0,
      productId: promo?.productId || "",
    });
    setOpenUpdate(true);
  };
  //const finalPrice = productPrice - (productPrice * discount) / 100;
  const selectedProduct = products.find((p: any) => String(p.id) === formData.productId);
  const productPrice = selectedProduct?.sellingPriceTTC ?? 0;

  // Calcul du prix final avec remise
  const finalPrice = productPrice - (productPrice * formData.discount) / 100;
  
  const handleUpdate = async () => {
    try {
      await updatePromotion({
        id,
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      }).unwrap();
      toast.success("Promotion mise à jour avec succès");
      setOpenUpdate(false);
      setTimeout(() => {
        router.push(`/${institution}/promotions/${id}`);
      }, 500);
    } catch (error) {
      console.error("Erreur update:", error);
      toast.error("Erreur lors de la mise à jour");
      setOpenUpdate(false);
    }
  };
  const logoSrc =
   institution === "iba"
     ? "/logo/defaut-iba.jpg"
     : institution === "asermpharma"
     ? "/logo/defaut-aserm.jpg"
     : "/logo/default-logo.png";
  const discountPrice = (promo?.product?.sellingPriceTTC ?? 0) * (1 - (promo?.discount ?? 0) / 100);
   return (
    <>
    <div className="space-y-6">
        <div className="max-w-3xl mx-auto mt-6 shadow justify-between items-center p-4">
          <div className="flex justify-between items-center p-4">
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            ← Retour
          </Button>
          <Button 
            onClick={handleOpenUpdate}
            className="ml-auto text-white hover:bg-orange-700"
            //disabled={isUpdating}
           >
            Modifier
          </Button>
        </div>
        
        <Card className="relative shadow-lg rounded-2xl overflow-hidden">
              <Badge className="absolute top-8 left-3 bg-red-500">-{promo?.discount}%</Badge>
              <CardHeader>
                <CardTitle className="truncate font-bold">{promo?.product?.designation}</CardTitle>
              </CardHeader>
              <CardContent>
                
                  <img
                    src={logoSrc}
                    alt={promo?.product?.designation}
                    className="w-full h-40 object-cover rounded-lg"
                  />
               
                <div className="mt-4 text-center">
                  <p className="line-through text-gray-500">{promo?.product?.sellingPriceTTC.toFixed(2)} F cfa</p>
                  <p className="text-xl font-bold text-green-600">{discountPrice.toFixed(2)} F cfa</p>
                </div>
                {promo?.title && <p className="mt-2 text-sm text-red-400 italic">{promo?.title}</p>}
                {/* <p className="text-xs text-gray-400 mt-1">
                  Valable jusqu’au {new Date(promo!.endDate).toLocaleDateString()}
                </p> */}
                {promo?.endDate && (
                  <p className="text-xm text-gray-400 mt-1">
                    Valable Du {new Date(promo.startDate).toLocaleDateString()} au {new Date(promo.endDate).toLocaleDateString()}
                  </p>
                )}
                <p className="mt-1">Statut: <button className={` px-2 py-1 rounded text-white ${promo?.status ? 'bg-green-500' : 'bg-red-500'}`}>{promo?.status ? "Active" : "Non Active"}</button></p>
                <p>Créateur : {promo?.user?.firstName} {promo?.user?.lastName}</p>
                <p>Remise de : {promo?.discount}%</p>
             </CardContent>
        </Card>
    </div>
    </div>
    <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le produit</DialogTitle>
              </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <Label htmlFor="title">Titre</Label>
                      <input
                        type="text"
                        placeholder="Ajouter un titre"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="border p-2 rounded"
                      />
                      <Label className="mb-2">Produit</Label>
                        <select
                          className="w-full border border-gray-300 rounded px-3 py-2 mb-5"
                          value={formData.productId ?? ""}
                          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        >
                        <option value="">-- Sélectionner --</option>
                          {products.map((p: any) => (
                            <option key={p.id} value={p.id}>
                                {p.designation} ({p.sellingPriceTTC} FCFA)
                            </option>
                          ))}
                        </select>
                       <Label htmlFor="role">Remise(%)</Label>
                       <input
                          type="number"
                          placeholder="Remise"
                          value={formData.discount}
                          onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                          className="border p-2 rounded"
                        />
                        {finalPrice && (
                        <div>
                            <Label className="mb-2">Prix final (après remise)</Label>
                                <input
                                    type="text"
                                    readOnly
                                    value={finalPrice > 0 ? `${finalPrice.toFixed(2)} FCFA` : ""}
                                    className="border p-2 rounded"
                                />
                        </div>
                       )}
                       <Label htmlFor="startDate">Date début</Label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) =>
                            setFormData({ ...formData, startDate: e.target.value })
                            }
                            className="border p-2 rounded"
                        />
    
                       <Label htmlFor="endDate">Date fin</Label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({ ...formData, endDate: e.target.value })
                          }
                          className="border p-2 rounded"
                        />                 
                  </div>
              <DialogFooter>
                <DialogCancel onClick={() => setOpenUpdate(false)}>Annuler</DialogCancel>
                <DialogAction onClick={handleUpdate}>Sauvegarder</DialogAction>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </>
   );
}

