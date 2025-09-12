// pages/sales/create.tsx
"use client";

import { useState, useEffect } from 'react';
import { useGetProductsQuery, useCreateSaleMutation, useGetCustomerDebtStatusQuery, useGetActivePromotionsQuery, useGetSalePromiseByIdQuery } from '@/state/api';
import { useGetCustomersQuery } from '@/state/api';
import { useGetUsersQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";


export interface Product {
  id: string;
  designation: string;
  sellingPriceTTC: number;
  quantity: number;
}
export interface SaleItemCreateInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface NewSaleInvoice {
  customerId: number;
  userId?: number;
  customerCreatorId?: number;
  institutionId: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  salePromiseId?: number;
  items: SaleItemCreateInput[];
}


const CreateSalePage = () => {
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    id: string;
    designation: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const params = useSearchParams();
  const [discount, setDiscount] = useState(0);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { institution } = useParams() as { institution: string }
  const { data: products = [], isLoading } = useGetProductsQuery({ institution });
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: users= [] } = useGetUsersQuery();
  const user = users[0];
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userRole === "Particulier";
  const userId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;
  const salePromiseId = params?.get("salePromiseId");
  const { data: salePromise } = useGetSalePromiseByIdQuery(Number(salePromiseId), {
    skip: !salePromiseId,
  });

  //dette de plus d'un mois d'un customer
 const { data: debtStatus } = useGetCustomerDebtStatusQuery(
  { 
    customerId: customerId!, 
    institution: institution 
  },
  {
    skip: !customerId // Ne s'exécute que si customerId est défini
  }
);

//promotion valide
 const { data: activePromotions = [] } = useGetActivePromotionsQuery({institution});
 const getPromoForProduct = (productId: string) => {
  return activePromotions.find(promo => promo.productId === productId && promo.status);
};

   useEffect(() => {
    if (customerId) {
      //refetchDebtStatus();
    }
  }, [customerId]);

  useEffect(() => {
    // Accéder à localStorage uniquement côté client
    const idFromStorage = localStorage.getItem("id");
    setCurrentUserId(idFromStorage ? parseInt(idFromStorage) : null);
  }, []);
   const handleCustomerChange = (selectedId: number) => {
    setCustomerId(selectedId);
  };

  const [createSale] = useCreateSaleMutation();
  const router = useRouter();

  const filteredProducts = products.filter(product =>
    product.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentCustomer = customers.find(c => c.id === Number(userId));
  useEffect(() => {
    const idFromStorage = localStorage.getItem("id");
    const numericId = idFromStorage ? parseInt(idFromStorage) : null;
    setCurrentUserId(numericId);
  
    if (userRole === "Particulier" && numericId) {
      setCustomerId(numericId); // C’est ici que le customerId est défini automatiquement
    }
  }, []);
  
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const totalAmount = selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalAmount = totalAmount - discount;

  const handleAddProduct = (product: Product) => {
    if (product.quantity <= 0) {
      toast.error(`Le produit "${product.designation}" est en rupture de stock !`);
      return; // Empêche d'ajouter un produit avec un stock de 0
    }
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        // if (existing.quantity + 1 > product.quantity) {
        //         toast.error(`La quantité demandée pour "${product.designation}" dépasse le stock disponible !`);
        //         return prev; // Retourne l'ancien état sans modification
        // }
        return prev.map(p =>
          p.id === product.id 
            ? { ...p, quantity: p.quantity + 1, totalPrice: (p.quantity + 1) * p.unitPrice } 
            : p
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          designation: product.designation,
          quantity: 1,
          unitPrice: product.sellingPriceTTC,
          totalPrice: product.sellingPriceTTC
        }
      ];
    });
  };
  
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === id 
          ? { ...p, quantity, totalPrice: quantity * p.unitPrice } 
          : p
      )
    );
  };


const handleRemoveProduct = (id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
};

