import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a university
  const university = await prisma.university.create({
    data: {
      name: "Example University",
      latitude: 54.505,
      longitude: -0.09,
      routes: {
        create: [
          {
            name: "Nature Trail",
            description: "A scenic nature trail around campus.",
            geojson: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: { name: "Nature Trail" },
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      [-8.574477827863205, 52.67247322537267],
                      [-8.573823368862975, 52.672541534641454],
                      [-8.573313749150998, 52.672554545918274],
                      [-8.57260564597047, 52.672554545918274],
                    ],
                  },
                },
                {
                  type: "Feature",
                  properties: { name: "Scenic Spot" },
                  geometry: {
                    type: "Point",
                    coordinates: [-8.571098885625787, 52.6726877325824],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed data added:", university);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
