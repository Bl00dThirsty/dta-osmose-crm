"use client"

import React from "react";
import Container from "../../components/ui/Container";
import ProductPage from "./table/page";


const ProductsPage = () => {


  return (
    <Container
      title="Tableau des différents produits et marques"
      description="En cours de développement... Ce composant affiche une vue d'ensemble des mmarques et des produits définis et enregistrés."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <ProductPage />
        </section>
      </div>
    </Container>
  );
};

export default ProductsPage;
