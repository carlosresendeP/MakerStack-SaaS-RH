import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatService } from '../services/chatService';

export class ChatController {
  private service = new ChatService();

  stream = async (
    req: FastifyRequest<{ Body: { message: string; context?: string } }>,
    reply: FastifyReply
  ) => {
    const { message, context } = req.body;

    const origin = req.headers.origin;
    if (origin) {
      reply.raw.setHeader('Access-Control-Allow-Origin', origin);
      reply.raw.setHeader('Vary', 'Origin');
    }
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.flushHeaders();

    try {
      const textStream = await this.service.stream(message, context);

      for await (const chunk of textStream) {
        reply.raw.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }

      reply.raw.write('data: [DONE]\n\n');
    } catch (err) {
      req.log.error(err, 'Chat stream error');
      reply.raw.write(`data: ${JSON.stringify({ text: '\n\n[Erro ao gerar resposta. Tente novamente.]' })}\n\n`);
      reply.raw.write('data: [DONE]\n\n');
    } finally {
      reply.raw.end();
    }
  };
}
