import { prisma } from "@/config/prisma";
import { CreateJobDTO, UpdateJobDTO } from "../schemas/job.schema";
import { AppError } from "@/config/error";
import { formatBR } from "@/config/dayjs";

export class JobService {
  async create(data: CreateJobDTO, companyId: string) {
    // 1. Validação de segurança: verifica se o ID da empresa foi fornecido
    if (!companyId) {
      throw new AppError("O ID da empresa é obrigatório para criar uma vaga.", 400);
    }

    // 2. Verifica se a empresa realmente existe no banco (Integridade de Dados)
    const companyExists = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!companyExists) {
      throw new AppError("Empresa não encontrada ou conta desativada.", 404);
    }

    // 3. Regra de Negócio: Evitar duplicidade (opcional, mas bom para o UX)
    const duplicateJob = await prisma.job.findFirst({
      where: {
        titulo: data.titulo,
        companyId: companyId,
        status: "ABERTA",
      },
    });

    if (duplicateJob) {
      throw new AppError("Já existe uma vaga aberta com este título para sua empresa.", 409);
    }

    // 4. Validação de Salário (Zod já faz, mas aqui é a última linha de defesa)
    if (data.salario !== undefined && data.salario <= 0) {
      throw new AppError("O salário deve ser um valor positivo.", 400);
    }

    try {
      const job = await prisma.job.create({
        data: {
          ...data,
          descricao: data.descricao ?? "", // coluna NOT NULL — usa string vazia até a IA gerar o JD
          companyId,
        },
      });
      return {
        ...job,
        createdAt: formatBR(job.createdAt),
        updatedAt: formatBR(job.updatedAt),
      };
    } catch (error) {
      console.error("Erro ao criar vaga no banco:", error);
      throw new AppError("Erro interno ao processar a criação da vaga.", 500);
    }
  }

  async listByCompany(companyId: string) {
    if (!companyId) {
      throw new AppError("ID da empresa não informado para listagem.", 400);
    }

    const jobs = await prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    return jobs.map(j => ({
      ...j,
      createdAt: formatBR(j.createdAt),
      updatedAt: formatBR(j.updatedAt),
    }));
  }
//busca vaga pelo id
  async getById(id: string, companyId: string) {
    const job = await prisma.job.findFirst({ where: { id, companyId } });
    if (!job) throw new AppError("Vaga não encontrada", 404);
    return {
      ...job,
      createdAt: formatBR(job.createdAt),
      updatedAt: formatBR(job.updatedAt),
    };
  }

//update de vaga
  async update(id: string, companyId: string, data: UpdateJobDTO) {
    const job = await prisma.job.update({ where: { id, companyId }, data });
    return {
      ...job,
      createdAt: formatBR(job.createdAt),
      updatedAt: formatBR(job.updatedAt),
    };
  }
}