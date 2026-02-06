import React, { useState } from "react";
import Button from "../ui/Button";
import "./FeedbackModal.css";

interface FeedbackModalProps {
  onSubmit: (rating: number) => void;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onSubmit, onClose }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedRating !== null) {
      onSubmit(selectedRating);
      onClose();
    }
  };

  const currentRating = hoverRating ?? selectedRating ?? 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Valuta l'ascoltatore</h2>
        <p className="modal-message">Come valuteresti l'esperienza?</p>
        
        <div className="rating-holder">
          <div 
            className="c-rating" 
            data-rating-value={currentRating}
            onMouseLeave={() => setHoverRating(null)}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                onMouseEnter={() => setHoverRating(rating)}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Salta
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={selectedRating === null}
          >
            Invia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
