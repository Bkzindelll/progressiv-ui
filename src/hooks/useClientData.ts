import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ClientData {
  id: string;
  user_id: string;
  project_name: string | null;
  status: string | null;
  progress: number;
  next_delivery: string | null;
  leads: number;
  conversions: number;
  revenue: number;
  updated_at: string;
}

export interface TimelineStep {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: string;
  step_date: string | null;
  responsible: string | null;
  notes: string | null;
  sort_order: number;
}

export interface TimelineUpdate {
  id: string;
  step_id: string;
  description: string;
  created_at: string;
}

export interface ClientFile {
  id: string;
  client_id: string;
  name: string;
  file_type: string | null;
  file_url: string;
  file_size: string | null;
  created_at: string;
}

export function useMyClientData() {
  const { user } = useAuth();
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("client_data")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setData(data as ClientData | null);
        setLoading(false);
      });
  }, [user]);

  return { data, loading };
}

export function useMyTimeline(clientId: string | undefined) {
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [updates, setUpdates] = useState<TimelineUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    Promise.all([
      supabase.from("timeline_steps").select("*").eq("client_id", clientId).order("sort_order"),
      supabase.from("timeline_updates").select("*"),
    ]).then(([stepsRes, updatesRes]) => {
      setSteps((stepsRes.data || []) as TimelineStep[]);
      setUpdates((updatesRes.data || []) as TimelineUpdate[]);
      setLoading(false);
    });
  }, [clientId]);

  return { steps, updates, loading };
}

export function useMyFiles(clientId: string | undefined) {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    supabase
      .from("client_files")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setFiles((data || []) as ClientFile[]);
        setLoading(false);
      });
  }, [clientId]);

  return { files, loading };
}
