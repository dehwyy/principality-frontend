import { FC, MouseEvent } from "react";
import { Card } from "react-bootstrap";
import "./PrincipalityCard.css";

const defaultImage = "/DefaultImage.jpg";

interface ICardProps {
  principality_image_url: string;
  principality_name: string;
  founding_date: string;
  land_coefficient: number;
  principality_like_count: number;
  onClick: () => void;
  onDelete?: () => void;
}

export const PrincipalityCard: FC<ICardProps> = ({
  principality_image_url,
  principality_name,
  founding_date,
  land_coefficient,
  principality_like_count,
  onClick,
  onDelete,
}) => {
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete?.();
  };

  return (
    <Card className="principalityCard" onClick={onClick}>
      <div className="principalityCard__media">
        <Card.Img
          className="principalityCard__poster"
          variant="top"
          src={principality_image_url || defaultImage}
        />
        <span className="principalityCard__likes">
          <svg className="principalityCard__likesGlyph" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-8-5.1-8-10.2A4.8 4.8 0 0 1 12 7.6 4.8 4.8 0 0 1 20 10.8C20 15.9 12 21 12 21z" />
          </svg>
          {principality_like_count}
        </span>
        {onDelete && (
          <button
            type="button"
            className="principalityCard__delete"
            aria-label="Удалить княжество"
            onClick={handleDelete}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2zM4 6h16v1.5H4z" />
            </svg>
          </button>
        )}
      </div>
      <Card.Body>
        <Card.Title>{principality_name}</Card.Title>
        <Card.Text className="principalityCard__founding">
          {Number(founding_date.slice(0, 4))}
        </Card.Text>
        <span className="principalityCard__landCoefficient">
          коэф. земли {land_coefficient}
        </span>
      </Card.Body>
    </Card>
  );
};
