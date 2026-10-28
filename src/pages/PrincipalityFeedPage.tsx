import "./PrincipalityFeedPage.css";
import { FC, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { PRINCIPALITIES_MOCK } from "../modules/mock";
import { ROUTES } from "../Routes";
import { AppOutletContext } from "../AppLayout";

const defaultImage = "/DefaultImage.jpg";
const defaultVideo = "/DefaultVideo.mp4";

export const PrincipalityFeedPage: FC = () => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { principalities } = useOutletContext<AppOutletContext>();

  const principality =
    principalities.find((entry) => String(entry.principality_id) === id) ??
    PRINCIPALITIES_MOCK.find((entry) => String(entry.principality_id) === id);

  const handleNext = () => {
    if (!id || !principalities.length) return;
    const currentIndex = principalities.findIndex(
      (entry) => String(entry.principality_id) === id
    );
    const nextPrincipality = principalities[currentIndex + 1] ?? principalities[0];
    setSummaryExpanded(false);
    navigate(`${ROUTES.FEED}/${nextPrincipality.principality_id}`);
  };

  if (!principality) {
    return (
      <div className="feedPage">
        <h1 className="feedMissing">Княжество не найдено</h1>
      </div>
    );
  }

  return (
    <div className="feedPage">
      <video
        className="feedVideo"
        src={principality.principality_video_url || defaultVideo}
        poster={principality.principality_image_url || defaultImage}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="feedScrim" />
      <div className="feedRail">
        <span className="feedField">
          <span className="feedFieldValue">{Number(principality.founding_date.slice(0, 4))}</span>
          <span className="feedFieldCaption">основано</span>
        </span>
        <span className="feedField">
          <span className="feedFieldValue">{principality.land_coefficient}</span>
          <span className="feedFieldCaption">коэф. земли</span>
        </span>
        <span className="feedLikes">
          <svg className="feedLikesGlyph" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-8-5.1-8-10.2A4.8 4.8 0 0 1 12 7.6 4.8 4.8 0 0 1 20 10.8C20 15.9 12 21 12 21z" />
          </svg>
          {principality.principality_like_count}
        </span>
        <Button className="feedNextBtn" onClick={handleNext}>
          Далее
        </Button>
      </div>
      <div className="feedOverlay">
        <h1 className="feedTitle">{principality.principality_name}</h1>
        <p className={`feedSummary ${summaryExpanded ? "feedSummaryExpanded" : ""}`}>
          {principality.principality_summary}
        </p>
        <button
          type="button"
          className="feedSummaryToggle"
          onClick={() => setSummaryExpanded(!summaryExpanded)}
        >
          {summaryExpanded ? "Меньше" : "Больше"}
        </button>
      </div>
    </div>
  );
};
