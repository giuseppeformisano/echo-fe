import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  credits: number;
  xp: number;
  rank: string;
}

export function useProfile(session: Session | null) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUserProfile(data as UserProfile);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchProfile(session.user.id);
    }
  }, [session]);

  return { userProfile, setUserProfile, loading };
}