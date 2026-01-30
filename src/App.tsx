import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import DailyIframe, { type DailyCall } from '@daily-co/daily-js';
import { useErrorHandler } from './hooks/useErrorHandler';
import { ErrorBanner } from './components/ErrorBanner';
import './App.css';

interface MatchData {
  url: string;
}

type AppStatus = 'idle' | 'searching' | 'chatting';

// Se sei su Vercel, userà l'URL di Render. In locale, userà localhost.
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

function App() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const { errors, removeError } = useErrorHandler();

  const socketRef = useRef<Socket | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);

  useEffect(() => {
    // In produzione (Render), Socket.io ha bisogno di HTTPS/WSS
    socketRef.current = io(SOCKET_URL, {
      reconnection: true, 
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ['websocket'], // Forza websocket per evitare problemi di CORS/Polling
    });

    socketRef.current.on('queue:searching', () => {
      setStatus('searching');
    });

    socketRef.current.on('match:found', (data: MatchData) => {
      setRoomUrl(data.url);
      setStatus('chatting');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Errore connessione server:', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (status === 'chatting' && roomUrl && videoContainerRef.current && !callFrameRef.current) {      
      try {
        callFrameRef.current = DailyIframe.createFrame(videoContainerRef.current, {
          showLeaveButton: true,
          iframeStyle: { width: '100%', height: '100%', border: '0', borderRadius: '12px' }
        });
        
        callFrameRef.current.join({ url: roomUrl });
        
        callFrameRef.current.on('left-meeting', () => {
          callFrameRef.current?.destroy();
          callFrameRef.current = null;
          setRoomUrl(null);
          setStatus('idle');
        });
      } catch (err) {
        console.error(`❌ Errore Daily:`, err);
      }
    }
  }, [status, roomUrl]);

  return (
    <div className={`app-container ${status === 'chatting' ? 'chatting' : ''}`}>
      <ErrorBanner errors={errors} onRemoveError={removeError} />

      <header className="header">
        <h1>Echo 🌿</h1>
        <p>Uno spazio sicuro per sfogarsi o ascoltare.</p>
      </header>

      <main className="main-content">
        {status === 'idle' && (
          <button onClick={() => socketRef.current?.emit('queue:join')} className="btn-primary">
            Inizia a parlare
          </button>
        )}

        {status === 'searching' && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Cercando una persona pronta ad ascoltarti...</p>
            <button onClick={() => window.location.reload()} className="btn-secondary">
              Annulla ricerca
            </button>
          </div>
        )}

        {status === 'chatting' && (
          <div className="video-wrapper">
            <div ref={videoContainerRef} className="video-container" />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;