/**
 * Supabase Chat Sessions Service (Frontend)
 * Questo file fornisce utility per interrogare le sessioni salvate
 */

import { supabase } from '../supabaseClient';

export interface ChatSession {
  id: number;
  room_id: string;
  venter_id: string;
  listener_id: string;
  duration_seconds: number;
  started_at: string;
  ended_at: string;
  venter_xp_earned: number;
  listener_xp_earned: number;
  completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

class ChatSessionService {
  /**
   * Recupera tutte le sessioni dell'utente corrente
   */
  async getUserSessions(): Promise<ChatSession[]> {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      console.warn("⚠️ Utente non loggato");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .or(`venter_id.eq.${user.user.id},listener_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Errore recupero sessioni:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Errore:', error);
      return [];
    }
  }

  /**
   * Recupera le sessioni come Venter (chi sfoga)
   */
  async getVenterSessions(): Promise<ChatSession[]> {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('venter_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Errore:', error);
      return [];
    }
  }

  /**
   * Recupera le sessioni come Listener (chi ascolta)
   */
  async getListenerSessions(): Promise<ChatSession[]> {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('listener_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Errore:', error);
      return [];
    }
  }

  /**
   * Recupera statistiche dell'utente
   */
  async getUserStats() {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('duration_seconds, venter_xp_earned, listener_xp_earned')
        .or(`venter_id.eq.${user.user.id},listener_id.eq.${user.user.id}`)
        .eq('completed', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          total_sessions: 0,
          total_duration_seconds: 0,
          average_duration_seconds: 0,
          total_xp_earned: 0,
        };
      }

      const totalDuration = data.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
      const totalXp = data.reduce((sum, session) => {
        const xp = (session.venter_xp_earned || 0) + (session.listener_xp_earned || 0);
        return sum + xp;
      }, 0);

      return {
        total_sessions: data.length,
        total_duration_seconds: totalDuration,
        average_duration_seconds: Math.round(totalDuration / data.length),
        total_xp_earned: totalXp,
      };
    } catch (error) {
      console.error('❌ Errore:', error);
      return null;
    }
  }

  /**
   * Recupera una sessione specifica
   */
  async getSession(roomId: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('room_id', roomId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('❌ Errore:', error);
      return null;
    }
  }

  /**
   * Recupera le sessioni del mese corrente
   */
  async getMonthSessions(): Promise<ChatSession[]> {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      return [];
    }

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .or(`venter_id.eq.${user.user.id},listener_id.eq.${user.user.id}`)
        .gte('created_at', startOfMonth.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Errore:', error);
      return [];
    }
  }

  /**
   * Subscribe a real-time updates delle proprie sessioni
   */
  subscribeToSessions(callback: (sessions: ChatSession[]) => void) {
    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (!sessionData?.session?.user?.id) {
        console.warn("⚠️ Utente non loggato");
        return;
      }

      const userId = sessionData.session.user.id;
 
      // Real-time subscription
      supabase
        .channel('chat_sessions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_sessions',
            filter: `venter_id=eq.${userId}`,
          },
          () => {
            this.getUserSessions().then(callback);
          }
        )
        .subscribe();
    });

    // Ritorna una funzione di cleanup
    return () => {
      // Cleanup se necessario
    };
  }
}

export const chatSessionService = new ChatSessionService();
