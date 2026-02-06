import { useState } from "react";
import LoginPage from "../features/auth/LoginPage";
import ChattingView from "../features/chat/ChattingView";
import Navbar from "../components/layout/Navbar";
import LoadingScreen from "../components/feedback/LoadingScreen";
import DashboardView from "../features/dashboard/DashboardView";
import SettingsPage from "../features/settings/SettingsPage";
import UsernameSetup from "../features/auth/UsernameSetup";
import "./App.css";
import { useSocket } from "../hooks/useSocket";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useLevels } from "../hooks/useLevels";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

type View = "dashboard" | "settings";

function App() {
  const { session, isAuthenticated, loading: authLoading } = useAuth();
  const {
    userProfile,
    setUserProfile,
    loading: profileLoading,
    refetchProfile,
  } = useProfile(session);
  const { levels, loading: levelsLoading } = useLevels(isAuthenticated);
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const { status, roomUrl, roomId, joinQueue, leaveQueue, setStatus, socket, currentRole } =
    useSocket(SOCKET_URL, isAuthenticated);

  const handleLogout = () => {
    supabase.auth.signOut();
    setCurrentView("dashboard");
  };

  if (authLoading || (isAuthenticated && (profileLoading || levelsLoading))) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onGoogleLogin={() =>
          supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin },
          })
        }
      />
    );
  }

  if (userProfile && !userProfile.username) {
    return (
      <UsernameSetup
        onUsernameSet={(username) =>
          setUserProfile({ ...userProfile, username })
        }
      />
    );
  }

  if (status === "chatting") {
    return (
      <ChattingView
        roomUrl={roomUrl!}
        roomId={roomId!}
        socket={socket}
        role={currentRole || "venter"}
        onLeave={() => {
          leaveQueue();
          setStatus("idle");
          refetchProfile();
        }}
      />
    );
  }

  return (
    <div className="app-wrapper">
      <Navbar
        onProfileClick={() => setCurrentView("settings")}
        onLogout={handleLogout}
      />

      <main className="app-main-content">
        {currentView === "dashboard" ? (
          <DashboardView
            name={
              userProfile?.username ||
              session?.user?.user_metadata?.first_name ||
              session?.user?.email?.split("@")[0] ||
              "Utente"
            }
            stats={{
              credits: userProfile?.credits || 0,
              xp: userProfile?.xp || 0,
              rank: userProfile?.rank || "Novizio",
            }}
            levels={levels}
            onSfogati={() => joinQueue("venter", userProfile?.id)}
            onAscolta={() => joinQueue("listener", userProfile?.id)}
            status={status}
            leaveQueue={leaveQueue}
          />
        ) : (
          <SettingsPage
            profile={userProfile}
            onProfileUpdate={(updated) => setUserProfile(updated)}
            onBack={() => setCurrentView("dashboard")}
          />
        )}
      </main>
    </div>
  );
}

export default App;