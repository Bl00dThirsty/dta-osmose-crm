<<<<<<< HEAD
import { Suspense } from "react";
import Container from "../components/ui/Container";
import MainPageView from "./components/MainPageView";
import SuspenseLoading from "@/components/loadings/suspense";

const CrmPage = async () => {
  return (
    <Container
      title="CRM"
      description={"Tout ce aue vous devez savoir sur les ventes..."}
    >
      <Suspense fallback={<SuspenseLoading />}>
        <MainPageView />
      </Suspense>
    </Container>
  );
};

export default CrmPage;
=======
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
      TODO: Think about how to handle the loading of the data to make better UX with suspense
      */}
      <Suspense fallback={<SuspenseLoading />}>
        <MainPageView />
      </Suspense>
    </Container>
  );
};

export default CrmPage;
>>>>>>> origin/yvana
