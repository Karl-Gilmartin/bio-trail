import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const blogsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.blogPost.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      return posts;
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.blogPost.findUnique({
          where: { id: input }
        });

        if (!post) {
          return null;
        }

        return post;
      } catch (error) {
        console.error('Error in getById:', error);
        return null;
      }
    }),
}); 