import "./TabBar.css";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import { loggedOut } from "../slices/archaeologistSlice";
import { fetchPrincipalities } from "../slices/principalitiesSlice";
import { logoutArchaeologist } from "../modules/archaeologistApi";

export const TabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.archaeologist);
  const principalities = useAppSelector((state) => state.principalities.principalities);

  const isPrincipalities = location.pathname === ROUTES.PRINCIPALITIES;
  const isFeed = location.pathname.startsWith(ROUTES.FEED);
  const isDraft = location.pathname === ROUTES.DRAFT;
  const isLogin = location.pathname === ROUTES.LOGIN;

  const goToPrincipalities = () => navigate(ROUTES.PRINCIPALITIES);

  const goToFeed = () => {
    const firstId = principalities[0]?.principality_id;
    if (firstId) {
      navigate(`${ROUTES.FEED}/${firstId}`);
    }
  };

  const goToDraft = () => navigate(ROUTES.DRAFT);

  const toggleSession = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    await logoutArchaeologist(accessToken ?? "");
    dispatch(loggedOut());
    navigate(ROUTES.PRINCIPALITIES);
    dispatch(fetchPrincipalities());
  };

  return (
    <nav className="tabBar">
      <button
        type="button"
        className={`tabBarItem ${isFeed ? "tabBarItemActive" : ""}`}
        onClick={goToFeed}
      >
        <svg className="tabBarIcon" viewBox="0 0 26 26" aria-hidden="true">
          <path d="M7 4.4 L21 13 L7 21.6 Z" />
        </svg>
        {ROUTE_LABELS.FEED}
      </button>
      <button
        type="button"
        className={`tabBarItem ${isDraft ? "tabBarItemActive" : ""}`}
        disabled={!isAuthenticated}
        onClick={goToDraft}
      >
        <svg className="tabBarIcon" viewBox="0 0 26 26" aria-hidden="true">
          <rect x="2.5" y="11.7" width="21" height="2.6" rx="1.3" />
          <rect x="11.7" y="2.5" width="2.6" height="21" rx="1.3" />
        </svg>
        {ROUTE_LABELS.DRAFT}
      </button>
      <button
        type="button"
        className={`tabBarItem ${isPrincipalities ? "tabBarItemActive" : ""}`}
        onClick={goToPrincipalities}
      >
        <svg className="tabBarIcon" viewBox="0 0 26 26" aria-hidden="true">
          <rect x="2.5" y="2.5" width="9.5" height="9.5" rx="2.6" />
          <rect x="14" y="2.5" width="9.5" height="9.5" rx="2.6" />
          <rect x="2.5" y="14" width="9.5" height="9.5" rx="2.6" />
          <rect x="14" y="14" width="9.5" height="9.5" rx="2.6" />
        </svg>
        {ROUTE_LABELS.PRINCIPALITIES}
      </button>
      <button
        type="button"
        className={`tabBarItem ${isLogin ? "tabBarItemActive" : ""}`}
        onClick={toggleSession}
      >
        <svg className="tabBarIcon" viewBox="0 0 26 26" aria-hidden="true">
          {isAuthenticated ? (
            <>
              <path d="M23 11.7 H12.8 L16.4 8.1 L14.6 6.3 L7.9 13 L14.6 19.7 L16.4 17.9 L12.8 14.3 H23 Z" />
              <rect x="2.5" y="2.5" width="4" height="21" rx="1.3" />
            </>
          ) : (
            <>
              <path d="M3 11.7 H13.2 L9.6 8.1 L11.4 6.3 L18.1 13 L11.4 19.7 L9.6 17.9 L13.2 14.3 H3 Z" />
              <rect x="19.5" y="2.5" width="4" height="21" rx="1.3" />
            </>
          )}
        </svg>
        {isAuthenticated ? ROUTE_LABELS.LOGOUT : ROUTE_LABELS.LOGIN}
      </button>
    </nav>
  );
};
