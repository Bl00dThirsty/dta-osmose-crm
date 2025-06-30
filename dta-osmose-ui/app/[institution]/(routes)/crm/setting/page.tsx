"use client"

import React from "react";
import Container from "../../components/ui/Container";
import SettingsForm from "./setting";


const SettingsPage = () => {


  return (
    <Container
      title="Paramètres de l'entreprise"
      description=""
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <SettingsForm />
        </section>
      </div>
    </Container>
  );
};

export default SettingsPage;