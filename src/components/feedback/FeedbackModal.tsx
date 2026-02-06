import React, { useState } from "react";
import Button from "../ui/Button";
import "./FeedbackModal.css";

interface FeedbackModalProps {
  onSubmit: (rating: number) => void;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onSubmit, onClose }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedRating !== null) {
      onSubmit(selectedRating);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Valuta l'ascoltatore</h2>
        <p className="modal-message">Come valuteresti l'esperienza?</p>
        
        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              className={`rating-button ${selectedRating === rating ? "selected" : ""}`}
              onClick={() => setSelectedRating(rating)}
            >
              {"⭐".repeat(rating)}
            </button>
          ))}
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
