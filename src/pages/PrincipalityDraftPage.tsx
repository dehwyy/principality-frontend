import "./PrincipalityDraftPage.css";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { BlockingSpinner } from "../components/BlockingSpinner";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createPrincipalityDraft,
  fetchPrincipalityDraft,
  publishPrincipalityDraft,
} from "../slices/principalityDraftSlice";
import { deletePrincipality } from "../slices/principalitiesSlice";

const defaultImage = "/DefaultImage.jpg";
const defaultVideo = "/DefaultVideo.mp4";

export const PrincipalityDraftPage: FC = () => {
  const [principalityName, setPrincipalityName] = useState("");
  const [principalityImage, setPrincipalityImage] = useState<File | null>(null);
  const [principalityVideo, setPrincipalityVideo] = useState<File | null>(null);
  const [principalitySummary, setPrincipalitySummary] = useState("");
  const [foundingDate, setFoundingDate] = useState("");
  const [landCoefficient, setLandCoefficient] = useState("0.55");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.archaeologist.isAuthenticated);
  const { draft, loading, error } = useAppSelector((state) => state.principalityDraft);
  const imagePreview = useMemo(
    () => (principalityImage ? URL.createObjectURL(principalityImage) : null),
    [principalityImage]
  );

  const videoPreview = useMemo(
    () => (principalityVideo ? URL.createObjectURL(principalityVideo) : null),
    [principalityVideo]
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPrincipalityDraft());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!principalityImage || !principalityVideo) return;
    dispatch(
      createPrincipalityDraft({
        principality_name: principalityName,
        principality_image: principalityImage,
        principality_video: principalityVideo,
      })
    );
  };

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const published = await dispatch(
      publishPrincipalityDraft({
        principality_summary: principalitySummary,
        founding_date: foundingDate,
        land_coefficient: Number(landCoefficient),
      })
    )
      .unwrap()
      .catch(() => null);
    if (published) {
      navigate(ROUTES.PRINCIPALITIES);
    }
  };

  const handleDelete = () => {
    if (draft) {
      dispatch(deletePrincipality(draft.principality_id));
    }
  };

  return (
    <div className="principalityDraft">
      <h1 className="principalityDraft__title">Добавление княжества</h1>
      {loading && <BlockingSpinner />}
      {error && <Alert variant="danger" className="principalityDraft__alert">{error}</Alert>}

      {draft ? (
        <>
          <div className="principalityDraft__card">
            <div className="principalityDraft__media">
              <img
                className="principalityDraft__preview"
                src={draft.principality_image_url || defaultImage}
                alt={draft.principality_name}
              />
              <video
                className="principalityDraft__preview"
                key={draft.principality_video_url || defaultVideo}
                src={draft.principality_video_url || defaultVideo}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className="principalityDraft__cardBody">
              <span className="principalityDraft__status">черновик</span>
              <h2 className="principalityDraft__name">{draft.principality_name}</h2>
            </div>
          </div>
          <Form className="principalityDraft__form" onSubmit={handlePublish}>
            <Form.Group controlId="principality_summary">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={principalitySummary}
                required
                onChange={(event) => setPrincipalitySummary(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="founding_date">
              <Form.Label>Дата основания</Form.Label>
              <Form.Control
                type="date"
                value={foundingDate}
                required
                onChange={(event) => setFoundingDate(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="land_coefficient">
              <Form.Label>Коэффициент земли</Form.Label>
              <Form.Control
                type="number"
                min={0.01}
                max={1}
                step={0.01}
                value={landCoefficient}
                required
                onChange={(event) => setLandCoefficient(event.target.value)}
              />
            </Form.Group>
            <div className="principalityDraft__actions">
              <Button type="submit" className="principalityDraft__publish" disabled={loading}>
                Опубликовать
              </Button>
              <Button
                type="button"
                variant="outline-dark"
                className="principalityDraft__delete"
                disabled={loading}
                onClick={handleDelete}
              >
                Удалить
              </Button>
            </div>
          </Form>
        </>
      ) : (
        <>
          <Form className="principalityDraft__form" onSubmit={handleCreate}>
            <div className="principalityDraft__media">
              <Form.Group controlId="principality_image" className="principalityDraft__mediaItem">
                <Form.Label>Изображение</Form.Label>
                <img
                  className="principalityDraft__preview"
                  src={imagePreview ?? defaultImage}
                  alt={principalityName || "Новое княжество"}
                />
                <Form.Control
                  type="file"
                  size="sm"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  required
                  onChange={(event) =>
                    setPrincipalityImage((event.target as HTMLInputElement).files?.[0] ?? null)
                  }
                />
              </Form.Group>
              <Form.Group controlId="principality_video" className="principalityDraft__mediaItem">
                <Form.Label>Видео</Form.Label>
                <video
                  className="principalityDraft__preview"
                  key={videoPreview ?? defaultVideo}
                  src={videoPreview ?? defaultVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <Form.Control
                  type="file"
                  size="sm"
                  accept="video/mp4,video/webm,video/quicktime"
                  required
                  onChange={(event) =>
                    setPrincipalityVideo((event.target as HTMLInputElement).files?.[0] ?? null)
                  }
                />
              </Form.Group>
            </div>
            <Form.Group controlId="principality_name">
              <Form.Label>Название княжества</Form.Label>
              <Form.Control
                value={principalityName}
                required
                maxLength={100}
                onChange={(event) => setPrincipalityName(event.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="principalityDraft__publish" disabled={loading}>
              Далее
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};
