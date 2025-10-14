"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import PrintInvoice from "./PrintInvoice";
import { useReactToPrint } from "react-to-print";
import { useParams, useSearchParams } from "next/navigation";

import {
  useGetProductsQuery,
  useGetCustomersQuery,
  useCreateSaleMutation,
  useGetActivePromotionsQuery,
  useGetSalePromiseByIdQuery,
  useGetUsersQuery,
  useGetCustomerDebtStatusQuery
} from "@/state/api";
import { DatePicker } from "../crm/dashboard/_components/date-picker";

// Types
interface Product { id: string; designation: string; sellingPriceTTC: number; quantity: number; }
interface SaleItemCreateInput { productId: string; quantity: number; unitPrice: number; totalPrice: number; }
interface NewSaleInvoice {
  customerId: number;
  userId?: number;
  invoiceNumber?:   string ; 
  customerCreatorId?: number;
  institution: string;
  issueDate: Date;
  dueDate: Date;
  deliveryDate: Date;
  discount: number;
  vatApplicable?: boolean | null;
  reference?: string;
  objet?: string;
  items: SaleItemCreateInput[];
  totalAmount: number;
  finalAmount: number;
  salePromiseId?: number;
  paymentMethod?: string;
}
interface SelectedProduct extends SaleItemCreateInput { designation: string; }

