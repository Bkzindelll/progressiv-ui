import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  startDate: string | null;
  endDate: string | null;
}

function calc(end: string) {
  const diff = new Date(end + "T23:59:59").getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({ startDate, endDate }: Props) {
  const [time, setTime] = useState(endDate ? calc(endDate) : null);

  useEffect(() => {
    if (!endDate) return;
    setTime(calc(endDate));
    const id = setInterval(() => setTime(calc(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!endDate) return null;

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Tempo restante até a entrega</p>
      </div>
      {!time ? (
        <p className="text-base sm:text-lg font-semibold text-success">🎉 Projeto concluído!</p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <TimeBox value={time.days} label="dias" />
          <TimeBox value={time.hours} label="horas" />
          <TimeBox value={time.minutes} label="min" />
          <TimeBox value={time.seconds} label="seg" />
        </div>
      )}
      {startDate && (
        <p className="text-xs text-muted-foreground">
          Início: <span className="text-foreground font-medium">{new Date(startDate).toLocaleDateString("pt-BR")}</span> · 
          {" "}Fim: <span className="text-foreground font-medium">{new Date(endDate).toLocaleDateString("pt-BR")}</span>
        </p>
      )}
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-secondary p-2 sm:p-3 text-center">
      <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums">{String(value).padStart(2, "0")}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}
