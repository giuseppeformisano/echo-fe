import React, { useState } from "react";
import Button from "../ui/Button";
import "./FeedbackModal.css";

interface FeedbackPayload {
  empathy: number;
  presence: number;
  non_judgment: number;
  usefulness: number;
  comment?: string | null;
}

interface FeedbackModalProps {
  onSubmit: (payload: FeedbackPayload) => void;
  onClose: () => void;
}

const RatingRow: React.FC<{
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => {
  return (
    <div className="fb-rating-row">
      <div className="fb-rating-label">{label}</div>
      <div className="fb-c-rating" data-rating-value={value ?? 0}>
        {[1, 2, 3, 4, 5].map((r) => (
          <button key={r} onClick={() => onChange(r)}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onSubmit, onClose }) => {
  const [empathy, setEmpathy] = useState<number | null>(null);
  const [presence, setPresence] = useState<number | null>(null);
  const [nonJudgment, setNonJudgment] = useState<number | null>(null);
  const [usefulness, setUsefulness] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");

  const allSet =
    empathy !== null &&
    presence !== null &&
    nonJudgment !== null &&
    usefulness !== null;

  const handleSubmit = () => {
    if (!allSet) return;
    onSubmit({
      empathy: empathy as number,
      presence: presence as number,
      non_judgment: nonJudgment as number,
      usefulness: usefulness as number,
      comment: comment?.trim() || null,
    } as any);
    onClose();
  };

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="fb-modal-title">Valuta l'ascoltatore</h2>

        <RatingRow label="Empatia" value={empathy} onChange={setEmpathy} />
        <RatingRow label="Presenza / Attenzione" value={presence} onChange={setPresence} />
        <RatingRow label="Spazio sicuro / Non-giudizio" value={nonJudgment} onChange={setNonJudgment} />
        <RatingRow label="Utilità percepita" value={usefulness} onChange={setUsefulness} />

        <div className="fb-comment-block">
          <label>Commento (opzionale)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Vuoi aggiungere qualcosa?"
          />
        </div>

        <div className="fb-modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Salta
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!allSet}>
            Invia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
