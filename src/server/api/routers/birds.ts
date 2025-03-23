import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const birdsRouter = createTRPCRouter({
  // Get all birds
  getAll: publicProcedure.query(async ({ ctx }) => {
    const birds = await ctx.prisma.bird.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, data: birds };
  }),

  // Create a new bird
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const bird = await ctx.prisma.bird.create({
        data: {
          name: input.name,
        },
      });
      return { success: true, data: bird };
    }),

  // Record a bird sighting
  recordSighting: publicProcedure
    .input(z.object({
      birdId: z.number(),
      universityId: z.number(),
      latitude: z.number(),
      longitude: z.number(),
      imageUrl: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const sighting = await ctx.prisma.birdSighting.create({
        data: {
          birdId: input.birdId,
          universityId: input.universityId,
          latitude: input.latitude,
          longitude: input.longitude,
          imageUrl: input.imageUrl,
          notes: input.notes,
        },
        include: {
          bird: true,
          university: true,
        },
      });
      return { success: true, data: sighting };
    }),

  // Get all sightings for a university
  getSightingsByUniversity: publicProcedure
    .input(z.object({ universityId: z.number() }))
    .query(async ({ ctx, input }) => {
      const sightings = await ctx.prisma.birdSighting.findMany({
        where: {
          universityId: input.universityId,
        },
        include: {
          bird: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return { success: true, data: sightings };
    }),
}); 