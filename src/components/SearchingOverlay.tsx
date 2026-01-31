// fe/src/components/SearchingOverlay.tsx
import React from 'react';
import './SearchingOverlay.css';
import Button from './Button';

interface SearchingOverlayProps {
  onCancel: () => void;
}

const SearchingOverlay: React.FC<SearchingOverlayProps> = ({ onCancel }) => {
  return (
    <div className="search-overlay">
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Cercando una persona pronta ad ascoltarti...</p>
        <Button onClick={onCancel} variant="secondary">
          Annulla ricerca
        </Button>
      </div>
    </div>
  );
};

export default SearchingOverlay;

