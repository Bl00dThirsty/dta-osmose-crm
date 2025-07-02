import { Suspense } from "react";
import Container from "../components/ui/Container";
import MainPageView from "./components/MainPageView";
import SuspenseLoading from "@/components/loadings/suspense";

const CrmPage = async () => {
  return (
    <Container
      title="CRM"
      description={"Tout ce que vous devez savoir sur les ventes..."}
    >
      {/*
      TODO: Penser à améliorer l'interface pour une meilleure UX
      */}
      <Suspense fallback={<SuspenseLoading />}>
        <MainPageView />
      </Suspense>
    </Container>
  );
};

export default CrmPage;
