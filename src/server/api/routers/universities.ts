import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const universitiesRouter = createTRPCRouter({
  // ✅ Get all universities
  getAll: publicProcedure.query(async () => {
    console.log("Fetching universities...");

    const universities = await prisma.university.findMany({
      select: { id: true, name: true, latitude: true, longitude: true },
    });

    return { success: true, data: universities };
  }),

  // ✅ Get a university by name
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const university = await prisma.university.findFirst({
        where: { name: input.name },
        include: {
          trails: {
            include: {
              markers: true,
            },
          },
        },
      });

      if (!university) throw new Error("University not found");

      return { success: true, data: university };
    }),

  // ✅ Get university center coordinates
  getCenter: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const university = await prisma.university.findFirst({
        where: { name: input.name },
        select: { latitude: true, longitude: true },
      });

      if (!university) throw new Error("University not found");

      return { 
        success: true, 
        data: {
          latitude: university.latitude,
          longitude: university.longitude,
        }
      };
    }),

  // ✅ Get university markers
  getMarkers: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const markers = await prisma.marker.findMany({
        where: {
          trail: {
            university: {
              name: input.name,
            },
          },
        },
        select: {
          name: true,
          description: true,
          latitude: true,
          longitude: true,
        },
      });

      return { success: true, data: markers };
    }),

  // ✅ Create a new university
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      latitude: z.number(),
      longitude: z.number(),
    }))
    .mutation(async ({ input }) => {
      const newUniversity = await prisma.university.create({
        data: input,
      });

      return { success: true, data: newUniversity };
    }),

  // ✅ Update a university
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const updatedUniversity = await prisma.university.update({
        where: { id: input.id },
        data: {
          name: input.name,
          latitude: input.latitude,
          longitude: input.longitude,
        },
      });

      return { success: true, data: updatedUniversity };
    }),

  // ✅ Delete a university
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.university.delete({ where: { id: input.id } });

      return { success: true, message: "University deleted" };
    }),
});
