import React from "react";
import Container from "../../../components/ui/Container";

const UserCRMDashboard = () => {
  return (
    <div>
      <Container
        title={`John | (en cours) `}
        description="Vos données de vente en un seul endroit"
      >
        <div className="grid grid-cols-2 w-full ">
          <div className="">Aperçu des appels</div>
          <div className="">
            <h1>Tâches dans les comptes</h1>
            <pre></pre>
          </div>
          <div className="">Aperçu des réunions</div>
          <div className="">
            <h1>12</h1>
          </div>
          <div className="">Aperçu des prospects</div>
          <div className="">
            <h1>25</h1>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserCRMDashboard;