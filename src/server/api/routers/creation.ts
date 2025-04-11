import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const creationRouter = createTRPCRouter({
  // Verify PIN before allowing creation
  verifyPin: publicProcedure
    .input(z.object({
      pin: z.string().min(6).max(8),
    }))
    .mutation(async ({ ctx, input }) => {
      const pin = await ctx.prisma.creationPin.findFirst({
        where: {
          pin: input.pin,
          isActive: true,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!pin) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired PIN',
        });
      }

      return { success: true };
    }),

  // Create a new university
  createUniversity: publicProcedure
    .input(z.object({
      pin: z.string().min(6).max(8),
      name: z.string().min(1),
      latitude: z.number(),
      longitude: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify PIN first
      await ctx.prisma.creationPin.findFirstOrThrow({
        where: {
          pin: input.pin,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      const university = await ctx.prisma.university.create({
        data: {
          name: input.name,
          latitude: input.latitude,
          longitude: input.longitude,
        },
      });
      return { success: true, data: university };
    }),

  // Create a new trail
  createTrail: publicProcedure
    .input(z.object({
      pin: z.string().min(6).max(8),
      name: z.string().min(1),
      universityId: z.number(),
      description: z.string(),
      geojson: z.any(), // You might want to be more specific about the GeoJSON structure
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify PIN first
      await ctx.prisma.creationPin.findFirstOrThrow({
        where: {
          pin: input.pin,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      const trail = await ctx.prisma.trail.create({
        data: {
          name: input.name,
          universityId: input.universityId,
          description: input.description,
          geojson: input.geojson,
        },
      });
      return { success: true, data: trail };
    }),

  // Create a new marker
  createMarker: publicProcedure
    .input(z.object({
      pin: z.string().min(6).max(8),
      trailId: z.number(),
      name: z.string().min(1),
      description: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      images: z.array(z.string()).optional(),
      videos: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify PIN first
      await ctx.prisma.creationPin.findFirstOrThrow({
        where: {
          pin: input.pin,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      const marker = await ctx.prisma.marker.create({
        data: {
          trailId: input.trailId,
          name: input.name,
          description: input.description,
          latitude: input.latitude,
          longitude: input.longitude,
          imagePaths: input.images ?? [],
          videos: input.videos ?? [],
        },
      });
      return { success: true, data: marker };
    }),

  // Get all universities (for dropdown selection)
  getUniversities: publicProcedure.query(async ({ ctx }) => {
    const universities = await ctx.prisma.university.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, data: universities };
  }),

  // Get all trails for a university (for dropdown selection)
  getTrailsByUniversity: publicProcedure
    .input(z.object({ universityId: z.number() }))
    .query(async ({ ctx, input }) => {
      const trails = await ctx.prisma.trail.findMany({
        where: { universityId: input.universityId },
        orderBy: { name: 'asc' },
      });
      return { success: true, data: trails };
    }),
}); 