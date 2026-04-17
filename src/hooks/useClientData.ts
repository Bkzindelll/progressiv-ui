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
  start_date: string | null;
  end_date: string | null;
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
  client_feedback: string | null;
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

export interface RecentActivity {
  id: string;
  type: "step" | "update";
  title: string;
  description: string;
  status?: string;
  date: string;
}

export function useMyClientData() {
  const { user, isReady } = useAuth();
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !user) {
      if (isReady) setLoading(false);
      return;
    }
    supabase
      .from("client_data")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setData(data as ClientData | null);
        setLoading(false);
      });
  }, [user, isReady]);

  return { data, loading };
}

export function useMyTimeline(clientId: string | undefined) {
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [updates, setUpdates] = useState<TimelineUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    if (!clientId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      supabase.from("timeline_steps").select("*").eq("client_id", clientId).order("sort_order"),
      supabase.from("timeline_updates").select("*"),
    ]).then(([stepsRes, updatesRes]) => {
      setSteps((stepsRes.data || []) as TimelineStep[]);
      setUpdates((updatesRes.data || []) as TimelineUpdate[]);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, [clientId]);

  return { steps, updates, loading, refetch: fetchData };
}

export function useMyFiles(clientId: string | undefined) {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) { setLoading(false); return; }
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

export function useRecentActivity(clientId: string | undefined) {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) { setLoading(false); return; }

    Promise.all([
      supabase.from("timeline_steps").select("*").eq("client_id", clientId).order("updated_at", { ascending: false }).limit(5),
      supabase.from("timeline_updates").select("*, timeline_steps!inner(client_id, title)").limit(10),
    ]).then(([stepsRes, updatesRes]) => {
      const stepActivities: RecentActivity[] = (stepsRes.data || []).map((s: any) => ({
        id: s.id,
        type: "step" as const,
        title: s.title,
        description: s.description || `Status: ${s.status}`,
        status: s.status,
        date: s.updated_at,
      }));

      const updateActivities: RecentActivity[] = (updatesRes.data || [])
        .filter((u: any) => u.timeline_steps?.client_id === clientId)
        .map((u: any) => ({
          id: u.id,
          type: "update" as const,
          title: u.timeline_steps?.title || "Update",
          description: u.description,
          date: u.created_at,
        }));

      const all = [...stepActivities, ...updateActivities]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setActivities(all);
      setLoading(false);
    });
  }, [clientId]);

  return { activities, loading };
}
