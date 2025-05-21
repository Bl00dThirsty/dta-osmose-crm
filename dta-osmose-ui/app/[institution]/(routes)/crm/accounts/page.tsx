import React, { Suspense } from "react";

import AccountsView from "../components/AccountsView";
import Container from "../../components/ui/Container";
import SuspenseLoading from "@/components/loadings/suspense";

const AccountsPage = async () => {
  

  return (
    <Container
      title="Accounts"
      description={"Everything you need to know about your accounts"}
    >
      <Suspense fallback={<SuspenseLoading />}>
        
      </Suspense>
    </Container>
  );
};

export default AccountsPage;
