import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const messagesRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      subject: z.string().min(1, "Subject is required"),
      message: z.string().min(1, "Message is required"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('Creating message with input:', input);
        const message = await ctx.prisma.message.create({
          data: {
            name: input.name,
            email: input.email,
            subject: input.subject,
            message: input.message,
          },
        });
        console.log('Message created:', message);
        return { success: true, data: message };
      } catch (error) {
        console.error('Error creating message:', error);
        throw new Error('Failed to create message');
      }
    }),
}); 