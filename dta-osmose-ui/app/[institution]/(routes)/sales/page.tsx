
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
import { toast } from "react-toastify";
import PrintInvoice from "./PrintInvoice";
import { useReactToPrint } from "react-to-print";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  useGetProductsQuery,
  useGetCustomersQuery,
  useCreateSaleMutation,
  useGetActivePromotionsQuery,
  useGetSalePromiseByIdQuery,
  useGetUsersQuery,
  useGetCustomerDebtStatusQuery
} from "@/state/api";
import { DatePicker } from "@/components/ui/date-picker";

// Types
interface Product { id: string; designation: string; sellingPriceTTC: number; quantity: number; }
interface SaleItemCreateInput { productId: string; quantity: number; unitPrice: number; totalPrice: number; }
interface NewSaleInvoice {
  id: string;
  customerId: number;
  userId?: number;
  invoiceNumber?:   string ; 
  customerCreatorId?: number;
  institution: string;
  issueDate: Date;
  dueDate: Date;
  date: Date;
  discount: number;
  vatApplicable?: boolean | null;
  object?: string;
  reference?: string;
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
const router = useRouter();
const [currentUserId, setCurrentUserId] = useState<number | null>(null);
const [invoiceNumber, setInvoiceNumber] = useState<string>('');
const [issueDate, setIssueDate] = useState<Date>(new Date());
const [date, setdate] = useState<Date>(new Date());
const [customerId, setCustomerId] = useState<number | null>(null);
const [paymentMethod, setPaymentMethod] = useState<string>("");
const [currency] = useState("EUR");
const [reference, setReference] = useState("");
const [object, setObject] = useState("");
const [vatApplicable, setVatApplicable] = useState<boolean | null>(null);
const [discount, setDiscount] = useState(0);
const [quantity, setQuantity] = useState(1);
const params = useSearchParams();
//const [salePromiseId, setSalePromiseId] = useState<number | null>(null);
const [productSearch, setProductSearch] = useState("");
const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
const [items, setItems] = useState<SelectedProduct[]>([]);
const [userId, setId] = useState<string | null>(null);
const [userRole, setUserRole] = useState<string | null>(null);
const salePromiseId = params?.get("salePromiseId");

// CORRECTION : Un seul useEffect pour l'initialisation
useEffect(() => {
  const idFromStorage = localStorage.getItem("id");
  const roleFromStorage = localStorage.getItem("role");
  
  setId(idFromStorage);
  setUserRole(roleFromStorage);
  
  const numericId = idFromStorage ? parseInt(idFromStorage) : null;
  setCurrentUserId(numericId);

  // Définir customerId immédiatement si c'est un Particulier
  if (roleFromStorage === "Particulier" && numericId) {
    setCustomerId(numericId);
  }
}, []);


// CORRECTION : Génération du numéro de facture
useEffect(() => {
  if (!customerId) return;
  const randomSuffix = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  setInvoiceNumber(`${institution}-fac-${customerId}-${randomSuffix}`);
}, [customerId, institution]);




  // API
  const { data: customers = [] } = useGetCustomersQuery({ institution });
  const { data: products = [] } = useGetProductsQuery({ institution });
  const { data: users = [] } = useGetUsersQuery();
  const { data: activePromotions = [] } = useGetActivePromotionsQuery({ institution });
  const [createSale] = useCreateSaleMutation();
 const { data: salePromise } = useGetSalePromiseByIdQuery(Number(salePromiseId), {
    skip: !salePromiseId,
  });
  const { data: debtStatus } = useGetCustomerDebtStatusQuery(
  { 
    customerId: customerId!, 
    institution: institution 
  },
  {
    skip: !customerId // Ne s'exécute que si customerId est défini
  }
);

  
const isParticulier = userRole === "Particulier";
  // Trouver le client courant BASÉ sur le customerId
const currentCustomer = customers.find(c => c.id === customerId);
 

  // Initialisation items depuis promesse d'achat
  
  useEffect(() => {
    if (!salePromise) return;
    setCustomerId(salePromise.customerId ?? null);
    const mappedItems: SelectedProduct[] = salePromise.items.map((it: any) => ({
      productId: it.product.id,
      designation: it.product.designation,
      quantity: it.product_quantity,
      unitPrice: it.product_sale_price,
      totalPrice: it.product_quantity * it.product_sale_price
    }));
    setItems(mappedItems);
    // setCustomerId(salePromise.customerId ?? null);
  }, [salePromise]);

