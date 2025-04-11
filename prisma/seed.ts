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

  const UL = await prisma.university.upsert({
    where: { name: "UL" },
    update: {},
    create: {
      name: "UL",
      latitude: 52.67368651170915,
      longitude: -8.571033873679937,
    },
  });

  console.log("✅ Universities seeded.");

  // ✅ Create Trails
  const harvardTrail = await prisma.trail.create({
    data: {
      name: "Harvard Nature Walk",
      description: "A beautiful walk along the Harvard Nature Walk in Cambridge, Massachusetts. This trail is a great way to explore the natural beauty of the area. It is a 2.5km loop trail that takes approximately 1 hour to complete. It is a great way to explore the natural beauty of the area.",
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

  const ULTrail = await prisma.trail.create({
    data: {
      name: "UL Nature Walk",
      description: "A beautiful walk along the UL Nature Walk in Limerick, Ireland. This trail is a great way to explore the natural beauty of the area. It is a 2.5km loop trail that takes approximately 1 hour to complete. It is a great way to explore the natural beauty of the area.",
      universityId: UL.id,
      geojson: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                [
                  -8.574931588205516,
                  52.6723425220284
                ],
                [
                  -8.574116085891404,
                  52.67251705039487
                ],
                [
                  -8.573044739712685,
                  52.67256553037342
                ],
                [
                  -8.571189871703695,
                  52.67270127402631
                ],
                [
                  -8.569830701179228,
                  52.67284671318609
                ],
                [
                  -8.568199696550096,
                  52.67302123953857
                ],
                [
                  -8.566888496750494,
                  52.67316667763379
                ],
                [
                  -8.56610497491937,
                  52.67320546104344
                ],
                [
                  -8.566232896850295,
                  52.6737581208981
                ],
                [
                  -8.56610497491937,
                  52.674427120841756
                ],
                [
                  -8.566168935884377,
                  52.67474707371534
                ],
                [
                  -8.567608057616695,
                  52.67439803410036
                ],
                [
                  -8.568615442828559,
                  52.67433016496281
                ],
                [
                  -8.569191091520963,
                  52.67457255425643
                ],
                [
                  -8.56920708176196,
                  52.67477616022376
                ],
                [
                  -8.570358379147677,
                  52.67472768269877
                ],
                [
                  -8.572293198364463,
                  52.67465011854645
                ],
                [
                  -8.573044739712685,
                  52.67488281058971
                ],
                [
                  -8.573956183476582,
                  52.67488281058971
                ],
                [
                  -8.574435890720082,
                  52.67473737820782
                ],
                [
                  -8.574435890720082,
                  52.67452407650552
                ],
                [
                  -8.575507236897892,
                  52.67407807867113
                ],
                [
                  -8.576466651385772,
                  52.674145948200305
                ],
                [
                  -8.576370709936924,
                  52.673602989013006
                ],
                [
                  -8.576338729453937,
                  52.67309880658277
                ],
                [
                  -8.57590699293445,
                  52.672691578064814
                ],
                [
                  -8.575363324725032,
                  52.67251705039487
                ],
                [
                  -8.574787676032685,
                  52.67238130617022
                ]
              ],
              "type": "LineString"
            }
          }
        ]
      },
    },
  });

  const mitTrail = await prisma.trail.create({
    data: {
      name: "MIT River Walk",
      description: "A beautiful walk along the Charles River",
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
        latitude: 52.67443496734407,
        longitude: -8.568869120679665,
        trailId: ULTrail.id,
        imagePaths: [
          "historic-tree1.jpg",
          "historic-tree2.jpg",
        ],
        videos: ["https://example.com/historic-tree.mp4"],
      },
      {
        name: "River Viewpoint",
        description: "A beautiful view of the Charles River.",
        latitude: 52.67488345889075,
        longitude: -8.573374999488323,
        trailId: ULTrail.id,
        imagePaths: [
          "river-view1.jpg",
          "river-view2.jpg",
        ],
        videos: ["https://example.com/river-view.mp4"],
      },
    ],
  });

  console.log("✅ Markers with images/videos seeded.");

  // ✅ Create Sample Birds
  const birds = await prisma.bird.createMany({
    data: [
      { name: "American Robin" },
      { name: "Blue Jay" },
      { name: "Cardinal" },
      { name: "Chickadee" },
      { name: "Red-tailed Hawk" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Birds seeded.");

  // ✅ Create Sample Bird Sightings
  const robin = await prisma.bird.findFirst({ where: { name: "American Robin" } });
  const blueJay = await prisma.bird.findFirst({ where: { name: "Blue Jay" } });

  if (robin && blueJay) {
    await prisma.birdSighting.createMany({
      data: [
        {
          birdId: robin.id,
          universityId: UL.id,
          latitude: 52.67443496734407,
          longitude: -8.568869120679665,
          notes: "Spotted near the historic tree",
        },
        {
          birdId: blueJay.id,
          universityId: UL.id,
          latitude: 52.67488345889075,
          longitude: -8.573374999488323,
          notes: "Seen at the river viewpoint",
        },
      ],
    });
  }

  console.log("✅ Bird sightings seeded.");

  // ✅ Create Sample Messages
  await prisma.message.createMany({
    data: [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        subject: "Hello",
        message: "This is a test message",
      },
    ],
  });

  console.log("✅ Messages seeded.");
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
