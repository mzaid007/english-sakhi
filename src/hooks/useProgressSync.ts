"use client";

import { useCallback, useEffect, useState } from "react";
import {
  emptyProgress,
  mergeProgress,
  progressFromCloud,
  readProgress,
  writeProgress,
  type LocalProgress,
} from "@/lib/progress";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export interface UseProgressSyncResult {
  progress: LocalProgress;
  isSynced: boolean;
  isSyncing: boolean;
  userEmail: string | null;
  refreshLocal: () => void;
  pushAndPull: () => Promise<{ ok: boolean; message_hi: string }>;
  signOut: () => Promise<void>;
}

export function useProgressSync(): UseProgressSyncResult {
  const [progress, setProgress] = useState<LocalProgress>(() => emptyProgress());
  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const refreshLocal = useCallback(() => {
    setProgress(readProgress());
  }, []);

  useEffect(() => {
    refreshLocal();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
      setIsSynced(Boolean(data.session));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      setIsSynced(Boolean(session));
    });

    return () => sub.subscription.unsubscribe();
  }, [refreshLocal]);

  const pushAndPull = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return {
        ok: false,
        message_hi: "क्लाउड अभी जुड़ा नहीं है — बाद में कोशिश करें।",
      };
    }

    setIsSyncing(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          ok: false,
          message_hi: "पहले ईमेल से साइन इन करें।",
        };
      }

      const local = readProgress();

      const { data: remote, error: fetchError } = await supabase
        .from("progress")
        .select("streak, completed_lessons, current_day, updated_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        return {
          ok: false,
          message_hi: "प्रगति लाने में समस्या हुई — फिर से कोशिश करें।",
        };
      }

      const cloud = remote
        ? progressFromCloud(remote)
        : emptyProgress();

      const merged = mergeProgress(local, cloud);
      writeProgress(merged);
      setProgress(merged);

      const { error: upsertError } = await supabase.from("progress").upsert(
        {
          user_id: user.id,
          streak: merged.streak,
          completed_lessons: merged.completedLessons,
          current_day: merged.currentDay,
          updated_at: merged.updatedAt,
        },
        { onConflict: "user_id" },
      );

      if (upsertError) {
        return {
          ok: false,
          message_hi: "सेव करने में समस्या हुई — लोकल प्रगति सुरक्षित है।",
        };
      }

      setIsSynced(true);
      return {
        ok: true,
        message_hi: "प्रगति क्लाउड में सुरक्षित हो गई।",
      };
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setIsSynced(false);
    setUserEmail(null);
  }, []);

  return {
    progress,
    isSynced,
    isSyncing,
    userEmail,
    refreshLocal,
    pushAndPull,
    signOut,
  };
}
