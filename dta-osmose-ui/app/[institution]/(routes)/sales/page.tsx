// pages/sales/create.tsx
"use client";

import { useState, useEffect } from 'react';
import { useGetProductsQuery, useCreateSaleMutation } from '@/state/api';
import { useGetCustomersQuery } from '@/state/api';
import { useGetUsersQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";

export interface Product {
  id: string;
  designation: string;
  sellingPriceTTC: number;
}
export interface SaleItemCreateInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface NewSaleInvoice {
  customerId: number;
  userId: number;
  institutionId: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
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
  const [discount, setDiscount] = useState(0);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { institution } = useParams() as { institution: string }
  const { data: products = [], isLoading } = useGetProductsQuery({ institution });
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: users= [] } = useGetUsersQuery();
  const user = users[0];
  const [createSale] = useCreateSaleMutation();
  const router = useRouter();

  const filteredProducts = products.filter(product =>
    product.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalAmount = totalAmount - discount;

  const handleAddProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
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

  const handleCreateSale = async () => {
    if (!customerId || !user?.id || selectedProducts.length === 0) return;
    
    try {
      const result = await createSale({
        data: {
          customerId,
          userId: user.id,
          totalAmount,
          finalAmount,
          items: selectedProducts.map(p => ({
            id: p.id,
            productId: p.id,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            totalPrice: p.totalPrice,
            
          })),
          discount
        },
        institution
      }).unwrap();
      
      
      router.push(`/${institution}/sales/${result.id}`);
    } catch (error) {
      console.log('Failed to create sale:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Vente</h1>
      
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
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="border p-3 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => handleAddProduct(product)}
              >
                <h3 className="font-medium">{product.designation}</h3>
                <p>Prix: {product.sellingPriceTTC} FCFA</p>
                <p>Stock: {product.quantity}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Panier */}
        <div className="bg-gray p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
          
          <div className="mb-4">
            <label className="block mb-2">Client</label>
            <select 
              className="w-full p-2 border rounded"
              value={customerId || ''}
              onChange={(e) => setCustomerId(Number(e.target.value))}
            >
              <option value="">Sélectionner un client</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
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
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded"
                      />
                    </td>
                    <td className="py-2">{item.unitPrice} FCFA</td>
                    <td className="py-2">{item.totalPrice} FCFA</td>
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
              <span>{finalAmount} FCFA</span>
            </div>
            
            <button
              onClick={handleCreateSale}
              disabled={!customerId || selectedProducts.length === 0}
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