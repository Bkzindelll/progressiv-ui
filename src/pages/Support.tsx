import { motion } from "framer-motion";
import { MessageCircle, Headphones, Clock } from "lucide-react";

export default function Support() {
  const whatsappUrl = "https://wa.me/5511999999999?text=Olá!%20Preciso%20de%20suporte%20sobre%20meu%20projeto.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
    >
      <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Headphones className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold text-foreground">Suporte Dedicado</h1>
        <p className="text-muted-foreground text-sm">
          Nossa equipe está disponível para ajudar com qualquer dúvida sobre seu projeto.
        </p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-primary"
      >
        <MessageCircle className="h-5 w-5" />
        Falar com a equipe no WhatsApp
      </a>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Tempo médio de resposta: 15 minutos</span>
      </div>
    </motion.div>
  );
}
