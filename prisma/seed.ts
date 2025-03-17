import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Universities
  const university1 = await prisma.university.upsert({
    where: { name: "Harvard University" },
    update: {},
    create: {
      name: "Harvard University",
      latitude: 42.3736,
      longitude: -71.1097,
    },
  });

  const university2 = await prisma.university.upsert({
    where: { name: "MIT" },
    update: {},
    create: {
      name: "MIT",
      latitude: 42.3601,
      longitude: -71.0942,
    },
  });

  console.log("✅ Universities seeded.");

  // Create Trails
  const trail1 = await prisma.trail.create({
    data: {
      name: "Harvard Nature Walk",
      universityId: university1.id,
      geojson: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [-71.1100, 42.3740],
                [-71.1095, 42.3735],
                [-71.1090, 42.3730],
              ],
            },
          },
        ],
      },
    },
  });

  const trail2 = await prisma.trail.create({
    data: {
      name: "MIT River Walk",
      universityId: university2.id,
      geojson: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [-71.0950, 42.3610],
                [-71.0945, 42.3605],
                [-71.0940, 42.3600],
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Trails seeded.");

  // Create Markers
  await prisma.marker.createMany({
    data: [
      {
        name: "Historic Tree",
        description: "This tree has been standing for over 200 years.",
        latitude: 42.3735,
        longitude: -71.1095,
        trailId: trail1.id,
      },
      {
        name: "River Viewpoint",
        description: "A beautiful view of the Charles River.",
        latitude: 42.3605,
        longitude: -71.0945,
        trailId: trail2.id,
      },
    ],
  });

  console.log("✅ Markers seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
