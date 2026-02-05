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
  const onLeaveRef = useRef(onLeave);
  const socketRef = useRef(socket);

  useEffect(() => {
    onLeaveRef.current = onLeave;
  }, [onLeave]);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    if (!roomUrl) {
      return;
    }

    if (videoContainerRef.current && !callFrameRef.current) {
      try {
        while (videoContainerRef.current.firstChild) {
          videoContainerRef.current.removeChild(
            videoContainerRef.current.firstChild
          );
        }

        callFrameRef.current = DailyIframe.createFrame(
          videoContainerRef.current,
          {
            showLeaveButton: true,
            iframeStyle: { width: "100%", height: "100%", border: "0" },
            allowMultipleCallInstances: true,
          }
        );

        callFrameRef.current
          .join({ url: roomUrl })
          .then((joinData) => {
            if (joinData?.room && socketRef.current?.current) {
              socketRef.current.current.emit("call:joined", {
                roomId: joinData.room,
              });
              console.log(`📞 Notificato join alla stanza: ${joinData.room}`);
            }
          })
          .catch((err) => {
            console.error(`❌ Errore join Daily:`, err);
          });

        callFrameRef.current.on("left-meeting", () => {
          callFrameRef.current?.leave();
          callFrameRef.current?.destroy();
          callFrameRef.current = null;
          onLeaveRef.current();
        });
      } catch (err) {
        console.error(`❌ Errore Daily:`, err);
      }
    }

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.leave();
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [roomUrl]);

  return (
    <div className="video-wrapper">
      <div ref={videoContainerRef} className="video-container" />
    </div>
  );
};

export default ChattingView;