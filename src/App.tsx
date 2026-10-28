import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrincipalityFeedPage } from "./pages/PrincipalityFeedPage";
import PrincipalitiesPage from "./pages/PrincipalitiesPage";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.PRINCIPALITIES} replace />} />
          <Route path={ROUTES.PRINCIPALITIES} element={<PrincipalitiesPage />} />
          <Route path={`${ROUTES.FEED}/:id`} element={<PrincipalityFeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
