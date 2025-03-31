import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const trailsRouter = createTRPCRouter({
  // Get all trails for a university
  getByUniversity: publicProcedure
    .input(z.object({ universityName: z.string() }))
    .query(async ({ ctx, input }) => {
      const trails = await ctx.prisma.trail.findMany({
        where: {
          university: {
            name: input.universityName,
          },
        },
        include: {
          markers: true,
        },
      });

      console.log('Trails for university:', JSON.stringify(trails, null, 2));
      return { success: true, data: trails };
    }),

  // Get a specific trail
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const trail = await ctx.prisma.trail.findUnique({
        where: { id: input.id },
        include: {
          markers: true,
        },
      });

      console.log('Trail by ID:', JSON.stringify(trail, null, 2));

      if (!trail) throw new Error("Trail not found");

      return { success: true, data: trail };
    }),

  // Create a new trail
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      universityId: z.number(),
      geojson: z.any(), // You might want to define a more specific type for this
      description: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const trail = await ctx.prisma.trail.create({
        data: {
          name: input.name,
          universityId: input.universityId,
          geojson: input.geojson,
          description: input.description,
        },
      });

      return { success: true, data: trail };
    }),

  // Update a trail
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      geojson: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const trail = await ctx.prisma.trail.update({
        where: { id },
        data,
      });

      return { success: true, data: trail };
    }),

  // Delete a trail
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.trail.delete({
        where: { id: input.id },
      });

      return { success: true, message: "Trail deleted" };
    }),

  getByUniversityId: publicProcedure
    .input(z.object({ universityId: z.number() }))
    .query(async ({ ctx, input }) => {
      const trails = await ctx.prisma.trail.findMany({
        where: { universityId: input.universityId },
        orderBy: { name: 'asc' },
      });
      return { success: true, data: trails };
    }),
}); 