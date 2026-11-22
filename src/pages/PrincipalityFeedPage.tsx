import "./PrincipalityFeedPage.css";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { BlockingSpinner } from "../components/BlockingSpinner";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchFeedPrincipality, likePrincipality } from "../slices/principalitiesSlice";

const defaultImage = `${import.meta.env.BASE_URL}/DefaultImage.jpg`;
const defaultVideo = `${import.meta.env.BASE_URL}/DefaultVideo.mp4`;

export const PrincipalityFeedPage: FC = () => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const { id } = useParams();
  const principalityId = Number(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { feedPrincipality, loading, error } = useAppSelector((state) => state.principalities);
  const isAuthenticated = useAppSelector((state) => state.archaeologist.isAuthenticated);

  const principality =
    feedPrincipality?.principality_id === principalityId ? feedPrincipality : null;

  useEffect(() => {
    if (principalityId && !principality && !loading) {
      dispatch(fetchFeedPrincipality({ principalityId }));
    }
  }, [dispatch, principalityId, principality, loading]);

  const handleNext = async () => {
    const nextPrincipality = await dispatch(
      fetchFeedPrincipality({ principalityId, next: true })
    )
      .unwrap()
      .catch(() => null);
    if (nextPrincipality) {
      setSummaryExpanded(false);
      navigate(`${ROUTES.FEED}/${nextPrincipality.principality_id}`);
    }
  };

  const handleLike = () => {
    if (!principality) return;
    dispatch(
      likePrincipality({
        principalityId,
        principality_liked: principality.principality_liked ? 0 : 1,
      })
    );
  };

  if (!principality) {
    return (
      <div className="feedPage">
        {loading && <BlockingSpinner />}
        {!loading && <h1 className="feedMissing">{error ?? "Княжество не найдено"}</h1>}
      </div>
    );
  }

  return (
    <div className="feedPage">
      {loading && <BlockingSpinner />}
      <video
        className="feedVideo"
        src={principality.principality_video_url || defaultVideo}
        poster={principality.principality_image_url || defaultImage}
        onError={(event) => {
          if (!event.currentTarget.src.endsWith(defaultVideo)) {
            event.currentTarget.poster = defaultImage;
            event.currentTarget.src = defaultVideo;
          }
        }}
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
        <button
          type="button"
          className={`feedLikes ${principality.principality_liked ? "feedLikesActive" : ""}`}
          disabled={!isAuthenticated || loading}
          aria-label="Лайк княжества"
          onClick={handleLike}
        >
          <svg className="feedLikesGlyph" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-8-5.1-8-10.2A4.8 4.8 0 0 1 12 7.6 4.8 4.8 0 0 1 20 10.8C20 15.9 12 21 12 21z" />
          </svg>
          {principality.principality_like_count}
        </button>
        <Button className="feedNextBtn" disabled={loading} onClick={handleNext}>
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
