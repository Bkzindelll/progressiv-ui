import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onCreated: () => void;
}

export default function AdminCreateClient({ onCreated }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!email || !password || !displayName) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    setSaving(true);

    // Use edge function to create user (admin can't use signUp for others)
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { email, password, display_name: displayName, project_name: projectName },
    });

    if (error || data?.error) {
      toast({ title: "Erro ao criar cliente", description: error?.message || data?.error, variant: "destructive" });
      setSaving(false);
      return;
    }

    toast({ title: "Cliente criado com sucesso!" });
    setSaving(false);
    onCreated();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Criar Novo Cliente</h2>
        <p className="text-sm text-muted-foreground">Preencha as informações para criar uma nova conta.</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <Field label="Nome *" value={displayName} onChange={setDisplayName} placeholder="Nome do cliente" />
        <Field label="Email *" value={email} onChange={setEmail} placeholder="email@exemplo.com" type="email" />
        <Field label="Senha *" value={password} onChange={setPassword} placeholder="Senha inicial" type="password" />
        <Field label="Nome do Projeto" value={projectName} onChange={setProjectName} placeholder="Ex: E-commerce Premium" />
      </div>

      <button
        onClick={handleCreate}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Criando..." : "Criar Cliente"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow placeholder:text-muted-foreground"
      />
    </div>
  );
}
