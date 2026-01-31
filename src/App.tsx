import { useState } from 'react';
import ProfileDashboard from './components/ProfileDashboard';
import LoginPage from './components/LoginPage';
import SearchingOverlay from './components/SearchingOverlay';
import ChattingView from './components/ChattingView';
import './App.css';
import { useSocket } from './hooks/useSocket';

// Se sei su Vercel, userà l'URL di Render. In locale, userà localhost.
// const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = 'https://192.168.1.54:4000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { status, roomUrl, joinQueue, leaveQueue, setStatus } = 
    useSocket(SOCKET_URL, isAuthenticated);

  // Render condizionale pulito
  if (!isAuthenticated) return <LoginPage onLogin={() => setIsAuthenticated(true)} />;

  if (status === 'chatting') {
    return <ChattingView roomUrl={roomUrl!} onLeave={() => setStatus('idle')} />;
  }

  return (
    <div className={`app-container ${status === 'searching' ? 'is-searching' : ''}`}>
      <ProfileDashboard
        name="Marco"
        stats={{ credits: 3, xp: 150, rank: 'Novizio' }}
        onSfogati={() => joinQueue('venter')}
      />
      
      {status === 'searching' && <SearchingOverlay onCancel={leaveQueue} />}
    </div>
  );
}

export default App;
