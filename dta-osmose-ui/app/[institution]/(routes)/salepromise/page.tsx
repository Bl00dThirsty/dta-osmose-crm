
"use client";

import { useState, useEffect } from 'react';
import { useGetProductsQuery, useCreateSalePromiseMutation, useGetSalePromiseQuery } from '@/state/api';
import { useGetCustomersQuery } from '@/state/api';
import { useGetUsersQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";


export interface Product {
  id: string;
  designation: string;
  sellingPriceTTC: number;
  quantity: number;
}
export interface salePromiseProduct{
  id: number;
  product_id: string;
  product_quantity: number;
  product_sale_price: number;
  totalPrice: number;
}
export interface salePromise {
  dueDate: Date;
  reminderDate: Date;
  customerId: number;
  userId?: number;
  customerCreatorId?:  number;
  saleId?: string;
  institutionId?: string;
  customer_address: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  discount: number;
  note: string;
  items: salePromiseProduct[];
}


const CreateSalePage = () => {
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    id: string;
    designation: string;
    product_quantity: number;
    product_sale_price: number;
    totalPrice: number;
  }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  
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

  useEffect(() => {
    // Accéder à localStorage uniquement côté client
    const idFromStorage = localStorage.getItem("id");
    setCurrentUserId(idFromStorage ? parseInt(idFromStorage) : null);
  }, []);

   useEffect(() => {
    // Accéder à localStorage uniquement côté client
    const idFromStorage = localStorage.getItem("id");
    setCurrentUserId(idFromStorage ? parseInt(idFromStorage) : null);
  }, []);
   const handleCustomerChange = (selectedId: number) => {
    setCustomerId(selectedId);
  };

  const [createSale] = useCreateSalePromiseMutation();
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

  const total = selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  const total_amount = total - discount;

  const handleAddProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id 
            ? { ...p, quantity: p.product_quantity + 1, totalPrice: (p.product_quantity + 1) * p.product_sale_price } 
            : p
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          designation: product.designation,
          product_quantity: 1,
          product_sale_price: product.sellingPriceTTC,
          totalPrice: product.sellingPriceTTC
        }
      ];
    });
  };

  const handleQuantityChange = (id: string, product_quantity: number) => {
    if (product_quantity < 1) return;
    
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === id 
          ? { ...p, product_quantity, totalPrice: product_quantity * p.product_sale_price } 
          : p
      )
    );
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  };

  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [useTemporaryCustomer, setUseTemporaryCustomer] = useState(false);
  const [tempCustomer, setTempCustomer] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
  });

  const handleCreateSale = async () => {
    if ( !currentUserId || selectedProducts.length === 0) return;
    
    try {
      const result = await createSale({
        customerId: useTemporaryCustomer ? undefined : customerId!, // tu passes 0 si pas de compte
        userId: currentUserId ?? 0,
        customerCreatorId: isParticulier ? customerId ?? undefined : undefined,
        items: selectedProducts.map(p => ({
          product_id: p.id, // ⚠️ attention aux clés → doit correspondre au backend
          product_quantity: p.product_quantity,
          product_sale_price: p.product_sale_price
        })),
        discount,
        dueDate: dueDate!,
        reminderDate: reminderDate!,
        note,
        customer_address: useTemporaryCustomer ? tempCustomer.customer_address : undefined,
        customer_name: useTemporaryCustomer ? tempCustomer.customer_name : undefined,
        customer_phone: useTemporaryCustomer ? tempCustomer.customer_phone : undefined,
        institution
      }).unwrap();
      
      toast.success("Promesse d'achat enregistrée avec succès");
      router.push(`/${institution}/salepromise/${result.id}`);
    } catch (error) {
      console.log('Erreur création vente:', error);
      toast.error("Échec de l'enregistrement");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Promesse d'achat</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des produits */}
        <div className="lg:col-span-2 bg-gray p-4 rounded-lg shadow">
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
             {currentProducts.map(product => (
            <div 
               key={product.id} 
               className="border p-3 rounded cursor-pointer hover:bg-gray-50 hover:text-red-700"
               onClick={() => handleAddProduct(product)}
            >
            <h3 className="font-medium">{product.designation}</h3>
            <p>Prix: {product.sellingPriceTTC} FCFA</p>
            <p>Stock: {product.quantity}</p>
            </div>
           ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="px-3 py-1 bg-blue-500 text-white-500 rounded disabled:opacity-50"
  >
    ← Précédent
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-gray' : 'bg-gray-200'}`}
    >
      {i + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="px-3 py-1 bg-blue-500 text-white-500 rounded disabled:opacity-10"
  >
    Suivant →
  </button>
</div>


        </div>
        
        {/* Panier */}
        <div className="bg-gray p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
          
          <div className="mb-4">
  <label className="block mb-2">Client</label>

  {isParticulier && currentCustomer ? (
    <div className="p-2 border rounded bg-gray-100">
      <p>{currentCustomer.name} - {currentCustomer.phone}</p>
    </div>
  ) : (
    <>
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={useTemporaryCustomer}
          onChange={() => setUseTemporaryCustomer(!useTemporaryCustomer)}
        />
        <span className="ml-2">Le client n'est pas enregistré</span>
      </div>

      {useTemporaryCustomer ? (
        <div className="space-y-2">
          <Input
            placeholder="Nom du client"
            value={tempCustomer.customer_name}
            onChange={(e) => setTempCustomer({ ...tempCustomer, customer_name: e.target.value })}
          />
          <Input
            placeholder="Téléphone du client"
            value={tempCustomer.customer_phone}
            onChange={(e) => setTempCustomer({ ...tempCustomer, customer_phone: e.target.value })}
          />
          <Input
            placeholder="Adresse du client"
            value={tempCustomer.customer_address}
            onChange={(e) => setTempCustomer({ ...tempCustomer, customer_address: e.target.value })}
          />
        </div>
      ) : (
        <select
          className="w-full p-2 border rounded"
          value={customerId || ''}
          onChange={(e) => handleCustomerChange(Number(e.target.value))}
        >
          <option value="">Sélectionner un client</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.phone}
            </option>
          ))}
        </select>
      )}
    </>
  )}
</div>

{/* Champ note */}
<div className="mb-4">
  <label className="block mb-2">Note</label>
  <textarea
    className="w-full p-2 border rounded"
    value={note}
    onChange={(e) => setNote(e.target.value)}
  />
</div>

{/* Champ dates */}
<div className="mb-4 grid grid-cols-2 gap-4">
  <div>
    <label className="block mb-2">Date d’échéance</label>
    <Input
      type="date"
      value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
      onChange={(e) => setDueDate(new Date(e.target.value))}
    />
  </div>
  <div>
    <label className="block mb-2">Date de rappel</label>
    <Input
      type="date"
      value={reminderDate ? reminderDate.toISOString().split("T")[0] : ""}
      onChange={(e) => setReminderDate(new Date(e.target.value))}
    />
  </div>
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
                      <input
                        type="number"
                        min="1"
                        value={item.product_quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded"
                      />
                    </td>
                    <td className="py-2">{item.product_sale_price} </td>
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
              <span>{total_amount} FCFA</span>
            </div>
            
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
            
            <div className="flex justify-between font-bold text-lg">
              <span>Montant final:</span>
              <span>{total_amount} FCFA</span>
            </div>
            
            <button
              onClick={handleCreateSale}
              disabled={ selectedProducts.length === 0}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Ajouter une promesse d'achat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSalePage;