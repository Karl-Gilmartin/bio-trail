import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ✅ Create Universities
  const harvard = await prisma.university.upsert({
    where: { name: "Harvard University" },
    update: {},
    create: {
      name: "Harvard University",
      latitude: 42.3736,
      longitude: -71.1097,
    },
  });

  const mit = await prisma.university.upsert({
    where: { name: "MIT" },
    update: {},
    create: {
      name: "MIT",
      latitude: 42.3601,
      longitude: -71.0942,
    },
  });

  console.log("✅ Universities seeded.");

  // ✅ Create Trails
  const harvardTrail = await prisma.trail.upsert({
    where: { name: "Harvard Nature Walk" },
    update: {},
    create: {
      name: "Harvard Nature Walk",
      universityId: harvard.id,
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

  const mitTrail = await prisma.trail.upsert({
    where: { name: "MIT River Walk" },
    update: {},
    create: {
      name: "MIT River Walk",
      universityId: mit.id,
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

  // ✅ Create Markers with Images & Videos
  await prisma.marker.createMany({
    data: [
      {
        name: "Historic Tree",
        description: "This tree has been standing for over 200 years.",
        latitude: 42.3735,
        longitude: -71.1095,
        trailId: harvardTrail.id,
        images: [
          "https://example.com/historic-tree1.jpg",
          "https://example.com/historic-tree2.jpg",
        ],
        videos: ["https://example.com/historic-tree.mp4"],
      },
      {
        name: "River Viewpoint",
        description: "A beautiful view of the Charles River.",
        latitude: 42.3605,
        longitude: -71.0945,
        trailId: mitTrail.id,
        images: [
          "https://example.com/river-view1.jpg",
          "https://example.com/river-view2.jpg",
        ],
        videos: ["https://example.com/river-view.mp4"],
      },
    ],
  });

  console.log("✅ Markers with images/videos seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🌱 Seeding completed!");
  });
