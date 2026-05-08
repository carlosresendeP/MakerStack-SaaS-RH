"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  ChevronLeft,
  Copy,
  Link2,
  Pencil,
  SendHorizonal,
  User,
  Users,
} from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RankingSidebar } from "@/components/relatorio/RankingSidebar"
import { CandidateAnalysis } from "@/components/relatorio/CandidateAnalysis"
import { useJob } from "@/hooks/useJobs"
import { useJobApplications } from "@/hooks/useApplications"
import { useOrganograma } from "@/hooks/useOrganograma"
import { jobService } from "@/services/job.service"
import { applicationService } from "@/services/application.service"
import { cn } from "@/lib/utils"
import type { Application, Job, JobStatus } from "@/types/api"

// ─── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  ABERTA:  { label: "ABERTA",  className: "bg-secondary/20 text-sidebar border-secondary/40" },
  PAUSADA: { label: "PAUSADA", className: "bg-muted text-muted-foreground border-border" },
  FECHADA: { label: "FECHADA", className: "bg-destructive/20 text-foreground border-destructive/40" },
}

function formatSalary(min?: string | null, max?: string | null): string {
  if (!min && !max) return "A combinar"
  const fmt = (v: string) => `R$ ${Number(v).toLocaleString("pt-BR")}`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `A partir de ${fmt(min)}`
  return `Até ${fmt(max!)}`
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copiado!`))
}

// ─── Edit schema ───────────────────────────────────────────────────────────────

const editSchema = z.object({
  titulo:    z.string().min(3, "Mínimo 3 caracteres"),
  descricao: z.string().optional(),
  requisitos: z.string().optional(),
  salaryMin: z.coerce.number().positive().optional().or(z.literal("")),
  salaryMax: z.coerce.number().positive().optional().or(z.literal("")),
  status:    z.enum(["ABERTA", "PAUSADA", "FECHADA"]),
  liderId:   z.string().optional(),
})

type EditForm = z.infer<typeof editSchema>

// ─── EditJobSheet ──────────────────────────────────────────────────────────────

function EditJobSheet({
  job,
  open,
  onClose,
}: {
  job: Job
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { data: nodes = [] } = useOrganograma()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      titulo:     job.titulo,
      descricao:  job.descricao ?? "",
      requisitos: job.requisitos ?? "",
      salaryMin:  job.salaryMin ? Number(job.salaryMin) : "",
      salaryMax:  job.salaryMax ? Number(job.salaryMax) : "",
      status:     job.status,
      liderId:    job.liderId ?? "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: EditForm) =>
      jobService.update(job.id, {
        titulo:     data.titulo,
        descricao:  data.descricao || undefined,
        requisitos: data.requisitos || undefined,
        salaryMin:  data.salaryMin !== "" ? Number(data.salaryMin) : undefined,
        salaryMax:  data.salaryMax !== "" ? Number(data.salaryMax) : undefined,
        status:     data.status,
        liderId:    data.liderId || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", job.id] })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Vaga atualizada!")
      onClose()
    },
    onError: () => toast.error("Erro ao atualizar vaga."),
  })

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Editar Vaga</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4 px-4">
          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título *</Label>
            <Input id="titulo" {...register("titulo")} />
            {errors.titulo && (
              <p className="text-xs text-destructive">{errors.titulo.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(v) => setValue("status", v as JobStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABERTA">Aberta</SelectItem>
                <SelectItem value="PAUSADA">Pausada</SelectItem>
                <SelectItem value="FECHADA">Fechada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salários */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="salaryMin">Salário mínimo (R$)</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="Ex: 3000"
                {...register("salaryMin")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salaryMax">Salário máximo (R$)</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="Ex: 6000"
                {...register("salaryMax")}
              />
            </div>
          </div>

          {/* Líder */}
          <div className="space-y-1.5">
            <Label>Líder responsável</Label>
            <Select
              value={watch("liderId") ?? ""}
              onValueChange={(v) => setValue("liderId", v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um líder (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {nodes.map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.nome} — {n.cargo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={5}
              placeholder="Descrição da vaga..."
              {...register("descricao")}
            />
          </div>

          {/* Requisitos */}
          <div className="space-y-1.5">
            <Label htmlFor="requisitos">Requisitos</Label>
            <Textarea
              id="requisitos"
              rows={4}
              placeholder="Requisitos da vaga..."
              {...register("requisitos")}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VagaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [testLinks, setTestLinks] = useState<Record<string, string>>({})
  const [editOpen, setEditOpen] = useState(false)

  const { data: job, isLoading: jobLoading } = useJob(id)
  const { data: applications = [], isLoading: appsLoading } = useJobApplications(id)

  const generateMatchMutation = useMutation({
    mutationFn: () => jobService.generateMatch(id, selectedApp!.candidateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applications", "job", id] })
      const updated = queryClient
        .getQueryData<Application[]>(["applications", "job", id])
        ?.find((a) => a.id === selectedApp?.id)
      if (updated) setSelectedApp(updated)
      toast.success("Análise gerada com sucesso!")
    },
    onError: () => toast.error("Erro ao gerar análise. Tente novamente."),
  })

  const generateTestLinkMutation = useMutation({
    mutationFn: (appId: string) => applicationService.createTestLink(appId),
    onSuccess: (data, appId) => {
      setTestLinks((prev) => ({ ...prev, [appId]: data.url }))
      copyToClipboard(data.url, "Link do teste")
    },
    onError: () => toast.error("Erro ao gerar link. Tente novamente."),
  })

  if (jobLoading || appsLoading) return <PageSkeleton />

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-muted-foreground">Vaga não encontrada.</p>
        <Link href="/vagas" className="text-sm text-sidebar hover:underline">
          Voltar para vagas
        </Link>
      </div>
    )
  }

  const cfg = statusConfig[job.status]
  const description = job.jdGerada || job.descricao
  const publicUrl = job.publicToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/candidatar/${job.publicToken}`
    : null

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/vagas" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{job.titulo}</h1>
            <Badge variant="outline" className={cn("text-[10px] font-bold shrink-0", cfg.className)}>
              {cfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatSalary(job.salaryMin, job.salaryMax)}
            {job.lider && (
              <span className="ml-3 inline-flex items-center gap-1">
                <User className="size-3" />
                {job.lider.nome} — {job.lider.cargo}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Editar vaga */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="gap-2"
          >
            <Pencil className="size-4" />
            Editar
          </Button>

          {/* Link público de candidatura */}
          {publicUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(publicUrl, "Link da vaga")}
              className="gap-2"
            >
              <Link2 className="size-4" />
              Copiar Link Público
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — job info + candidate analysis */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-secondary/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              {description ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sem descrição cadastrada.</p>
              )}
            </CardContent>
          </Card>

          {job.requisitos && (
            <Card className="border-secondary/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest">Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {job.requisitos}
                </p>
              </CardContent>
            </Card>
          )}

          {selectedApp && (
            <Card className="border-secondary/40 shadow-sm">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-widest">
                  Análise — {selectedApp.candidate?.nome ?? "Candidato"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {testLinks[selectedApp.id] ? (
                    <button
                      onClick={() => copyToClipboard(testLinks[selectedApp.id], "Link do teste")}
                      className="flex items-center gap-1 text-xs text-sidebar hover:underline"
                    >
                      <Copy className="size-3" />
                      Copiar link do teste
                    </button>
                  ) : (
                    <button
                      onClick={() => generateTestLinkMutation.mutate(selectedApp.id)}
                      disabled={generateTestLinkMutation.isPending}
                      className="flex items-center gap-1 text-xs text-sidebar hover:underline disabled:opacity-50"
                    >
                      <SendHorizonal className="size-3" />
                      {generateTestLinkMutation.isPending ? "Gerando..." : "Gerar link de teste"}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
                  >
                    Fechar ×
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <CandidateAnalysis
                  application={selectedApp}
                  onGenerateMatch={() => generateMatchMutation.mutate()}
                  isGenerating={generateMatchMutation.isPending}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — ranking sidebar */}
        <Card className="border-secondary/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="size-4" />
              Candidatos ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <RankingSidebar
              applications={applications}
              selectedId={selectedApp?.id}
              onSelect={setSelectedApp}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit sheet — mounted only when job exists */}
      <EditJobSheet job={job} open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  )
}
