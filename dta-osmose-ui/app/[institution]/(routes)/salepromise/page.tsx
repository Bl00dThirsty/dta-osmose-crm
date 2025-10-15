"use client";

import { useState, useEffect, useMemo } from 'react';
import { useGetProductsQuery, useCreateSalePromiseMutation } from '@/state/api';
import { useGetCustomersQuery } from '@/state/api';
import { useGetUsersQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, PlusCircle } from 'lucide-react';
import { DatePicker } from "@/components/ui/date-picker";

export interface Product {
  id: string;
  designation: string;
  sellingPriceTTC: number;
  quantity: number;
  sellingPriceCFA: number;
}

export interface salePromiseProduct {
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
  customerCreatorId?: number;
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


// Cette fonction est un composant React qui gère la création de promesses d'achat
  // Elle permet aux utilisateurs de sélectionner des produits, choisir un client,
  // configurer les dates et enregistrer une promesse d'achat

const CreateSalePromisePage = () => {
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    id: string;
    designation: string;
    product_quantity: number;
    product_sale_price: number;
    totalPrice: number;
  }>>([]);
  
  const [discount, setDiscount] = useState(0);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { institution } = useParams() as { institution: string }
  
  // API Queries
  const { data: products = [], isLoading } = useGetProductsQuery({ institution });
  const { data: customers = [] } = useGetCustomersQuery({ institution });
  const { data: users= [] } = useGetUsersQuery();
  const user = users[0];
  const [createSalePromise] = useCreateSalePromiseMutation();
  
