"use client"

import React from "react";
import Container from "../../components/ui/Container";
import ProductsTable from "./table/page";


const ProductsPage = () => {


  return (
    <Container
      title="Catalogue des produits de l'institution"
      description="Ici vous avez tous les produits entrés en stock dans cette institution."
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
