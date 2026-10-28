import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { Principality } from "./modules/principalitiesApi";
import { PRINCIPALITIES_MOCK } from "./modules/mock";
import { TabBar } from "./components/TabBar";
import "./MobileApp.css";

export interface AppOutletContext {
  principalities: Principality[];
  setPrincipalities: (principalities: Principality[]) => void;
}

export const AppLayout: FC = () => {
  const [principalities, setPrincipalities] = useState<Principality[]>(PRINCIPALITIES_MOCK);

  return (
    <div className="appShell">
      <main className="appContent">
        <Outlet context={{ principalities, setPrincipalities }} />
      </main>
      <TabBar principalities={principalities} />
    </div>
  );
};
