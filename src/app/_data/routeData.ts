export const routeGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Start Point" },
        geometry: {
          type: "Point",
          coordinates: [-0.09, 51.505], // [Longitude, Latitude]
        },
      },
      {
        type: "Feature",
        properties: { name: "Waypoint 1" },
        geometry: {
          type: "Point",
          coordinates: [-0.08, 51.51],
        },
      },
      {
        type: "Feature",
        properties: { name: "Waypoint 2" },
        geometry: {
          type: "Point",
          coordinates: [-0.06, 51.52],
        },
      },
      {
        type: "Feature",
        properties: { name: "End Point" },
        geometry: {
          type: "Point",
          coordinates: [-0.05, 51.53],
        },
      },
      {
        type: "Feature",
        properties: { name: "Route" },
        geometry: {
          type: "LineString",
          coordinates: [
            [-0.09, 51.505], // Start
            [-0.08, 51.51],
            [-0.06, 51.52],
            [-0.05, 51.53], // End
          ],
        },
      },
    ],
  };
  