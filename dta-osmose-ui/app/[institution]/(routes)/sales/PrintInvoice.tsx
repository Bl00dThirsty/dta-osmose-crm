"use client";

import React, { forwardRef } from "react";
import { useParams } from "next/navigation";
import { useGetSettingsQuery } from "@/state/api";

interface PrintInvoiceProps {
  invoice: {
    invoiceNumber: string;
    issueDate: Date | null;
    customerName?: string;
    object?: string;
    items: { designation: string; quantity: number; unitPrice: number; totalPrice: number }[];
    totalAmount: number;
    discount: number;
    vat: number;
    finalAmount: number;
  };
}
const rate = 656;

const PrintInvoice = forwardRef<HTMLDivElement, PrintInvoiceProps>(({ invoice }, ref) => {
  const { institution } = useParams<{ institution: string }>();
  const { data: settings = [] } = useGetSettingsQuery({ institution });
  const setting = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;

  const logoSrc =
    institution === "iba"
      ? "/logo/logo-iba.png"
      : institution === "asermpharma"
      ? "/logo/logo-asermpharma.png"
      : "/logo/default-logo.png";

  return (
    <div ref={ref} className="container mx-auto p-6 max-w-4xl text-sm text-black">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <img src={logoSrc} alt="Logo" style={{ maxWidth: "100px", maxHeight: "100px" }} />
        {setting && (
          <div className="text-right">
            <p className="uppercase font-bold">{setting.company_name}</p>
            <p>{setting.address}</p>
            <p>{setting.phone}</p>
            <p>{setting.email}</p>
          </div>
        )}
      </div>

      {/* Infos Facture */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-2">FACTURE</h1>
        <p><strong>Facture N°:</strong> {invoice.invoiceNumber}</p>
        {/* <p><strong>Date:</strong> {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : ""}</p> */}
        <p><strong>Client:</strong> {invoice.customerName}</p>
        <p><strong>Objet:</strong> {invoice.object}</p>
      </div>

      {/* Produits */}
      <table className="w-full border text-left mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Produit</th>
            <th className="p-2">Quantité</th>
            <th className="p-2">PU</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((i, idx) => (
            <tr key={idx}>
              <td className="p-2">{i.designation}</td>
              <td className="p-2">{i.quantity}</td>
              <td className="p-2">{i.unitPrice.toFixed(2)} €</td>
              <td className="p-2">{i.totalPrice.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totaux */}
      <div className="space-y-1 text-right">
        {/* <p>Sous-total: {invoice.totalAmount.toFixed(2)} €</p>
        <p>Remise: -{invoice.discount.toFixed(2)} €</p>
        <p>TVA: {invoice.vat.toFixed(2)} €</p>
        <p className="font-bold text-lg">Total: {invoice.finalAmount.toFixed(2)} €</p> */}
        <div className="flex justify-between items-end">
              <span>Sous-total :</span>
              <div className="text-right">
                <div>{invoice.totalAmount.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{(invoice.totalAmount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span>Remise :</span>
              <div className="text-right">
                <div>-{invoice.discount.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">-{(invoice.discount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span>TVA :</span>
              <div className="text-right">
                <div>{invoice.vat.toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{(invoice.vat * rate).toFixed(0)} F CFA</div>
              </div>
            </div>

            <div className="flex justify-between items-end font-bold text-lg border-t pt-2">
              <span>Total :</span>
              <div className="text-right">
                <div>{invoice.finalAmount.toFixed(2)} €</div>
                <div className="text-sm font-semibold">{(invoice.finalAmount * rate).toFixed(0)} F CFA</div>
              </div>
            </div>
      </div>
    </div>
  );
});

PrintInvoice.displayName = "PrintInvoice";
export default PrintInvoice;
