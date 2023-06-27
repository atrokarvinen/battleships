import { standardReserve, submarine } from "../boat-reserve";
import { createRandomFleetLocations } from "../boatGeneration";

it("generates full game with players and boats", async () => {
  const fleet = createRandomFleetLocations();

  const boatCount = standardReserve.fleets.reduce(
    (sum, fleet) => sum + fleet.quantity,
    0
  );
  expect(fleet).toHaveLength(boatCount);

  const submarines = fleet.filter((x) => x.boat.name === submarine.name);
  expect(submarines).toHaveLength(3);
});
