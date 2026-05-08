// importar o fastify e as rotas
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import routes from "./Routes/index";
import { env } from "./config/env";
import cors from '@fastify/cors';

import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { AppError } from "./config/error";

const app: FastifyInstance = Fastify({
    logger: {
        level: env.NODE_ENV === 'dev' ? 'info': 'error',
    },
});

app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
});

//validações do fastify com zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Permite body vazio em requisições com Content-Type: application/json (ex: DELETE)
app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
  if (!body || body === '') return done(null, {});
  try {
    done(null, JSON.parse(body as string));
  } catch (err) {
    done(err as Error, undefined);
  }
});

// Tratamento Global de Erros: Segurança máxima para não vazar dados[cite: 2]
app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ ok: false, error: error.message });
    }

    if (error instanceof ZodError) {
        return reply.status(400).send({ ok: false, error: "Dados inválidos", fieldErrors: error.flatten().fieldErrors });
    }

    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "Erro interno do servidor" });
});

// registrar as rotas no servidor com o prefixo '/api'
app.register(routes, { prefix: '/api' });

export default app;