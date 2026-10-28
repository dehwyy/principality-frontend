import "./PrincipalitiesPage.css";
import { FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FoundingDateField } from "../components/FoundingDateField";
import { ROUTES } from "../Routes";
import { PrincipalityCard } from "../components/PrincipalityCard";
import { AppOutletContext } from "../AppLayout";
import { PRINCIPALITIES_MOCK } from "../modules/mock";

const PrincipalitiesPage: FC = () => {
  const [foundedBefore, setFoundedBefore] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalogPrincipalities, setCatalogPrincipalities] = useState(PRINCIPALITIES_MOCK);
  const { setPrincipalities } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();

  useEffect(() => {
    setPrincipalities(PRINCIPALITIES_MOCK);
  }, [setPrincipalities]);

  const applyMock = () => {
    const results = foundedBefore
      ? PRINCIPALITIES_MOCK.filter(
          (principality) => principality.founding_date.slice(0, 10) <= foundedBefore
        )
      : PRINCIPALITIES_MOCK;
    setCatalogPrincipalities(results);
    setPrincipalities(results);
    setLoading(false);
  };

  const handleFoundedBeforeSubmit = () => {
    setLoading(true);
    applyMock();
  };

  const handleCardClick = (principality_id: number) => {
    navigate(`${ROUTES.FEED}/${principality_id}`);
  };

  return (
    <div className="container">
      <h1 className="containerTitle">Удельные княжества</h1>
      <FoundingDateField
        value={foundedBefore}
        setValue={(value) => setFoundedBefore(value)}
        loading={loading}
        onSubmit={handleFoundedBeforeSubmit}
      />

      {loading && (
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      )}
      {!loading &&
        (!catalogPrincipalities.length ? (
          <div className="principalitiesEmpty">
            К сожалению, пока ничего не найдено :(
          </div>
        ) : (
          <div className="principalitiesGrid">
            {catalogPrincipalities.map((principality) => (
              <PrincipalityCard
                key={principality.principality_id}
                onClick={() => handleCardClick(principality.principality_id)}
                {...principality}
              />
            ))}
          </div>
        ))}
    </div>
  );
};

export default PrincipalitiesPage;
