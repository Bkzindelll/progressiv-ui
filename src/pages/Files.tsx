import { motion } from "framer-motion";
import { files } from "@/lib/mockData";
import { FileText, Image, File, Download } from "lucide-react";

const iconMap = {
  pdf: FileText,
  image: Image,
  doc: FileText,
  other: File,
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function FilesPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeUp} className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Arquivos do Projeto</h1>
        <p className="text-sm text-muted-foreground">Documentos e materiais compartilhados pela equipe.</p>
      </motion.div>

      <motion.div variants={fadeUp} className="glass-card rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_100px_120px_48px] gap-4 px-5 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
          <span>Arquivo</span>
          <span>Tamanho</span>
          <span>Data</span>
          <span />
        </div>

        {files.map((file) => {
          const Icon = iconMap[file.type];
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
              <span className="text-sm text-muted-foreground">{file.size}</span>
              <span className="text-sm text-muted-foreground">{file.date}</span>
              <button className="h-8 w-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Download className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
