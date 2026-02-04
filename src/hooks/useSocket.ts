// hooks/useSocket.ts
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export const useSocket = (url: string, isAuthenticated: boolean) => {
  const [status, setStatus] = useState<"idle" | "searching" | "chatting">(
    "idle",
  );
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = io(url, { transports: ["websocket"] });

    socketRef.current.on("match:found", (data) => {
      setRoomUrl(data.url);
      setStatus("chatting");
    });

    socketRef.current.on("queue:searching", () => setStatus("searching"));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url, isAuthenticated]);

  const joinQueue = (role: "venter" | "listener") => {
    socketRef.current?.emit("queue:join", { role });
    setStatus("searching");
  };

  const leaveQueue = () => {
    socketRef.current?.emit("queue:leave");
    setStatus("idle");
  };

  return {
    status,
    roomUrl,
    joinQueue,
    leaveQueue,
    setStatus,
    setRoomUrl,
    socket: socketRef,
  };
};
