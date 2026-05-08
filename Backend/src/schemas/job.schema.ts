import { JobStatus } from "@/generated/prisma/enums";
import { z } from "zod";

export const createJobSchema = z.object({
  titulo:      z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  descricao:   z.string().optional(),
  requisitos:  z.string().optional(),
  salario:     z.coerce.number().positive().optional(),
  salaryMin:   z.coerce.number().positive().optional(),
  salaryMax:   z.coerce.number().positive().optional(),
  liderId:     z.string().uuid().optional().nullable(),
  status:      z.nativeEnum(JobStatus).default("ABERTA"),
});

export const updateJobSchema = z.object({
  titulo:      z.string().min(3).optional(),
  descricao:   z.string().optional(),
  requisitos:  z.string().optional(),
  salario:     z.coerce.number().positive().optional(),
  salaryMin:   z.coerce.number().positive().optional(),
  salaryMax:   z.coerce.number().positive().optional(),
  liderId:     z.string().uuid().optional().nullable(),
  status:      z.nativeEnum(JobStatus).optional(),
});

export type CreateJobDTO = z.infer<typeof createJobSchema>;
export type UpdateJobDTO = z.infer<typeof updateJobSchema>;
