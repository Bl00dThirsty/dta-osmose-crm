"use client";
import { useGetActivePromotionsQuery, useDeletePromotionsMutation, useUpdatePromotionsMutation } from "@/state/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PromotionsPage() {
  const { institution } = useParams() as { institution: string };
  const { data: promotions, isLoading, error } = useGetActivePromotionsQuery({ institution });
  const [deletePromotion] = useDeletePromotionsMutation();
  const router = useRouter();

  const logoSrc =
    institution === "iba"
      ? "/logo/defaut-iba.jpg"
      : institution === "asermpharma"
      ? "/logo/defaut-aserm.jpg"
      : "/logo/default-logo.png";

  if (isLoading) return <p>Chargement des promotions...</p>;
  if (error) return <p>Vous n'avez pas accès à ces informations. Erreur lors du chargement des promotions.</p>;

  const handleDelete = async (id: string) => {
    try {
      await deletePromotion(id).unwrap();
      toast.success("Promotion supprimée, Réactualisez la page ✅");
      //router.push(`/${institution}/promotions/allInprogress`);
      router.refresh(); // recharger la liste
    } catch (err) {
      toast.error("Erreur lors de la suppression ❌");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/${institution}/promotions/${id}`); 
    // 👆 Ouvre la page de details d'une promotion et il y a le bouton de modifier 
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🔥 Promotions en cours</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {promotions?.map((promo) => {
          const discountPrice = (promo.product?.sellingPriceCFA ?? 0) * (1 - promo.discount / 100);
          return (
            <Card key={promo.id} className="relative shadow-lg rounded-2xl overflow-hidden">
              <Badge className="absolute top-8 left-3 bg-red-500">-{promo.discount}%</Badge>

              {/* Actions en haut à droite */}
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(promo.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(promo.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </Button>
              </div>

              <CardHeader>
                <CardTitle className="truncate font-bold">{promo.product?.designation}</CardTitle>
              </CardHeader>

              <CardContent>
                <img
                  src={logoSrc}
                  alt={promo.product?.designation}
                  className="w-full h-40 object-cover rounded-lg"
                />

                <div className="mt-4 text-center">
                  <p className="line-through text-gray-500">{promo.product?.sellingPriceCFA.toFixed(2)} €</p>
                  <p className="text-xl font-bold text-green-600">{discountPrice.toFixed(2)} €</p>
                </div>

                {promo.title && (
                  <p className="mt-2 text-sm text-gray-600 italic">{promo.title}</p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  Valable jusqu’au {new Date(promo.endDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
