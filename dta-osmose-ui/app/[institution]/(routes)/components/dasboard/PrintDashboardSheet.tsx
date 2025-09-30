"use client";

import React, { forwardRef, useRef } from "react";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetSettingsQuery } from "@/state/api";

interface PrintDashboardProps {
  userType: string;
  dashboardMetrics: any;
  startDate: Date;
  endDate: Date;
  totalSales?: number;
  totalProfits?: number;
  totalInvoices?: number;
  totalAvailableCredit?: number;
  totalUsers?: number;
  customerStats?: any;
}

const PrintDashboard = forwardRef<HTMLDivElement, PrintDashboardProps>(
  ({ 
    userType, 
    dashboardMetrics, 
    startDate, 
    endDate,
    totalSales = 0,
    totalProfits = 0,
    totalInvoices = 0,
    totalAvailableCredit = 0,
    totalUsers = 0,
    customerStats = {}
  }, ref) => {
    const { institution } = useParams<{ institution: string }>();
    const { data: settings = [] } = useGetSettingsQuery({ institution });
    const setting = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;

    const formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    });

    const logoSrc =
      institution === "iba"
        ? "/logo/logo-iba.png"
        : institution === "asermpharma"
        ? "/logo/logo-asermpharma.png"
        : "/logo/default-logo.png";

    const formatAmount = (amount: number) => {
      return {
        eur: formatter.format(amount),
        cfa: (Math.round(amount * 655.957)).toLocaleString("fr-FR") + " F CFA"
      };
    };

    // Données pour le tableau selon le rôle
    const getTableData = () => {
      switch (userType) {
        case "admin":
          return [
            { label: "Total des ventes", eur: formatAmount(totalSales).eur, cfa: formatAmount(totalSales).cfa },
            { label: "Bénéfices", eur: formatAmount(totalProfits).eur, cfa: formatAmount(totalProfits).cfa },
            { label: "Nombre de factures", value: totalInvoices?.toLocaleString() ?? "0" },
            { label: "Total des avoirs", eur: formatAmount(totalAvailableCredit).eur, cfa: formatAmount(totalAvailableCredit).cfa },
            { label: "Utilisateurs enregistrés", value: totalUsers?.toLocaleString() ?? "0" }
          ];
        
        case "staff":
          return [
            { label: "Total des ventes", eur: formatAmount(totalSales).eur, cfa: formatAmount(totalSales).cfa },
            { label: "Nombre de factures", value: totalInvoices?.toLocaleString() ?? "0" },
            { label: "Total des avoirs", eur: formatAmount(totalAvailableCredit).eur, cfa: formatAmount(totalAvailableCredit).cfa }
          ];
        
        case "Particulier":
          return [
            { label: "Mes Avoirs disponibles", eur: formatAmount(customerStats?.avoirDisponible || 0).eur, cfa: formatAmount(customerStats?.avoirDisponible || 0).cfa },
            { label: "Total des Achats", eur: formatAmount(customerStats?.totalAchats || 0).eur, cfa: formatAmount(customerStats?.totalAchats || 0).cfa },
            { label: "Nombre de Commandes", value: customerStats?.nombreCommandes?.toLocaleString() ?? "0" },
            { label: "Commandes impayées", value: customerStats?.nombreCommandesImpaye?.toLocaleString() ?? "0" }
          ];
        
        default:
          return [];
      }
    };

    const tableData = getTableData();

    return (
      <div ref={ref} className="container mx-auto p-6 max-w-4xl text-black">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <img
              src={logoSrc}
              alt="Logo"
              style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
            />
          </div>
          {setting && (
            <div className="text-right">
              <p className="uppercase font-bold text-lg">{setting.company_name}</p>
              <p className="text-sm">{setting.address}</p>
              <p className="text-sm">{setting.phone}</p>
              <p className="text-sm">{setting.email}</p>
            </div>
          )}
        </div>

        {/* TITRE */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Rapport Dashboard</h1>
          <div className="flex justify-center gap-8 text-sm">
            <p><strong>Rôle :</strong> {userType}</p>
            <p><strong>Période :</strong> {startDate.toLocaleDateString()} → {endDate.toLocaleDateString()}</p>
          </div>
        </div>

        {/* TABLEAU DES DONNÉES */}
        <Card>
          <CardContent className="p-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Indicateur</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Montant (EUR)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Montant (F CFA)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-3 font-medium">{item.label}</td>
                    <td className="border border-gray-300 px-4 py-3">{item.eur || '-'}</td>
                    <td className="border border-gray-300 px-4 py-3">{item.cfa || '-'}</td>
                    <td className="border border-gray-300 px-4 py-3">{item.value || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    );
  }
);

PrintDashboard.displayName = "PrintDashboard";

const PrintDashboardSheet = ({ 
  userType, 
  dashboardMetrics, 
  startDate, 
  endDate,
  totalSales,
  totalProfits,
  totalInvoices,
  totalAvailableCredit,
  totalUsers,
  customerStats
}: PrintDashboardProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Rapport-Dashboard-${userType}-${startDate.toISOString().split('T')[0]}`,
  });

  return (
    <div>
      {/* Version cachée pour l'impression */}
      <div style={{ position: "absolute", left: "-9999px", top: "0" }}>
        <PrintDashboard
          ref={contentRef}
          userType={userType}
          dashboardMetrics={dashboardMetrics}
          startDate={startDate}
          endDate={endDate}
          totalSales={totalSales}
          totalProfits={totalProfits}
          totalInvoices={totalInvoices}
          totalAvailableCredit={totalAvailableCredit}
          totalUsers={totalUsers}
          customerStats={customerStats}
        />
      </div>
      
      {/* ✅ Bouton avec couleur d'origine */}
      <Button 
        onClick={handlePrint}
        className="px-4 py-2 rounded"
      >
         Imprimer le Dashboard
      </Button>
    </div>
  );
};

export default PrintDashboardSheet;