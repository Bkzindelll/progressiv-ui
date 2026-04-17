import { motion } from "framer-motion";
import { MessageCircle, Headphones, Clock } from "lucide-react";

export default function Support() {
  const whatsappUrl = "http://wa.me/5515988326051";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 sm:space-y-8 px-2"
    >
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Headphones className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Suporte Dedicado</h1>
        <p className="text-muted-foreground text-sm">
          Nossa equipe está disponível para ajudar com qualquer dúvida sobre seu projeto.
        </p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-xl bg-primary px-6 sm:px-8 py-4 text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg hover:shadow-primary/30 min-h-[48px]"
      >
        <MessageCircle className="h-5 w-5" />
        Falar com a equipe no WhatsApp
      </a>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Tempo médio de resposta: 15 minutos</span>
      </div>

      {/* Floating WhatsApp button - always visible on mobile/tablet */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 active:scale-95 transition-transform hover:scale-105"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </motion.div>
  );
}
