// fe/src/components/ChattingView.tsx
import React, { useEffect, useRef } from "react";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";
import { Socket } from "socket.io-client";
import "./ChattingView.css";

interface ChattingViewProps {
  roomUrl: string;
  onLeave: () => void;
  socket: React.RefObject<Socket | null>;
}

const ChattingView: React.FC<ChattingViewProps> = ({
  roomUrl,
  onLeave,
  socket,
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);

  useEffect(() => {
    if (videoContainerRef.current && !callFrameRef.current) {
      try {
        callFrameRef.current = DailyIframe.createFrame(
          videoContainerRef.current,
          {
            showLeaveButton: true,
            iframeStyle: { width: "100%", height: "100%", border: "0" },
          },
        );

        callFrameRef.current
          .join({ url: roomUrl })
          .then((joinData) => {
            // Usa i dati dalla join per notificare il backend
            if (joinData?.room && socket.current) {
              socket.current.emit("call:joined", { roomId: joinData.room });
              console.log(`📞 Notificato join alla stanza: ${joinData.room}`);
            }
          })
          .catch((err) => {
            console.error(`❌ Errore join Daily:`, err);
          });

        callFrameRef.current.on("left-meeting", () => {
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
  }, [roomUrl, onLeave, socket]);

  return (
    <div className="video-wrapper">
      <div ref={videoContainerRef} className="video-container" />
    </div>
  );
};

export default ChattingView;
