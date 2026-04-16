import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AdminClient } from "@/pages/AdminPanel";
import type { TimelineStep, TimelineUpdate, ClientFile } from "@/hooks/useClientData";

interface Props {
  client: AdminClient;
  onUpdated: () => void;
}

export default function AdminClientEditor({ client, onUpdated }: Props) {
  const [tab, setTab] = useState<"dashboard" | "timeline" | "files">("dashboard");
  const [form, setForm] = useState({
    project_name: client.project_name || "",
    status: client.status || "Não iniciado",
    progress: client.progress,
    next_delivery: client.next_delivery || "",
    leads: client.leads,
    conversions: client.conversions,
    revenue: client.revenue,
  });
  const [saving, setSaving] = useState(false);

  // Timeline state
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [updates, setUpdates] = useState<TimelineUpdate[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(true);

  // Files state
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchTimeline = useCallback(async () => {
    setLoadingSteps(true);
    const [stepsRes, updatesRes] = await Promise.all([
      supabase.from("timeline_steps").select("*").eq("client_id", client.id).order("sort_order"),
      supabase.from("timeline_updates").select("*"),
    ]);
    setSteps((stepsRes.data || []) as TimelineStep[]);
    setUpdates((updatesRes.data || []) as TimelineUpdate[]);
    setLoadingSteps(false);
  }, [client.id]);

  const fetchFiles = useCallback(async () => {
    setLoadingFiles(true);
    const { data } = await supabase.from("client_files").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
    setFiles((data || []) as ClientFile[]);
    setLoadingFiles(false);
  }, [client.id]);

  useEffect(() => { fetchTimeline(); fetchFiles(); }, [fetchTimeline, fetchFiles]);

  const saveDashboard = async () => {
    setSaving(true);
    const { error } = await supabase.from("client_data").update({
      project_name: form.project_name,
      status: form.status,
      progress: form.progress,
      next_delivery: form.next_delivery,
      leads: form.leads,
      conversions: form.conversions,
      revenue: form.revenue,
    }).eq("id", client.id);
    
    if (error) toast({ title: "Erro ao salvar", variant: "destructive" });
    else { toast({ title: "Dados salvos!" }); onUpdated(); }
    setSaving(false);
  };

  // Timeline CRUD
  const addStep = async () => {
    await supabase.from("timeline_steps").insert({
      client_id: client.id,
      title: "Nova Etapa",
      status: "pending",
      sort_order: steps.length,
    });
    fetchTimeline();
  };

  const updateStep = async (id: string, data: Partial<TimelineStep>) => {
    await supabase.from("timeline_steps").update(data as any).eq("id", id);
    fetchTimeline();
  };

  const deleteStep = async (id: string) => {
    await supabase.from("timeline_steps").delete().eq("id", id);
    fetchTimeline();
  };

  const addUpdate = async (stepId: string, description: string) => {
    if (!description.trim()) return;
    await supabase.from("timeline_updates").insert({ step_id: stepId, description });
    fetchTimeline();
  };

  // File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const path = `${client.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("client-files").upload(path, file);
    if (uploadError) {
      toast({ title: "Erro no upload", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("client-files").getPublicUrl(path);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const fileType = ["pdf"].includes(ext) ? "pdf" : ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext) ? "image" : ["doc", "docx"].includes(ext) ? "doc" : "other";

    await supabase.from("client_files").insert({
      client_id: client.id,
      name: file.name,
      file_type: fileType,
      file_url: urlData.publicUrl,
      file_size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
    });

    toast({ title: "Arquivo enviado!" });
    setUploading(false);
    fetchFiles();
  };

  const deleteFile = async (fileId: string) => {
    await supabase.from("client_files").delete().eq("id", fileId);
    fetchFiles();
  };

  const tabs = [
    { key: "dashboard" as const, label: "Dashboard" },
    { key: "timeline" as const, label: "Timeline" },
    { key: "files" as const, label: "Arquivos" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{client.profile?.display_name || "Cliente"}</h2>
        <p className="text-sm text-muted-foreground">Editando dados de {client.project_name || "projeto"}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard tab */}
      {tab === "dashboard" && (
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <Field label="Nome do Projeto" value={form.project_name} onChange={(v) => setForm({ ...form, project_name: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
              <NumberField label="Progresso (%)" value={form.progress} onChange={(v) => setForm({ ...form, progress: v })} max={100} />
            </div>
            <Field label="Próxima Entrega" value={form.next_delivery} onChange={(v) => setForm({ ...form, next_delivery: v })} placeholder="Ex: 22 Abr 2026" />
            <div className="grid grid-cols-3 gap-4">
              <NumberField label="Leads" value={form.leads} onChange={(v) => setForm({ ...form, leads: v })} />
              <NumberField label="Conversões" value={form.conversions} onChange={(v) => setForm({ ...form, conversions: v })} />
              <NumberField label="Receita (R$)" value={form.revenue} onChange={(v) => setForm({ ...form, revenue: v })} />
            </div>
          </div>
          <button onClick={saveDashboard} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Salvando..." : "Salvar Dados"}
          </button>
        </div>
      )}

      {/* Timeline tab */}
      {tab === "timeline" && (
        <div className="space-y-4">
          {loadingSteps ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : (
            <>
              {steps.map((step) => (
                <StepEditor
                  key={step.id}
                  step={step}
                  updates={updates.filter((u) => u.step_id === step.id)}
                  onUpdate={updateStep}
                  onDelete={deleteStep}
                  onAddUpdate={addUpdate}
                />
              ))}
              <button onClick={addStep} className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">
                <Plus className="h-4 w-4" /> Adicionar Etapa
              </button>
            </>
          )}
        </div>
      )}

      {/* Files tab */}
      {tab === "files" && (
        <div className="space-y-4">
          <label className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Enviando..." : "Enviar Arquivo"}
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>

          {loadingFiles ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : files.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhum arquivo.</p>
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden">
              {files.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.file_size} • {new Date(f.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <button onClick={() => deleteFile(f.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sub-components
function StepEditor({ step, updates, onUpdate, onDelete, onAddUpdate }: {
  step: TimelineStep;
  updates: TimelineUpdate[];
  onUpdate: (id: string, data: Partial<TimelineStep>) => void;
  onDelete: (id: string) => void;
  onAddUpdate: (stepId: string, desc: string) => void;
}) {
  const [newUpdate, setNewUpdate] = useState("");

  return (
    <div className="glass-card rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <input
          value={step.title}
          onChange={(e) => onUpdate(step.id, { title: e.target.value })}
          className="flex-1 bg-transparent text-sm font-semibold text-foreground focus:outline-none border-b border-transparent focus:border-primary/30 pb-0.5"
        />
        <button onClick={() => onDelete(step.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <select
          value={step.status}
          onChange={(e) => onUpdate(step.id, { status: e.target.value })}
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground"
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Concluído</option>
        </select>
        <input
          value={step.step_date || ""}
          onChange={(e) => onUpdate(step.id, { step_date: e.target.value })}
          placeholder="Data"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
        />
        <input
          value={step.responsible || ""}
          onChange={(e) => onUpdate(step.id, { responsible: e.target.value })}
          placeholder="Responsável"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
        />
        <input
          value={step.notes || ""}
          onChange={(e) => onUpdate(step.id, { notes: e.target.value })}
          placeholder="Observações"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <textarea
        value={step.description || ""}
        onChange={(e) => onUpdate(step.id, { description: e.target.value })}
        placeholder="Descrição da etapa..."
        className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none"
        rows={2}
      />

      {/* Updates */}
      {updates.length > 0 && (
        <div className="border-t border-border pt-2 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Histórico</p>
          {updates.map((u) => (
            <p key={u.id} className="text-xs text-muted-foreground">• {u.description} ({new Date(u.created_at).toLocaleDateString("pt-BR")})</p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={newUpdate}
          onChange={(e) => setNewUpdate(e.target.value)}
          placeholder="Adicionar update..."
          className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter") { onAddUpdate(step.id, newUpdate); setNewUpdate(""); }
          }}
        />
        <button
          onClick={() => { onAddUpdate(step.id, newUpdate); setNewUpdate(""); }}
          className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          + Update
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow placeholder:text-muted-foreground"
      />
    </div>
  );
}

function NumberField({ label, value, onChange, max }: {
  label: string; value: number; onChange: (v: number) => void; max?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type="number"
        value={value}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
      />
    </div>
  );
}
