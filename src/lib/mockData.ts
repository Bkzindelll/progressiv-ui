export const clientData = {
  name: "Carlos Oliveira",
  project: "E-commerce Premium",
  status: "Em andamento",
  progress: 68,
  nextDelivery: "22 Abr 2026",
  lastUpdate: "Atualizado há 12 minutos",
  metrics: {
    leads: 1248,
    conversions: 187,
    revenue: 45890,
  },
};

export type TimelineStep = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  date: string;
  responsible: string;
  notes?: string;
};

export const timelineSteps: TimelineStep[] = [
  { id: "1", title: "Briefing e Planejamento", description: "Definição de escopo, objetivos e cronograma do projeto.", status: "completed", date: "01 Abr 2026", responsible: "Equipe Estratégia", notes: "Aprovado pelo cliente" },
  { id: "2", title: "Design UI/UX", description: "Criação dos wireframes e protótipos de alta fidelidade.", status: "completed", date: "05 Abr 2026", responsible: "Design Team" },
  { id: "3", title: "Desenvolvimento Frontend", description: "Implementação da interface e componentes interativos.", status: "in_progress", date: "10 Abr 2026", responsible: "Dev Team", notes: "75% concluído" },
  { id: "4", title: "Integração Backend", description: "Conexão com APIs, banco de dados e serviços.", status: "pending", date: "18 Abr 2026", responsible: "Dev Team" },
  { id: "5", title: "Testes e QA", description: "Testes de funcionalidade, performance e segurança.", status: "pending", date: "24 Abr 2026", responsible: "QA Team" },
  { id: "6", title: "Deploy e Lançamento", description: "Publicação e monitoramento pós-lançamento.", status: "pending", date: "28 Abr 2026", responsible: "DevOps" },
];

export type FileItem = {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc" | "other";
  size: string;
  date: string;
  url?: string;
};

export const files: FileItem[] = [
  { id: "1", name: "Briefing-Projeto.pdf", type: "pdf", size: "2.4 MB", date: "01 Abr 2026" },
  { id: "2", name: "Wireframes-v2.pdf", type: "pdf", size: "8.1 MB", date: "05 Abr 2026" },
  { id: "3", name: "Logo-Final.png", type: "image", size: "540 KB", date: "03 Abr 2026" },
  { id: "4", name: "Contrato-Assinado.pdf", type: "doc", size: "1.2 MB", date: "01 Abr 2026" },
  { id: "5", name: "Paleta-Cores.png", type: "image", size: "320 KB", date: "04 Abr 2026" },
];