  // États utilisateur

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
  }, []);
  const isParticulier = userRole === "Particulier";

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('id'));
  }, []);
  

  
  // États du formulaire
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [useTemporaryCustomer, setUseTemporaryCustomer] = useState(false);
  const [tempCustomer, setTempCustomer] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
  });
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);


  const router = useRouter();

  // Initialisation utilisateur
  useEffect(() => {
    const idFromStorage = typeof window !== "undefined" ? localStorage.getItem("id") : null;
    setCurrentUserId(idFromStorage ? parseInt(idFromStorage) : null);

    if (userRole === "Particulier" && idFromStorage) {
      setCustomerId(parseInt(idFromStorage));
    }
  }, [userRole]);

  // Filtrage des produits
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(product =>
      product.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  // Calcul des totaux
  const totalAmount = selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalAmount = totalAmount - discount;

  // Handlers
  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast.error("Veuillez sélectionner un produit");
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      toast.error("Produit introuvable");
      return;
    }

    if (product.quantity <= 0) {
      toast.error(`Le produit "${product.designation}" est en rupture de stock !`);
      return;
    }

    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? {
                ...p,
                product_quantity: p.product_quantity + quantity,
                product_sale_price: product.sellingPriceTTC,
                totalPrice: (p.product_quantity + quantity) * product.sellingPriceTTC
              }
            : p
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          designation: product.designation,
          product_quantity: quantity,
          product_sale_price: product.sellingPriceTTC,
          totalPrice: product.sellingPriceTTC * quantity
        }
      ];
    });

    setSelectedProduct(null);
    setSearchTerm(""); // Réinitialiser la recherche après ajout
    setQuantity(1);
    toast.success("Produit ajouté");
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
    toast.success("Produit retiré");
  };

  const handleCreateSalePromise = async () => {
    // MÊME LOGIQUE QUE VOTRE CODE ORIGINAL
    if (!currentUserId || selectedProducts.length === 0 || !dueDate || !reminderDate) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const now = new Date();
    const maxDueDate = new Date();
    maxDueDate.setDate(now.getDate() + 30);
    
    if (dueDate > maxDueDate) {
      toast.error("La date d'échéance ne peut pas dépasser 30 jours.");
      return;
    }

    if (dueDate < now || reminderDate < now) {
      toast.error("La date d'échéance et de rappel doivent être dans le futur.");
      return;
    }

    try {
      const result = await createSalePromise({
        customerId: useTemporaryCustomer ? undefined : customerId!, // Même logique
        userId: currentUserId ?? 0, // Même logique
        customerCreatorId: isParticulier ? customerId ?? undefined : undefined, // Même logique
        items: selectedProducts.map(p => ({
          product_id: p.id,
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
      console.log('Erreur création promesse:', error);
      toast.error("Échec de l'enregistrement");
    }
  };

  const currentCustomer = customers.find(c => c.id === customerId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Promesse d'achat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle>Formulaire Promesse d'achat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Client */}
            <div>
              <Label>Client</Label>
              {isParticulier && currentCustomer ? (
                <div className="p-2 border rounded bg-gray-50">
                  <p className="font-medium">{currentCustomer.name} - {currentCustomer.phone}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={useTemporaryCustomer}
                      onChange={() => setUseTemporaryCustomer(!useTemporaryCustomer)}
                      className="mr-2"
                    />
                    <Label className="text-sm">Le client n'est pas enregistré</Label>
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
                    <Select value={customerId?.toString() || ""} onValueChange={val => setCustomerId(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name} - {c.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date d'échéance</Label>
                <DatePicker
                  label=""
                  date={dueDate ?? undefined}
                  onSelect={(date) => date && setDueDate(date)}
                />
              </div>
              <div>
                <Label>Date de rappel</Label>
                <DatePicker
                  label=""
                  date={reminderDate ?? undefined}
                  onSelect={(date) => date && setReminderDate(date)}
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <Label>Note</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Notes supplémentaires..."
              />
            </div>

            {/* Remise */}
            <div>
              <Label>Remise (FCFA)</Label>
              <Input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Montant de la remise"
              />
            </div>

            {/* Recherche produit */}
            <div className="space-y-3">
              <Label>Rechercher un produit</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tapez pour rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Liste des produits filtrés UNIQUEMENT quand il y a une recherche */}
              {searchTerm && filteredProducts.length > 0 && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className={`p-2 cursor-pointer hover:bg-gray-50 ${
                        product.quantity <= 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                      }`}
                      onClick={() => product.quantity > 0 && setSelectedProduct(product.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{product.designation}</span>
                        </div>
                        <div className="text-right">
                          <span>{product.sellingPriceTTC} F</span>
                          <div className="text-xs text-gray-500">
                            Stock: {product.quantity}
                            {product.quantity <= 0 && <span className="text-red-500 ml-1">(Épuisé)</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message si aucun produit trouvé */}
              {searchTerm && filteredProducts.length === 0 && (
                <div className="text-center p-2 text-muted-foreground text-sm">
                  Aucun produit trouvé
                </div>
              )}

              {/* Sélection produit */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Produit sélectionné</Label>
                  <Input
                    value={selectedProduct ? products.find(p => p.id === selectedProduct)?.designation || '' : ''}
                    readOnly
                    placeholder="Aucun produit sélectionné"
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    value={selectedProduct ? products.find(p => p.id === selectedProduct)?.quantity ?? 0 : 0}
                    readOnly
                    className="w-20 bg-gray-100"
                  />
                </div>
                <div>
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <Button className="mt-6" onClick={handleAddProduct}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Tableau produits */}
            <div className="mt-4">
              {selectedProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucun produit ajouté</p>
              ) : (
                <table className="w-full text-left text-sm border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2">Produit</th>
                      <th className="p-2">Quantité</th>
                      <th className="p-2">Prix Unitaire</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map(item => (
                      <tr key={item.id}>
                        <td className="p-2">{item.designation}</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.product_quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="w-16"
                          />
                        </td>
                        <td className="p-2">{item.product_sale_price.toFixed(2)} F</td>
                        <td className="p-2">{item.totalPrice.toFixed(2)} F</td>
                        <td className="p-2">
                          <Button variant="outline" size="sm" onClick={() => handleRemoveProduct(item.id)}>
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Totaux */}
            <div className="mt-4 space-y-1 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{totalAmount.toFixed(2)} F</span>
              </div>
              <div className="flex justify-between">
                <span>Remise:</span>
                <span>-{discount.toFixed(2)} F</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Montant final:</span>
                <span>{finalAmount.toFixed(2)} F</span>
              </div>
            </div>
            {/* Bouton créer promesse */}
            <Button
              className="mt-4 w-full"
              onClick={handleCreateSalePromise}
              disabled={selectedProducts.length === 0} // Même condition que votre code original
            >

              Créer la Promesse d'achat
            </Button>
          </CardContent>
        </Card>

        {/* Aperçu Promesse */}
        <Card className="bg-muted/10">
          <CardHeader>
            <CardTitle>Aperçu Promesse d'achat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div><strong>Client:</strong> {currentCustomer?.name || tempCustomer.customer_name || 'Non spécifié'}</div>
              <div><strong>Téléphone:</strong> {currentCustomer?.phone || tempCustomer.customer_phone || 'Non spécifié'}</div>
              <div><strong>Date d'échéance:</strong> {dueDate ? dueDate.toLocaleDateString() : 'Non définie'}</div>
              <div><strong>Date de rappel:</strong> {reminderDate ? reminderDate.toLocaleDateString() : 'Non définie'}</div>
              <div><strong>Note:</strong> {note || 'Aucune note'}</div>

            </div>

            <table className="w-full text-left text-sm border">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2">Produit</th>
                  <th className="p-2">Quantité</th>
                  <th className="p-2">PU</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map(item => (
                  <tr key={item.id}>
                    <td className="p-2">{item.designation}</td>
                    <td className="p-2">{item.product_quantity}</td>
                    <td className="p-2">{item.product_sale_price.toFixed(2)} F</td>
                    <td className="p-2">{item.totalPrice.toFixed(2)} F</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-1 text-sm border-t pt-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{totalAmount.toFixed(2)} F</span>
              </div>
              <div className="flex justify-between">
                <span>Remise:</span>
                <span>-{discount.toFixed(2)} F</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{finalAmount.toFixed(2)} F</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSalePromisePage;