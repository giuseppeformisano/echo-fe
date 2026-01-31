// fe/src/components/ChattingView.tsx
import React, { useEffect, useRef } from 'react';
import DailyIframe, { type DailyCall } from '@daily-co/daily-js';
import './ChattingView.css';

interface ChattingViewProps {
  roomUrl: string;
  onLeave: () => void;
}

const ChattingView: React.FC<ChattingViewProps> = ({ roomUrl, onLeave }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);

  useEffect(() => {
    if (videoContainerRef.current && !callFrameRef.current) {
      try {
        callFrameRef.current = DailyIframe.createFrame(videoContainerRef.current, {
          showLeaveButton: true,
          iframeStyle: { width: '100%', height: '100%', border: '0' }
        });
        
        callFrameRef.current.join({ url: roomUrl });
        
        callFrameRef.current.on('left-meeting', () => {
          callFrameRef.current?.destroy();
          callFrameRef.current = null;
          onLeave();
        });
      } catch (err) {
        console.error(`❌ Errore Daily:`, err);
      }
    }

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [roomUrl, onLeave]);

  return (
    <div className="video-wrapper">
      <div ref={videoContainerRef} className="video-container" />
    </div>
  );
};

export default ChattingView;
