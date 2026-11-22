import "./PrincipalitiesPage.css";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FoundingDateField } from "../components/FoundingDateField";
import { ROUTES } from "../Routes";
import { PrincipalityCard } from "../components/PrincipalityCard";
import { BlockingSpinner } from "../components/BlockingSpinner";
import { useAppDispatch, useAppSelector } from "../store";
import {
  deletePrincipality,
  fetchPrincipalities,
  setFoundedBefore,
} from "../slices/principalitiesSlice";

const PrincipalitiesPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { foundedBefore, principalities, loading, fromMock, error } = useAppSelector(
    (state) => state.principalities
  );
  const isAuthenticated = useAppSelector((state) => state.archaeologist.isAuthenticated);

  useEffect(() => {
    dispatch(fetchPrincipalities());
  }, [dispatch]);

  const handleFoundedBeforeSubmit = () => {
    dispatch(fetchPrincipalities());
  };

  const handleCardClick = (principality_id: number) => {
    navigate(`${ROUTES.FEED}/${principality_id}`);
  };

  const handleDelete = (principality_id: number) => {
    dispatch(deletePrincipality(principality_id));
  };

  return (
    <div className="container">
      <h1 className="containerTitle">Удельные княжества</h1>
      <FoundingDateField
        value={foundedBefore}
        setValue={(value) => dispatch(setFoundedBefore(value))}
        loading={loading}
        onSubmit={handleFoundedBeforeSubmit}
      />

      {fromMock && (
        <div className="principalitiesNotice">
          Веб-сервис недоступен, показаны княжества из локальной коллекции
        </div>
      )}
      {error && <div className="principalitiesNotice principalitiesNoticeError">{error}</div>}

      {loading && <BlockingSpinner />}
      {!principalities.length && !loading ? (
        <div className="principalitiesEmpty">
          К сожалению, пока ничего не найдено :(
        </div>
      ) : (
        <div className="principalitiesGrid">
          {principalities.map((principality) => (
            <PrincipalityCard
              key={principality.principality_id}
              onClick={() => handleCardClick(principality.principality_id)}
              onDelete={
                isAuthenticated && principality.created_by_current_archaeologist
                  ? () => handleDelete(principality.principality_id)
                  : undefined
              }
              {...principality}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrincipalitiesPage;