// Pré-remplissage en cas de promesse de vente
useEffect(() => {
  if (!salePromise) return;
  setCustomerId(salePromise.customerId ?? null);
  setSelectedProducts(
    salePromise.items.map((it: any) => ({
      id: it.product.id,
      designation: it.product.designation,
      quantity: it.product_quantity,
      unitPrice: it.product_sale_price,
      totalPrice: it.product_quantity * it.product_sale_price,
    }))
  );
}, [salePromise]);

  const handleCreateSale = async () => {
    if (!customerId || selectedProducts.length === 0) {
      
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    };
  // Vérification explicite des IDs
    const creatorId = currentUserId || customerId;
    if (!creatorId) return; // Au moins un des deux doit exister

  
    try {
      const result = await createSale({
        customerId,
        userId: currentUserId ?? 0, // Fournit une valeur par défaut si null
        customerCreatorId: isParticulier ? customerId : undefined, // Peut être null si userId est défini
        items: selectedProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
        })),
        discount,
        paymentMethod: "mobile",
        salePromiseId: salePromise ? salePromise.id : undefined,
        institution: institution, // L'institution actuelle
      }).unwrap();
  
      toast.success("Vente enregistrée avec succès");
      router.push(`/${institution}/sales/${result.id}`);
    } catch (error) {
      console.log("Erreur création vente:");
      toast.error("Échec de l'enregistrement");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Vente</h1>

            {activePromotions.length > 0 && (
  <div className="relative mb-5 mx-auto w-fit animate-fade-in animate-pulse">
    <div className="bg-yellow-100 border-2 border-yellow-500 rounded-xl p-4 shadow-lg relative max-w-md">
      <div className="absolute -top-3 left-6 w-6 h-6 bg-yellow-100 border-t-2 border-l-2 border-yellow-200 transform rotate-45"></div>
      
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-yellow-800">🎉 Des promotions sont disponible ! Profitez-en avant la fin 🎉</h3>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-1 left-1/4 w-1/2 h-2 bg-red-100 blur-sm opacity-70"></div>
  </div>
)}
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Liste des produits */}
        <div className="lg:col-span-3 bg-gray p-4 rounded-lg shadow">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentProducts.map(product => {
              const promo = getPromoForProduct(product.id);
                const finalPrice = promo 
                  ? product.sellingPriceTTC * (1 - promo.discount / 100) 
                  : product.sellingPriceTTC;

              return (
                  <div
                    key={product.id}
                    className={`border p-3 rounded cursor-pointer  ${
                     product.quantity <= 0
                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                         : "hover:bg-gray-50 hover:text-red-700"
                    }`}
                   onClick={() => product.quantity > 0 && handleAddProduct({
                   ...product,
                    sellingPriceTTC: finalPrice // ⚡️ Utiliser le prix promo si actif
                   })}
                   >
                {promo ? ( 
                  <Badge className="top-3 left-3 bg-red-500">-{promo.discount}%</Badge>
                ) :(
                 <p> </p>
                )}
              <h3 className="font-bold">{product.designation}</h3>

              {promo ? (
                <p>
                  <span className="line-through text-gray-500 mr-2">
                     {product.sellingPriceTTC} F
                  </span>
                  <span className="text-green-600 font-bold mr-2">{finalPrice.toFixed(2)} F</span>
          {/* <span className='text-red-600'>-{promo.discount}%</span>⚠️ */}
                </p>
              ) : (
                <p>Prix: {product.sellingPriceTTC} F</p>
              )}

                <p className="font-normal text-gray-500">
                Stock: {product.quantity}{" "}
                {product.quantity <= 0 && (
                  <span className="text-red-500 font-bold">(Épuisé)</span>
                )}
                </p>
            </div>
         );
        })}

          </div>
          <div className="flex justify-center mt-4 space-x-2">
  <Button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    <ChevronLeft/> Précédent
  </Button>

  {Array.from({ length: totalPages }, (_, i) => (
    <Button
      key={i + 1}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'text-gray' : 'bg-gray-200'}`}
    >
      {i + 1}
    </Button>
  ))}

  <Button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Suivant <ChevronRight/>
  </Button>
</div>


        </div>
        
        {/* Panier */}
        <div className="lg:col-span-2 bg-gray p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
          
          {/* <div className="mb-4">
            <label className="block mb-2">Client</label>
            <select 
              className="w-full p-2 border rounded"
              value={customerId || ''}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                setCustomerId(selectedId);
                refetchDebtStatus(); // Vérifie la dette après sélection
              }}
            >
              <option value="">Sélectionner un client</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div> */}
          <div className="mb-4">
            <label className="block mb-2">Client</label>
  
            {isParticulier && currentCustomer ? (
                 // Si c'est un client connecté
                <div className="p-2 border rounded">
                   <p>{currentCustomer.name} - {currentCustomer.phone}</p>
                </div>
            ) : (
                // Sinon, sélection classique
            <select 
                className="w-full p-2 border rounded"
                value={customerId || ''}
                onChange={(e) => handleCustomerChange(Number(e.target.value))}
                // onChange={(e) => handleCustomerChange(Number(e.target.value))}
            >
           <option value="">Sélectionner un client</option>
            {customers.map(customer => (
           <option key={customer.id} value={customer.id}>
            {customer.name} - {customer.phone}
          </option>
          ))}
         </select>
         )}
        </div>

          
          <div className="mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Produit</th>
                  <th className="text-left py-2">Qté</th>
                  <th className="text-left py-2">Prix</th>
                  <th className="text-left py-2">Total</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.designation}</td>
                    <td className="py-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded"
                      />
                    </td>
                    <td className="py-2">{item.unitPrice} </td>
                    <td className="py-2">{item.totalPrice} </td>
                    <td className="py-2">
                      <button 
                        onClick={() => handleRemoveProduct(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span>{totalAmount} FCFA</span>
            </div>
            {!isParticulier && (
            <div className="flex justify-between">
              <label className="font-medium">Remise:</label>
              <Input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-24 p-1 border rounded text-right"
              />
            </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Montant final:</span>
              <span>{finalAmount} FCFA</span>
            </div>

            {debtStatus?.hasDebt && (
  <div className="relative mb-8 mx-auto w-fit animate-fade-in">
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-lg relative max-w-md">
      <div className="absolute -top-3 left-6 w-6 h-6 bg-red-50 border-t-2 border-l-2 border-red-200 transform rotate-45"></div>
      
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="bg-red-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-red-800">Commande bloquée</h3>
          <p className="text-gray-700">
            Ce client a une ou plusieurs factures impayées datant de plus d’un mois.
            <br />
            Il ne peut pas passer de nouvelle commande tant que ces factures ne sont pas réglées.
          </p>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-1 left-1/4 w-1/2 h-2 bg-red-100 blur-sm opacity-70"></div>
  </div>
)}
            
            <button
              onClick={handleCreateSale}
              disabled={!customerId || selectedProducts.length === 0 || debtStatus?.hasDebt}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Vendre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSalePage;