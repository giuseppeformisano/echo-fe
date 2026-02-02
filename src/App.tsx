import { useState } from 'react';
import ProfileDashboard from './components/ProfileDashboard';
import LoginPage from './components/LoginPage';
import SearchingOverlay from './components/SearchingOverlay';
import ChattingView from './components/ChattingView';
import Navbar from './components/Navbar';
import './App.css';
import { useSocket } from './hooks/useSocket';
import { supabase } from './supabaseClient';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import SettingsPage from './SettingsPage';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

type View = 'dashboard' | 'settings';

function App() {
  const { session, isAuthenticated, loading: authLoading } = useAuth();
  const { userProfile, setUserProfile, loading: profileLoading } = useProfile(session);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const { status, roomUrl, joinQueue, leaveQueue, setStatus } =
    useSocket(SOCKET_URL, isAuthenticated);

  const handleLogout = () => {
    supabase.auth.signOut();
    setCurrentView('dashboard');
  };

  if (authLoading || (isAuthenticated && profileLoading)) {
    return <div className="loading-screen">Caricamento...</div>;
  }

  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={() => supabase.auth.signInWithOAuth({ 
          provider: 'google', 
          options: { redirectTo: window.location.origin } 
        })} 
      />
    );
  }

  if (status === 'chatting') {
    return (
      <ChattingView 
        roomUrl={roomUrl!} 
        onLeave={() => {
          leaveQueue();
          setStatus('idle');
        }} 
      />
    );
  }

  return (
    <div className="app-wrapper">
      <Navbar 
        onProfileClick={() => setCurrentView('settings')} 
        onLogout={handleLogout} 
      />
      
      <main className={`app-container ${status === 'searching' ? 'is-searching' : ''}`}>
        {currentView === 'dashboard' ? (
          <ProfileDashboard
            name={userProfile?.username || session?.user?.user_metadata?.first_name || session?.user?.email?.split('@')[0] || 'Utente'}
            stats={{ 
              credits: userProfile?.credits || 0, 
              xp: userProfile?.xp || 0, 
              rank: userProfile?.rank || 'Novizio' 
            }}
            onSfogati={() => joinQueue('venter')} 
          />
        ) : (
          <SettingsPage 
            profile={userProfile} 
            onProfileUpdate={(updated) => setUserProfile(updated)}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {status === 'searching' && <SearchingOverlay onCancel={leaveQueue} />}
      </main>
    </div>
  );
}

export default App;
