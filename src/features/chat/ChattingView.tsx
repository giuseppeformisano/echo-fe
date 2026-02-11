import React, { useEffect, useRef, useState } from "react";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";
import { Socket } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import FeedbackModal from "../../components/feedback/FeedbackModal";
import "./ChattingView.css";

interface ChattingViewProps {
  roomUrl: string;
  roomId: string;
  onLeave: () => void;
  socket: React.RefObject<Socket | null>;
  role?: "venter" | "listener";
}

const ChattingView: React.FC<ChattingViewProps> = ({
  roomUrl,
  roomId,
  onLeave,
  socket,
  role = "venter",
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);
  const onLeaveRef = useRef(onLeave);
  const socketRef = useRef(socket);
  const { session } = useAuth();
  const { userProfile } = useProfile(session);
  const [showFeedback, setShowFeedback] = useState(false);

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
          .then(() => {
            if (socketRef.current?.current && userProfile?.id) {
              socketRef.current.current.emit("call:joined", {
                roomId: roomId,
                userId: userProfile.id,
                role: role,
              });
              console.log(
                `📞 Notificato join alla stanza: ${roomId} (${role})`
              );
            }
          })
          .catch((err) => {
            console.error(`❌ Errore join Daily:`, err);
          });

        callFrameRef.current.on("left-meeting", () => {
          callFrameRef.current?.leave();
          callFrameRef.current?.destroy();
          callFrameRef.current = null;
          
          if (role === "venter") {
            // Chiama queue:leave via socket senza smontare il componente
            socketRef.current?.current?.emit("queue:leave");
            
            // Mostra feedback dopo delay per salvare sessione
            setTimeout(() => {
              setShowFeedback(true);
            }, 1500);
          } else {
            // Listener esce normalmente
            onLeaveRef.current();
          }
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
  }, [roomUrl, roomId, userProfile?.id, role]);

  const handleFeedbackSubmit = (payload: {
    empathy: number;
    presence: number;
    non_judgment: number;
    usefulness: number;
    comment?: string | null;
  }) => {
    if (socketRef.current?.current && roomId) {
      socketRef.current.current.emit("call:submit_feedback", {
        roomId,
        ...payload,
      });
      const avg = (
        payload.empathy +
        payload.presence +
        payload.non_judgment +
        payload.usefulness
      ) / 4.0;
      console.log(`⭐ Feedback inviato: avg=${avg.toFixed(2)} for room ${roomId}`);
    }
    setShowFeedback(false);
    onLeaveRef.current();
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    onLeaveRef.current();
  };

  return (
    <>
      <div className="video-wrapper">
        <div ref={videoContainerRef} className="video-container" />
      </div>
      
      {showFeedback && (
        <FeedbackModal
          onSubmit={handleFeedbackSubmit}
          onClose={handleFeedbackClose}
        />
      )}
    </>
  );
};

export default ChattingView;