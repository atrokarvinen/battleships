import { ShipBuilderValidator } from "../../shipBuilder/shipBuilderValidation";
import { GameState } from "../models";
import { standardReserve, submarine } from "./ship-reserve";
import { createRandomFleetLocations } from "./shipGeneration";

it("generates full game with players and ships", async () => {
  const fleet = createRandomFleetLocations();

  const shipCount = standardReserve.fleets.reduce(
    (sum, fleet) => sum + fleet.quantity,
    0
  );
  expect(fleet).toHaveLength(shipCount);

  const submarines = fleet.filter((x) => x.length === submarine.size);
  expect(submarines).toHaveLength(3);
});

it("places all ships", () => {
  const validator = new ShipBuilderValidator();

  const ships = createRandomFleetLocations();
  const allPlaced = validator.areAllShipsPlaced(ships);

  expect(allPlaced).toBeTruthy();
});

it("places all ships in valid positions", () => {
  const validator = new ShipBuilderValidator();

  const ships = createRandomFleetLocations();
  const act = () => validator.validatePlacements(GameState.PLACEMENTS, ships);

  expect(act).not.toThrowError();
});
