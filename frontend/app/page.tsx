"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Kanban,
  Bot,
  Check,
  Star,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/landing/Header";
import { useRouter } from "next/navigation";

// ─── Variants ────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── AnimatedNumber ──────────────────────────────────────────────────────────

function AnimatedNumber({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let raf: number;
    const start = performance.now();
    const duration = 1600;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const VALUE_CARDS = [
  {
    icon: Brain,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tag: "Comportamental",
    title: "Match Cultural Preciso",
    description:
      "Comparamos o perfil DISC do candidato com o DNA do seu time. Antes da primeira entrevista, você já sabe se a pessoa vai prosperar na sua cultura.",
  },
  {
    icon: Kanban,
    iconBg: "bg-secondary/30",
    iconColor: "text-secondary-foreground",
    tag: "Pipeline",
    title: "Fluxo sem Fricção",
    description:
      "Do primeiro contato à oferta em um único painel. Gerencie etapas, colabore com o time e nunca perca um prazo ou candidato promissor.",
  },
  {
    icon: Bot,
    iconBg: "bg-accent/20",
    iconColor: "text-accent-foreground",
    tag: "Inteligência Artificial",
    title: "IA que Trabalha por Você",
    description:
      "Triagem automática, geração de descrições de vagas otimizadas e score de aderência em tempo real. Foque apenas nas melhores entrevistas.",
  },
];

const STATS = [
  {
    target: 68,
    suffix: "%",
    label: "Redução na Triagem",
    note: "em média por empresa",
  },
  {
    target: 500,
    suffix: "+",
    label: "Empresas Ativas",
    note: "confiam na plataforma",
  },
  {
    target: 92,
    suffix: "%",
    label: "Precisão de Match",
    note: "validado em 12 meses",
  },
];

const SCORE_BARS = [
  { label: "Técnico (React / TypeScript)", value: 95 },
  { label: "Cultural (Perfil 'I' DISC)", value: 88 },
  { label: "Liderança e Senioridade", value: 90 },
];

const FEATURES = [
  "Perfil DISC gerado automaticamente a partir do currículo e testes",
  "Score técnico para mais de 200 tecnologias e hard skills",
  "Comparativo visual de fit cultural com o time atual",
  "Relatório completo para embasar cada decisão de contratação",
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-background text-foreground antialiased min-h-screen">
      <Header />

      <main className="w-full  mx-auto overflow-hidden">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#1a2310]">
          {/* Lime top bar */}
          <div className="h-1.5 bg-primary w-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[580px] container">
            {/* Left: text */}
            <motion.div
              className="flex flex-col justify-center gap-8 px-8 md:px-14 lg:px-16 py-20 lg:py-24"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest border-primary/40 text-primary bg-primary/10 w-fit"
                >
                  Recrutamento com Psicometria e IA
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight text-white"
              >
                Contrata<span className="text-primary">Já!</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-white/60 max-w-md leading-relaxed"
              >
                Recrutamento mais claro, humano e orientado por dados: testes
                comportamentais, match com IA e pipeline em uma única operação.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  size="lg"
                  className="rounded-lg font-bold px-8"
                  onClick={() => router.push("/cadastro")}
                >
                  Criar conta gratuita
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg font-bold border-white/20 text-white bg-transparent hover:bg-white/10 hover:border-white/30 hover:text-white"
                >
                  Ver fluxo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: app mockup */}
            <div className="relative hidden lg:flex items-center justify-center p-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,255,87,0.04),transparent_70%)] pointer-events-none" />

              {/* Main kanban card */}
              <motion.div
                className="relative bg-white rounded-2xl shadow-2xl p-5 w-72 z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="h-4 bg-foreground rounded-md mb-2 w-3/4" />
                <div className="h-2.5 bg-primary rounded-md mb-5 w-1/4" />

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Recebido", count: 4 },
                    { label: "Triagem", count: 3 },
                    { label: "Entrevista", count: 3 },
                  ].map(({ label, count }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-[8px] font-bold text-foreground/50 uppercase tracking-wide truncate">
                          {label}
                        </span>
                      </div>
                      {[...Array(count)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-muted rounded p-1.5 flex flex-col gap-1"
                        >
                          <div className="h-1.5 bg-foreground/20 rounded w-full" />
                          <div className="h-1.5 bg-foreground/10 rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Match IA card */}
              <motion.div
                className="absolute top-10 right-6 bg-[#111a0c] border border-white/10 text-white rounded-2xl p-4 w-40 shadow-xl z-20"
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  delay: 0.9,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">
                  Match IA
                </p>
                <p className="text-5xl font-black text-primary leading-none">
                  92%
                </p>
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[92%]" />
                </div>
              </motion.div>

              {/* Perfil Comportamental card */}
              <motion.div
                className="absolute right-4 bottom-36 bg-[#4a7c8e] text-white rounded-2xl p-4 w-44 shadow-xl z-20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 1.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/70 mb-3">
                  Perfil Comportamental
                </p>
                <div className="flex items-end gap-1 h-12">
                  {[55, 82, 42, 73, 90, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white/35 rounded-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Bottom colored cards */}
              <div className="absolute bottom-8 left-10 right-4 flex gap-2">
                {[
                  { bg: "bg-[#c4a882]" },
                  { bg: "bg-[#e8825a]" },
                  { bg: "bg-[#4a5452]" },
                ].map(({ bg }, i) => (
                  <motion.div
                    key={i}
                    className={`flex-1 ${bg} rounded-xl h-16 p-2.5 flex flex-col gap-1.5`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    <div className="h-1.5 bg-white/40 rounded w-3/4" />
                    <div className="h-1.5 bg-white/25 rounded w-1/2" />
                    <div className="h-1.5 bg-white/20 rounded w-2/3" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Value Props ───────────────────────────────────────────────── */}
        <section className="px-6 py-20 container">
          <motion.div
            className="text-center mb-14"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest text-primary"
            >
              Nossa Metodologia
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4"
            >
              Tudo o que o RH moderno precisa
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Combinamos IA generativa com ciência comportamental para
              transformar cada etapa da jornada de contratação.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {VALUE_CARDS.map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                }}
                className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-5 shadow-sm cursor-default"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}
                  >
                    <card.icon className={`size-5 ${card.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2.5 py-1">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {card.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <section className="mx-4 md:mx-6 my-8 rounded-2xl overflow-hidden relative bg-[#2d3d1f]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,255,87,0.12),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,255,87,0.06),transparent_60%)] pointer-events-none" />

          <motion.div
            className="grid grid-cols-3 relative z-10"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className={`flex flex-col items-center justify-center py-8 px-3 md:py-12 md:px-8 text-center ${
                  i < 2 ? "border-r border-white/10" : ""
                }`}
              >
                <span className="text-3xl md:text-6xl font-bold text-primary mb-1 tabular-nums">
                  <AnimatedNumber target={stat.target} suffix={stat.suffix} />
                </span>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider md:tracking-widest text-white/80 mt-1 leading-tight">
                  {stat.label}
                </span>
                <span className="hidden md:block text-xs text-white/40 mt-1">
                  {stat.note}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Feature Showcase ──────────────────────────────────────────── */}
        <section className="px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center container">
          {/* Mock UI */}
          <motion.div
            className="order-2 lg:order-1 relative p-6 md:p-8 bg-muted/60 rounded-2xl border border-border"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col gap-6">
              <div className="flex justify-between items-start border-b border-border pb-5">
                <div className="flex items-center gap-4">
                  <Avatar className="size-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      LS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground">Lucas Silva</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      Engenheiro Front-end
                    </p>
                  </div>
                </div>
                <div className="bg-primary px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Star className="size-3.5 text-primary-foreground fill-primary-foreground" />
                  <span className="text-xs font-bold text-primary-foreground">
                    Top Match
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Score de Alinhamento
                </p>
                <div className="flex flex-col gap-4">
                  {SCORE_BARS.map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-foreground">
                          {bar.label}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {bar.value}%
                        </span>
                      </div>
                      <Progress value={bar.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="order-1 lg:order-2 flex flex-col gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest text-primary"
            >
              Análise Profunda
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
            >
              Veja o candidato completo,{" "}
              <span className="text-muted-foreground font-medium">
                não só o currículo.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Cada candidato recebe um{" "}
              <strong className="text-foreground">Score de Alinhamento</strong>{" "}
              holístico que considera stack técnica, traços comportamentais e fit
              cultural. Tome decisões com dados sólidos — não intuição.
            </motion.p>
            <motion.ul variants={stagger} className="flex flex-col gap-3 mt-1">
              {FEATURES.map((feature) => (
                <motion.li
                  key={feature}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="px-6 py-16 mb-20 max-w-3xl mx-auto text-center container">
          <motion.div
            className="relative bg-card border border-border rounded-3xl p-10 md:p-14 shadow-sm flex flex-col justify-center items-center gap-6 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,255,87,0.07),transparent_60%)] pointer-events-none" />

            <motion.div
              className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center relative z-10"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Rocket className="size-7 text-primary-foreground" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground relative z-10">
              Sua próxima grande{" "}
              <br className="hidden md:block" />
              contratação começa aqui.
            </h2>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed relative z-10">
              Mais de 500 empresas brasileiras já eliminaram contratações erradas
              com o ContrataJá. Comece grátis hoje — sem cartão de crédito, sem
              compromisso.
            </p>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative z-10"
            >
              <Button
                type="button"
                onClick={() => router.push("/cadastro")}
                size="lg"
                className="rounded-xl px-10 py-7 font-bold text-base gap-2"
              >
                Criar conta gratuita
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>

            <p className="text-xs text-muted-foreground relative z-10">
              Sem compromisso · Cancele quando quiser
            </p>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6 container">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold text-foreground tracking-tight">
            Contrata<span className="text-primary">Já</span>
          </span>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            © 2026 ContrataJá · Recrutamento inteligente para o Brasil
          </p>
          <div className="flex gap-6">
            {["Privacidade", "Termos", "Contato"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
