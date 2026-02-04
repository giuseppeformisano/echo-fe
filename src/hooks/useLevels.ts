import { useState, useEffect } from "react";
import type { Level } from "../utils/xpUtils";
import { supabase } from "../supabaseClient";

export function useLevels(isAuthenticated: boolean) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLevels([]);
      return;
    }

    const fetchLevels = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("levels")
          .select("*")
          .order("min_xp_total", { ascending: true });

        if (error) throw error;
        if (data) setLevels(data as Level[]);
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [isAuthenticated]);

  return { levels, loading };
}