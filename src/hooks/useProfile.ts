import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import type { Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  username: string;
  credits: number;
  xp: number;
  rank: string;
  rating_avg: number;
  rating_count: number;
}

export function useProfile(session: Session | null) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setUserProfile(data as UserProfile);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user.id && !fetchedRef.current) {
      fetchProfile(session.user.id);
      fetchedRef.current = true;
    }
  }, [session?.user.id]);

  const refetchProfile = () => {
    if (session?.user.id) {
      fetchProfile(session.user.id);
    }
  };

  return { userProfile, setUserProfile, loading, refetchProfile };
}