  // Filtrage produit
  const filteredProducts = useMemo(() => {
    if (!productSearch) return [];
    return products.filter(p => p.designation.toLowerCase().includes(productSearch.toLowerCase()));
  }, [productSearch, products]);

  // Recalcul prix si promotions changent
 const getPromoForProduct = (productId: string) => {
  return activePromotions.find(promo => promo.productId === productId && promo.status);
 };


  // Totaux
  const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalVAT = vatApplicable ? totalAmount * 0.1925 : 0;
  const finalAmount = totalAmount - discount + totalVAT;

  //Initialisation de la date de creation 
  useEffect(() => {
    setIssueDate(new Date());
  }, []);

  

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

 

  const handleCreateSale = async () => {
    if (!customerId || items.length === 0) return toast.error("Veuillez remplir tous les champs obligatoires.");
    const now = new Date();
    now.setDate(now.getDate() - 1);
    if (date < now) {
      toast.error("Erreur lors de l'enregistrement: La date de livraison doit être dans le futur.");
      return;
    }
    const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const isParticulier = userRole === "Particulier";
    const newInvoice = {
      customerId,
      userId: isParticulier ? undefined : currentUserId ?? undefined,
      customerCreatorId: isParticulier ? customerId : undefined,
      institution,
      date,
      discount,
      vatApplicable,
      reference,
      object,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice, totalPrice: i.totalPrice })),
      totalAmount,
      finalAmount,
      salePromiseId: salePromise ? salePromise.id : undefined,
      paymentMethod,
    };

    try {
     const createdInvoice = await createSale(newInvoice).unwrap();
      toast.success("Vente enregistrée !");
      router.push(`/${institution}/sales/${createdInvoice.id}`);

      setItems([]);
      setDiscount(0);
      setCustomerId(null);
      setdate(new Date());
      setReference("");
      setObject("");
      setVatApplicable(null);
      
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

   // Impression avec PrintInvoice
  type UseReactToPrintOptionsFixed = Parameters<typeof useReactToPrint>[0] & {
    content: () => HTMLElement | null;
  };

  const rate = 656;

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
          <CardHeader>
            <CardTitle>Formulaire vente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Customer */}
            <div className="flex items-end mb-4">
              <div className="flex-1">
                <Label className="block mb-2">Client</Label>
              {isParticulier && currentCustomer ? (
                 // Si c'est un client connecté
                <div className="p-2 border rounded">
                   <p>{currentCustomer.name} - {currentCustomer.phone}</p>
                </div>
              ) : (
                <Select value={customerId?.toString() || ""} onValueChange={val => setCustomerId(Number(val))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
               )}
              </div>
                
            </div>
              {/* ✅ Affichage dette client */}
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

            {/* Invoice info */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
              <div>
                <Label className="mb-2">Date de livraison</Label>
                <DatePicker label="" date={date} onSelect={(date) => date && setdate(date)} />
              </div>
              {/* Méthode de paiement */}
             <div>
              <Label className="mb-2">Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue placeholder="Choisir une méthode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Paiement mobile</SelectItem>
                  <SelectItem value="bancaire">Paiement bancaire</SelectItem>
                  <SelectItem value="espece">Espèces</SelectItem>
                  <SelectItem value="cheque">Par chèque</SelectItem>
                  <SelectItem value="remise">Remise</SelectItem>
                </SelectContent>
              </Select>
             </div>
            </div>
             
            <div>
              <Label className="mb-2">Réference</Label>
              <Input value={reference} onChange={e => setReference(e.target.value)} />
            </div>

            <div>
              <Label className="mb-2">Objet</Label>
              <Textarea value={object} onChange={e => setObject(e.target.value)} />
            </div>

            {/* VAT */}
            {!isParticulier && (
            <div className="flex items-center gap-4 mt-2">
              <Label>Appliquer la TVA :</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={vatApplicable === true}
                  onCheckedChange={checked => setVatApplicable(checked === true ? true : null)}
                />
                <Label>YES</Label>
                {/* <Checkbox checked={vatApplicable === false} onCheckedChange={checked => setVatApplicable(checked === true ? false : null)} />
                <Label>No</Label> */}
              </div>
            </div>
            )}
           {!isParticulier && (
            <div>
              <Label className="mb-2">Remise</Label>
              <Input type="number" min={0} value={discount} onChange={e => setDiscount(Number(e.target.value))} />
            </div>
           )}
            {/* Products */}
            <div className="space-y-3">
              <Label>Rechercher un produit</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-8" />
              </div>
              {filteredProducts.length > 0 && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {filteredProducts.map(p => {
                    const promo = getPromoForProduct(p.id);
                    const finalPrice = promo 
                    ? p.sellingPriceTTC * (1 - promo.discount / 100) 
                    : p.sellingPriceTTC;
                  return (
                    
                   <div key={p.id} className={`p-2 cursor-pointer hover:bg-gray-500 `} onClick={() => setSelectedProduct(p.id)}>
                    {promo ? (
                      <div className="flex justify-between">
                        <span>{p.designation} <b className="text-red-500">-{promo.discount}%</b></span>
                        <span className="line-through text-gray-500 mr-2">{p.sellingPriceTTC.toFixed(2)} €</span>
                        <span>{finalPrice.toFixed(2)} €</span>
                      </div>
                    ):(
                      <div className="flex justify-between">
                        <span>{p.designation}</span>
                        <span>{p.sellingPriceTTC.toFixed(2)} €</span>
                      </div>
                    )}
                    </div>
                  )
                  })}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="mb-2">Produit sélectionné</Label>
                  <Input value={selectedProduct ? products.find(p => p.id === selectedProduct)?.designation || '' : ''} readOnly />
                </div>
                <div>
                    <Label className="mb-2">Stock disponible</Label>
                    {selectedProduct ? (
                    (() => {
                        const product = products.find(p => p.id === selectedProduct);
                        if (!product) return <span className="text-gray-500">(Inconnu)</span>;
                          return product.quantity <= 0 ? (
                        <span className="text-red-500 font-bold">(Épuisé)</span>
                        ) : (
                      <Input 
                       value={product.quantity} 
                       readOnly 
                       className="w-20 bg-gray-100"
                     />
                      );
                    })()
                    ) : (
                      <Input 
                        value={0} 
                        readOnly 
                        className="w-20 bg-gray-100"
                      />
                    )}
                  </div>
                <div>
                  <Label className="mb-2">Quantité</Label>
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

          <div className="mt-4 space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between items-end">
              <span>Sous-total :</span>
              <div className="text-right">
                <div>{totalAmount.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{(totalAmount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span>Remise :</span>
              <div className="text-right">
                <div>-{discount.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">-{(discount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span>TVA ({vatApplicable ? '19.25%' : '0%'}) :</span>
              <div className="text-right">
                <div>{totalVAT.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{(totalVAT * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end font-bold text-lg border-t pt-2">
              <span>Total :</span>
              <div className="text-right">
                <div>{finalAmount.toFixed(2)} €</div>
                <div className="text-sm text-green-600 font-semibold">{(finalAmount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>
          </div>


            <Button className="mt-4 w-full" onClick={handleCreateSale}  disabled={!customerId || debtStatus?.hasDebt}>Enregistrer la vente</Button>
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
            <div><strong>Objet:</strong> {object}</div>
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
            <div className="mt-4 space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between items-end">
              <span>Sous-total :</span>
              <div className="text-right">
                <div>{totalAmount.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{(totalAmount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span>Remise :</span>
              <div className="text-right">
                <div>-{discount.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">-{(discount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span>TVA ({vatApplicable ? '19.25%' : '0%'}) :</span>
              <div className="text-right">
                <div>{totalVAT.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{(totalVAT * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end font-bold text-lg border-t pt-2">
              <span>Total :</span>
              <div className="text-right">
                <div>{finalAmount.toFixed(2)} €</div>
                <div className="text-sm text-green-600 font-semibold">{(finalAmount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>
          </div>
             {/* PrintInvoice caché */}
            <div className="hidden">
            <PrintInvoice
              ref={printRef}
              invoice={{
                invoiceNumber,
                customerName: customers.find(c => c.id === customerId)?.name || "",
                object,
                items,
                issueDate,
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
