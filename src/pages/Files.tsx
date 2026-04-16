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
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
      <motion.div variants={fadeUp} className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Arquivos do Projeto</h1>
        <p className="text-sm text-muted-foreground">Documentos e materiais compartilhados pela equipe.</p>
      </motion.div>

      {files.length === 0 ? (
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">Nenhum arquivo disponível ainda.</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="space-y-3 sm:space-y-0">
          {/* Desktop table header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_120px_48px] gap-4 px-5 py-3 glass-card rounded-t-xl border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
            <span>Arquivo</span>
            <span>Tamanho</span>
            <span>Data</span>
            <span />
          </div>

          {files.map((file, i) => {
            const Icon = iconMap[file.file_type || "other"] || File;
            return (
              <motion.div
                key={file.id}
                variants={fadeUp}
                className={`
                  glass-card p-4 sm:px-5 sm:py-4
                  sm:grid sm:grid-cols-[1fr_100px_120px_48px] sm:gap-4 sm:items-center
                  ${i === 0 ? "rounded-xl sm:rounded-none sm:rounded-t-none" : ""}
                  ${i === files.length - 1 ? "rounded-xl sm:rounded-b-xl" : ""}
                  sm:rounded-none sm:border-b sm:border-border sm:last:border-0
                  flex flex-col gap-3
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                </div>

                <div className="flex items-center justify-between sm:contents">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{file.file_size || "—"}</span>
                    <span>{new Date(file.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary hover:bg-primary/10 transition-colors shrink-0"
                  >
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
