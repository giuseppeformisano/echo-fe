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

const SOCKET_URL = 'https://192.168.1.54:4000';

function App() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { errors, removeError } = useErrorHandler();

  const socketRef = useRef<Socket | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      reconnection: false, // Disabilita i tentativi automatici dopo il primo fallimento
      timeout: 5000,       // Se il server non risponde entro 5 secondi, considera il tentativo fallito
    }); 

    addLog('Socket inizializzato');

    socketRef.current.on('queue:searching', () => {
      addLog('Status: Searching');
      setStatus('searching');
    });

    socketRef.current.on('match:found', (data: MatchData) => {
      addLog(`Match found! URL: ${data.url}`);
      setRoomUrl(data.url);
      setStatus('chatting');
    });

    socketRef.current.on('error', (errorData: any) => {
      const msg = errorData?.message || 'Errore di connessione';
      addLog(`❌ Socket error: ${msg}`);
      console.error('Socket error:', msg);
    });

    socketRef.current.on('connect_error', (err: any) => {
      addLog(`❌ Connect error: ${err.message}`);
      console.error('Impossibile connettersi al server. Riprova.');
    });

    socketRef.current.on('disconnect', (reason: string) => {
      addLog(`❌ Disconnected: ${reason}`);
      if (reason === 'io server disconnect') {
        console.error('Disconnesso dal server.');
      }
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
          iframeStyle: { width: '100%', height: '100%', border: '0' }
        });
        
        callFrameRef.current.join({ url: roomUrl });
        
        callFrameRef.current.on('left-meeting', () => {
          console.warn(`👋 Left meeting`);
          callFrameRef.current?.destroy();
          callFrameRef.current = null;
          setStatus('idle');
        });
      } catch (err) {
        console.error(`❌ Errore creazione iframe:`, err);
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