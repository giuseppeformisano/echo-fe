// hooks/useSocket.ts
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export const useSocket = (url: string, isAuthenticated: boolean) => {
  const [status, setStatus] = useState<"idle" | "searching" | "chatting">(
    "idle",
  );
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<"venter" | "listener" | null>(
    null
  );
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = io(url, { transports: ["websocket"] });

    socketRef.current.on("match:found", (data) => {
      setRoomUrl(data.url);
      setRoomId(data.roomId);
      setStatus("chatting");
    });

    socketRef.current.on("queue:searching", () => setStatus("searching"));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url, isAuthenticated]);

  const joinQueue = (role: "venter" | "listener", userId?: string) => {
    const payload: { role: string; userId?: string } = { role };
    if (userId) {
      payload.userId = userId;
    }
    socketRef.current?.emit("queue:join", payload);
    setCurrentRole(role);
    setStatus("searching");
  };

  const leaveQueue = () => {
    socketRef.current?.emit("queue:leave");
    setCurrentRole(null);
    setRoomId(null);
    setStatus("idle");
  };

  return {
    status,
    roomUrl,
    roomId,
    joinQueue,
    leaveQueue,
    setStatus,
    setRoomUrl,
    setRoomId,
    socket: socketRef,
    currentRole,
  };
};
