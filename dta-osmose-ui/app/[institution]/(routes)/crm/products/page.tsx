"use client"

import React from "react";
import Container from "../../components/ui/Container";
import ProductsTable from "./table/page";


const ProductsPage = () => {


  return (
    <Container
      title="Tableau des differents Produits de l'institution"
      description="En cours de développement... Ce composant affiche une vue d'ensemble des mmarques et des produits définis et enregistrés."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <ProductsTable />
        </section>
      </div>
    </Container>
  );
};

export default ProductsPage;
