import "./TabBar.css";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { Principality } from "../modules/principalitiesApi";

interface Props {
  principalities: Principality[];
}

export const TabBar: FC<Props> = ({ principalities }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPrincipalities = location.pathname === ROUTES.PRINCIPALITIES;
  const isFeed = location.pathname.startsWith(ROUTES.FEED);

  const goToPrincipalities = () => navigate(ROUTES.PRINCIPALITIES);

  const goToFeed = () => {
    const firstId = principalities[0]?.principality_id;
    if (firstId) {
      navigate(`${ROUTES.FEED}/${firstId}`);
    }
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
      <button type="button" className="tabBarItem" disabled>
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
      <button type="button" className="tabBarItem" disabled>
        <svg className="tabBarIcon" viewBox="0 0 26 26" aria-hidden="true">
          <path d="M3 11.7 H13.2 L9.6 8.1 L11.4 6.3 L18.1 13 L11.4 19.7 L9.6 17.9 L13.2 14.3 H3 Z" />
          <rect x="19.5" y="2.5" width="4" height="21" rx="1.3" />
        </svg>
        {ROUTE_LABELS.LOGIN}
      </button>
    </nav>
  );
};
