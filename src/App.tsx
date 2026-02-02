import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import ProfileDashboard from './components/ProfileDashboard';
import LoginPage from './components/LoginPage';
import SearchingOverlay from './components/SearchingOverlay';
import ChattingView from './components/ChattingView';
import './App.css';
import { useSocket } from './hooks/useSocket';
import { supabase } from './supabaseClient';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

interface UserProfile {
  id: string;
  username: string;
  credits: number;
  xp: number;
  rank: string;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUserProfile(data as UserProfile);
        console.log("Profilo caricato:", data);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user.id) fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user.id) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!session;
  const { status, roomUrl, joinQueue, leaveQueue, setStatus } = 
    useSocket(SOCKET_URL, isAuthenticated);

  // Render condizionale pulito
  if (!isAuthenticated) return <LoginPage onLogin={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })} />;

  if (status === 'chatting') {
    return <ChattingView roomUrl={roomUrl!} onLeave={() => {
      leaveQueue(); // Notifica al server che l'utente sta lasciando il contesto (coda o stanza)
      setStatus('idle');
    }} />;
  }

  return (
    <div className={`app-container ${status === 'searching' ? 'is-searching' : ''}`}>
      <ProfileDashboard
        name={userProfile?.username || session?.user?.user_metadata?.first_name || session?.user?.email?.split('@')[0] || 'Utente'}
        stats={{ credits: userProfile?.credits!, xp: userProfile?.xp!, rank: userProfile?.rank! }}
        onSfogati={() => joinQueue('venter')}
      />
      
      {status === 'searching' && <SearchingOverlay onCancel={leaveQueue} />}
    </div>
  );
}

export default App;