export default function CreateInvoicePage() {
  const previewRef = useRef<HTMLDivElement>(null); // Aperçu
  const printRef = useRef<HTMLDivElement>(null);   // Facture imprimable

  const { institution } = useParams() as { institution: string };

  // États
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [issueDate, setIssueDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
 const [deliveryDate, setDeliveryDate] = useState<Date | null>(new Date());
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [currency] = useState("EUR");
  const [reference, setReference] = useState("");
  const [objectDesc, setObjectDesc] = useState("");
  const [vatApplicable, setVatApplicable] = useState<boolean | null>(null);
  const [discount, setDiscount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const salePromiseIdFromUrl = searchParams.get("salePromiseId");
  const [salePromiseId, setSalePromiseId] = useState<number | null>(
    salePromiseIdFromUrl ? Number(salePromiseIdFromUrl) : null
  );
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [items, setItems] = useState<SelectedProduct[]>([]);

  const [fieldErrors, setFieldErrors] = useState<{ reference?: string; objectDesc?: string }>({});
  // Rôle utilisateur
  const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const isCustomer = userRole === "Particulier";

  // API
  const { data: customers = [] } = useGetCustomersQuery({ institution });
  const { data: products = [] } = useGetProductsQuery({ institution });
  const { data: users = [] } = useGetUsersQuery();
  const { data: activePromotions = [] } = useGetActivePromotionsQuery({ institution });
  const [createSale] = useCreateSaleMutation();
  const { data: salePromise } = useGetSalePromiseByIdQuery(salePromiseId ?? 0, { skip: !salePromiseId });
  const { data: debtStatus } = useGetCustomerDebtStatusQuery(
  { 
    customerId: customerId!, 
    institution: institution 
  },
  {
    skip: !customerId // Ne s'exécute que si customerId est défini
  }
);

  // Initialisation utilisateur
  useEffect(() => {
    const idFromStorage = typeof window !== "undefined" ? localStorage.getItem("id") : null;
    setCurrentUserId(idFromStorage ? parseInt(idFromStorage) : null);
  }, []);

  // Initialisation items depuis promesse d'achat
  useEffect(() => {
    if (!salePromise?.items) return;
    const mappedItems: SelectedProduct[] = salePromise.items.map((it: any) => ({
      productId: it.product.id,
      designation: it.product.designation,
      quantity: it.product_quantity,
      unitPrice: it.product_sale_price,
      totalPrice: it.product_quantity * it.product_sale_price
    }));
    setItems(mappedItems);
    //Client
  setCustomerId(salePromise.customerId ?? null);

  //  Dates (correction)
  if (salePromise.dueDate) setDueDate(new Date(salePromise.dueDate));
  if (salePromise.reminderDate) setDeliveryDate(new Date(salePromise.reminderDate));
  }, [salePromise]);

  // Filtrage produit
  const filteredProducts = useMemo(() => {
    if (!productSearch) return [];
    return products.filter(p => p.designation.toLowerCase().includes(productSearch.toLowerCase()));
  }, [productSearch, products]);

  // Recalcul prix si promotions changent
  useEffect(() => {
    if (activePromotions.length === 0) return;

    setItems(prevItems =>
      prevItems.map(item => {
        const promo = activePromotions.find(p => p.productId === item.productId && p.status);
        const product = products.find(p => p.id === item.productId);
        if (!product) return item;

        const priceWithPromo = promo ? product.sellingPriceTTC * (1 - promo.discount / 100) : product.sellingPriceTTC;

        if (priceWithPromo !== item.unitPrice) {
          return {
            ...item,
            unitPrice: priceWithPromo,
            totalPrice: priceWithPromo * item.quantity,
          };
        }
        return item;
      })
    );
  }, [activePromotions, products]);


  // Totaux
  const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalVAT = vatApplicable ? totalAmount * 0.2 : 0;
  const finalAmount = totalAmount - discount + totalVAT;

  // ✅ Validation avant envoi (champs obligatoires pour les clients seulement)
  const validateForm = () => {
    const newErrors: { reference?: string; objectDesc?: string } = {};

    // Si c'est un client, reference et objet sont obligatoires
    if (isCustomer) {
      if (!reference.trim()) newErrors.reference = "La référence est obligatoire pour un client.";
      if (!objectDesc.trim()) newErrors.objectDesc = "L'objet est obligatoire pour un client.";
    }

    // Si erreurs métier, on les affiche (toast + inline)
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(msg => toast.error(msg));
      setFieldErrors(newErrors);
      return false;
    }

    // reset erreurs inline si ok
    setFieldErrors({});
    return true;
  };
  
  // Handlers
  const handleAddProduct = () => {
    if (!selectedProduct) return toast.error("Veuillez sélectionner un produit");

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return toast.error("Produit introuvable");

    const promo = activePromotions.find(p => p.productId === product.id && p.status);
    const priceWithPromo = promo ? product.sellingPriceTTC * (1 - promo.discount / 100) : product.sellingPriceTTC;

    setItems(prevItems => {
      const existing = prevItems.find(i => i.productId === product.id);
      if (existing) {
        return prevItems.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity, totalPrice: (i.quantity + quantity) * priceWithPromo }
            : i
        );
      } else {
        return [...prevItems, { productId: product.id, designation: product.designation, quantity, unitPrice: priceWithPromo, totalPrice: priceWithPromo * quantity }];
      }
    });

    setSelectedProduct(null);
    setProductSearch("");
    setQuantity(1);
    toast.success("Produit ajouté");
  };

  const handleQuantityChange = (productId: string, qty: number) => {
    if (qty < 1) return;
    setItems(items.map(i =>
      i.productId === productId
        ? { ...i, quantity: qty, totalPrice: i.unitPrice * qty }
        : i
    ));
  };

  const handleRemoveProduct = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
    toast.success("Produit retiré");
  };
 // génération automatique numéro facture quand client sélectionné
  useEffect(() => {
  if (!customerId) return;
  const randomSuffix = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  setInvoiceNumber(`${institution}-fac-${customerId}-${randomSuffix}`);
}, [customerId, institution]);

  const handleCreateSale = async () => {
     if (!validateForm()) return; 
    if (!customerId || items.length === 0) 
      return toast.error("Veuillez remplir tous les champs obligatoires.");
    const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const isParticulier = userRole === "Particulier";
    const newInvoice: NewSaleInvoice = {
      customerId,
      userId: isParticulier ? undefined : currentUserId ?? undefined,
      customerCreatorId: isParticulier ? customerId : undefined,
      institution,
      issueDate: issueDate!,
     dueDate: dueDate!,
     deliveryDate: deliveryDate!,
      discount,
      vatApplicable,
      reference,
      objet: objectDesc,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice, totalPrice: i.totalPrice })),
      totalAmount,
      finalAmount,
      salePromiseId: salePromiseId ?? undefined,
      paymentMethod,
    };

    try {
      await createSale(newInvoice).unwrap();
      toast.success("Vente enregistrée !");
      setItems([]);
      setDiscount(0);
      setCustomerId(null);
      const randomSuffix = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // 1000 à 9999
      setInvoiceNumber(`${institution}-fac-${customerId}-${randomSuffix}`);

      setIssueDate(new Date());
      setDueDate(new Date());
      setDeliveryDate(new Date());
      setReference("");
      setVatApplicable(null);
    } catch (err) {
      console.error("Erreur complète:", JSON.stringify(err, null, 2));
      toast.error("Erreur lors de l'enregistrement");
    }
  };

   // Impression avec PrintInvoice
  type UseReactToPrintOptionsFixed = Parameters<typeof useReactToPrint>[0] & {
    content: () => HTMLElement | null;
  };

const handlePrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: `Facture-${invoiceNumber}`,
} as UseReactToPrintOptionsFixed);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Formulaire */}
        <Card>
          <CardHeader><CardTitle>Formulaire vente</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            {/* Customer */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>Client</Label>
                <Select value={customerId?.toString() || ""} onValueChange={val => setCustomerId(Number(val))}>
                  <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                  <SelectContent>
                    {Array.isArray(customers) && customers.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {/*  Affichage dette client */}
                  {debtStatus?.hasDebt && (
                    <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                      Ce client a une dette de {debtStatus.amountDue} €
                    </div>
                  )}
              </div>
               <Label>Numero Facture</Label>
                <Input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
            </div>

            {/* Invoice info */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>date de création</Label>
               <DatePicker label="" date={issueDate ?? undefined} onSelect={(date) => date && setIssueDate(date)} />
              </div>
              <div>
                <Label>Date de livraison</Label>
                <DatePicker label="" date={deliveryDate ?? undefined} onSelect={(date) => date && setDeliveryDate(date)} />
              </div>
            </div>
             {/* Méthode de paiement */}
            <div>
              <Label>Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue placeholder="Choisir une méthode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="bank">Virement Bancaire</SelectItem>
                  <SelectItem value="card">Carte Bancaire</SelectItem>
                  <SelectItem value="cheque">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Référence {isCustomer && <span className="text-red-500">*</span>}</Label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: REF-2025-001"
                required={isCustomer}
              />
              {fieldErrors.reference && <p className="text-red-500 text-sm mt-1">{fieldErrors.reference}</p>}
            </div>

            <div>
              <Label>Objet {isCustomer && <span className="text-red-500">*</span>}</Label>
              <Textarea
                value={objectDesc}
                onChange={(e) => setObjectDesc(e.target.value)}
                required={isCustomer}
              />
              {fieldErrors.objectDesc && <p className="text-red-500 text-sm mt-1">{fieldErrors.objectDesc}</p>}
            </div>

            {/* VAT */}
            <div className="flex items-center gap-4">
              <Label>Appliquer la TVA</Label>
              <div className="flex items-center gap-2">
                <Checkbox checked={vatApplicable === true} onCheckedChange={checked => setVatApplicable(checked === true ? true : null)} />
                <Label>Yes</Label>
                <Checkbox checked={vatApplicable === false} onCheckedChange={checked => setVatApplicable(checked === true ? false : null)} />
                <Label>No</Label>
              </div>
            </div>

            <div>
              <Label>Remise</Label>
              <Input type="number" min={0} value={discount} onChange={e => setDiscount(Number(e.target.value))} />
            </div>

            {/* Products */}
            <div className="space-y-3">
              <Label>Rechercher un produit</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-8" />
              </div>
              {filteredProducts.length > 0 && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {filteredProducts.map(p => (
                    <div key={p.id} className={`p-2 cursor-pointer hover:bg-gray-500 `} onClick={() => setSelectedProduct(p.id)}>
                      <div className="flex justify-between">
                        <span>{p.designation}</span>
                        <span>{p.sellingPriceTTC.toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Produit sélectionné</Label>
                  <Input value={selectedProduct ? products.find(p => p.id === selectedProduct)?.designation || '' : ''} readOnly />
                </div>
                <div>
                    <Label>Stock disponible</Label>
                    <Input 
                      value={selectedProduct ? products.find(p => p.id === selectedProduct)?.quantity ?? 0 : 0} 
                      readOnly 
                      className="w-20 bg-gray-100"
                    />
                  </div>
                <div>
                  <Label>Quantité</Label>
                  <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-20" />
                </div>
                <Button className="mt-6" onClick={handleAddProduct}><PlusCircle className="mr-2 h-4 w-4"/>Ajouter</Button>
              </div>
            </div>

            {/* Tableau produits */}
            <div className="mt-4">
              {items.length === 0 ? <p className="text-muted-foreground text-sm">Aucun produit ajouté</p> : (
                <table className="w-full text-left text-sm border">
                  <thead className="bg-muted">
                    <tr><th className="p-2">Produit</th><th className="p-2">Quantité</th><th className="p-2">Prix Unitaire</th><th className="p-2">Total</th><th className="p-2">Actions</th></tr>
                  </thead>
                  <tbody>
                    {items.map(i => (
                      <tr key={i.productId}>
                        <td className="p-2">{i.designation}</td>
                        <td className="p-2">
                          <Input type="number" min={1} value={i.quantity} onChange={e => handleQuantityChange(i.productId, Number(e.target.value))} className="w-16" />
                        </td>
                        <td className="p-2">{i.unitPrice.toFixed(2)} €</td>
                        <td className="p-2">{i.totalPrice.toFixed(2)} €</td>
                        <td className="p-2"><Button variant="outline" size="sm" onClick={() => handleRemoveProduct(i.productId)}>Supprimer</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Totaux */}
            <div className="mt-4 space-y-1 text-sm border-t pt-4">
              <div className="flex justify-between"><span>Sous-total:</span><span>{totalAmount.toFixed(2)} €</span></div>
              <div className="flex justify-between"><span>Remise:</span><span>-{discount.toFixed(2)} €</span></div>
              <div className="flex justify-between"><span>TVA ({vatApplicable ? '20%' : '0%'}):</span><span>{totalVAT.toFixed(2)} €</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>{finalAmount.toFixed(2)} €</span></div>
            </div>

            <Button className="mt-4 w-full" onClick={handleCreateSale}>Enregistrer la vente</Button>
          </CardContent>
        </Card>

        {/* Aperçu Facture */}
        <Card className="bg-muted/10">
          <CardHeader><CardTitle>Aperçu Facture</CardTitle></CardHeader>
          <CardContent ref={previewRef} className="space-y-2 text-sm">
            <div className="flex justify-between">
              <div><strong>Facture N°:</strong> {invoiceNumber}</div>
              <div><strong>Date:</strong> {issueDate ? format(issueDate, 'dd/MM/yyyy') : ""}</div>
            </div>
            <div><strong>Client:</strong> {customers.find(c => c.id === customerId)?.name || ''}</div>
            <div><strong>Objet:</strong> {objectDesc}</div>
            <table className="w-full text-left text-sm border mt-2">
              <thead className="bg-muted"><tr><th className="p-2">Produit</th><th className="p-2">Quantité</th><th className="p-2">PU</th><th className="p-2">Total</th></tr></thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.productId}>
                    <td className="p-2">{i.designation}</td>
                    <td className="p-2">{i.quantity}</td>
                    <td className="p-2">{i.unitPrice.toFixed(2)} €</td>
                    <td className="p-2">{i.totalPrice.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 space-y-1 text-sm border-t pt-2">
              <div className="flex justify-between"><span>Sous-total:</span><span>{totalAmount.toFixed(2)} €</span></div>
              <div className="flex justify-between"><span>Remise:</span><span>-{discount.toFixed(2)} €</span></div>
              <div className="flex justify-between"><span>TVA:</span><span>{totalVAT.toFixed(2)} €</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>{finalAmount.toFixed(2)} €</span></div>
            </div>
             {/* PrintInvoice caché */}
            <div className="hidden">
            <PrintInvoice
              ref={printRef}
              invoice={{
                invoiceNumber,
                issueDate,
                customerName: customers.find(c => c.id === customerId)?.name || "",
                objectDesc,
                items,
                totalAmount,
                discount,
                vat: totalVAT,
                finalAmount,
              }}
            />
          </div>
            <Button className="mt-4 w-full" onClick={handlePrint}>Imprimer la facture</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
