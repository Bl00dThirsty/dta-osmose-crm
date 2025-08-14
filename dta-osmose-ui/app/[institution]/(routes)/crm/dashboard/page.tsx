'use client';

import React, { useState, useEffect, useRef } from "react";
import Container from "../../components/ui/Container";
import { useRouter, useParams } from 'next/navigation';
import { useGetDashboardSalesQuery } from "@/state/api";
import { SalesBarChart } from "./_components/SalesByCityChart";

const CrmDashboardPage = () => {
  const router = useRouter();
  const { institution } = useParams() as { institution: string };
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // --- Gestion des dates ---
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  const printRef = useRef<HTMLDivElement>(null); // ← conteneur à imprimer

  useEffect(() => {
    if (!token) router.push('/sign-in');
  }, [token]);

  const { data: dashboardData, isLoading, error, refetch } = useGetDashboardSalesQuery(
    { institution, startDate, endDate },
    { skip: !startDate || !endDate, refetchOnMountOrArgChange: true }
  );

  const handlePrint = () => {
    if (!printRef.current) return;

    // Ouvre une nouvelle fenêtre pour l’impression
    const printWindow = window.open('', 'PRINT', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Rapport de ventes</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;margin-bottom:20px;} th, td{border:1px solid #ccc;padding:8px;text-align:left;} th{background-color:#2563eb;color:white;}</style>');
    printWindow.document.write('</head><body>');

    printWindow.document.write(`<h1>Rapport de ventes</h1>`);
    printWindow.document.write(`<p>Période : ${startDate} au ${endDate}</p>`);

    const sections = [
      { title: "Ventes par produit", data: dashboardData?.salesByProduct, key: "productName" },
      { title: "Ventes par pharmacie", data: dashboardData?.salesByPharmacy, key: "pharmacyName" },
      { title: "Ventes par ville", data: dashboardData?.salesByCity, key: "cityName" },
    ];

    sections.forEach(section => {
      if (!section.data || section.data.length === 0) return;

      printWindow.document.write(`<h2>${section.title}</h2>`);
      printWindow.document.write('<table><thead><tr><th>Nom</th><th>Montant total</th><th>Quantité vendue</th></tr></thead><tbody>');

      section.data.forEach((item: any) => {
        printWindow.document.write(`<tr><td>${item[section.key] ?? 'N/A'}</td><td>${(item.totalSales ?? 0).toLocaleString()}</td><td>${(item.totalQuantity ?? 0).toLocaleString()}</td></tr>`);
      });

      printWindow.document.write('</tbody></table>');
    });

    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des données</div>;

  return (
    <Container
      title="Dashboard Ventes"
      description="Vue d'ensemble des ventes par produit, pharmacie et ville."
    >
      {/* --- Sélecteur de période --- */}
      <div className="mb-4 flex gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Du :</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Au :</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-1"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded self-end"
        >
          Actualiser
        </button>
        <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded self-end">
          Imprimer le rapport
        </button>
      </div>

      {/* --- Contenu à imprimer --- */}
      <div ref={printRef}>
        {/* --- Ventes par Produit --- */}
        <section className="p-4 overflow-hidden rounded-[0.5rem] border-5 bg-background shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Ventes par produit</h2>
          {dashboardData?.salesByProduct?.length ? (
            <SalesBarChart
              data={dashboardData.salesByProduct}
              xKey="productName"
              bars={[
                { dataKey: "totalSales", name: "Montant total", color: "#2563eb" },
                { dataKey: "totalQuantity", name: "Quantité vendue", color: "#60a5fa" },
              ]}
            />
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </section>

        {/* --- Ventes par Pharmacie --- */}
        <section className="p-4 overflow-hidden rounded-[0.5rem] border-5 bg-background shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Ventes par pharmacie</h2>
          {dashboardData?.salesByPharmacy?.length ? (
            <SalesBarChart
              data={dashboardData.salesByPharmacy}
              xKey="pharmacyName"
              bars={[
                { dataKey: "totalSales", name: "Montant total", color: "#2563eb" },
                { dataKey: "totalQuantity", name: "Quantité vendue", color: "#60a5fa"},
              ]}
            />
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </section>

        {/* --- Ventes par Ville --- */}
        <section className="p-4 overflow-hidden rounded-[0.5rem] border-5 bg-background shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Ventes par ville</h2>
          {dashboardData?.salesByCity?.length ? (
            <SalesBarChart
              data={dashboardData.salesByCity}
              xKey="cityName"
              bars={[
                { dataKey: "totalSales", name: "Montant total", color: "#2563eb" },
                { dataKey: "totalQuantity", name: "Nombre de ventes", color: "#60a5fa" },
              ]}
            />
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </section>
      </div>
    </Container>
  );
};

export default CrmDashboardPage;
