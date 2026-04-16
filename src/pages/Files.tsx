import { motion } from "framer-motion";
import { FileText, Image, File, Download, Loader2 } from "lucide-react";
import { useMyClientData, useMyFiles } from "@/hooks/useClientData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  image: Image,
  doc: FileText,
  other: File,
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function FilesPage() {
  const { data, loading: loadingClient } = useMyClientData();
  const { files, loading: loadingFiles } = useMyFiles(data?.id);

  if (loadingClient || loadingFiles) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeUp} className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Arquivos do Projeto</h1>
        <p className="text-sm text-muted-foreground">Documentos e materiais compartilhados pela equipe.</p>
      </motion.div>

      {files.length === 0 ? (
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">Nenhum arquivo disponível ainda.</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="glass-card rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_120px_48px] gap-4 px-5 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
            <span>Arquivo</span>
            <span>Tamanho</span>
            <span>Data</span>
            <span />
          </div>

          {files.map((file) => {
            const Icon = iconMap[file.file_type || "other"] || File;
            return (
              <motion.div
                key={file.id}
                variants={fadeUp}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_48px] gap-2 sm:gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{file.file_size || "—"}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(file.created_at).toLocaleDateString("pt-BR")}
                </span>
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors"
                >
                  <Download className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
