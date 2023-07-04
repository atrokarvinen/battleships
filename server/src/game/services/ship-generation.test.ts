import { standardReserve, submarine } from "./ship-reserve";
import { createRandomFleetLocations } from "./shipGeneration";

it("generates full game with players and ships", async () => {
  const fleet = createRandomFleetLocations();

  const shipCount = standardReserve.fleets.reduce(
    (sum, fleet) => sum + fleet.quantity,
    0
  );
  expect(fleet).toHaveLength(shipCount);

  const submarines = fleet.filter((x) => x.ship.name === submarine.name);
  expect(submarines).toHaveLength(3);
});
