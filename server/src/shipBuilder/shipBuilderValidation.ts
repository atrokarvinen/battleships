import { GameState, Point, Ship } from "../game/models";
import { pointEquals } from "../game/services/board-utils";
import { standardReserve } from "../game/services/ship-reserve";
import {
  shipToPoints,
  shipsToPoints,
} from "../game/services/shipToSquareMapper";
import { ApiError } from "../middleware/errorHandleMiddleware";

export type PointArea = {
  start: Point;
  end: Point;
};

export class ShipBuilderValidator {
  validatePlacements (gameState: GameState, playerShips: Ship[]) {
    const shipPoints = shipsToPoints(playerShips);

    this.validateCorrectGameState(gameState);
    this.validateNoOverlaps(shipPoints);
    this.validateAllShipsPlaced(playerShips);
    this.validatePointsInsideBorders(shipPoints);
    this.validateNoAdjacentShips(playerShips);
  };

  validateNoOverlaps(shipPoints: Point[]) {
    const hasOverlaps = this.hasDuplicates(shipPoints);
    if (hasOverlaps) throw new ApiError("Ships cannot overlap");
  }

  validateNoAdjacentShips(playerShips: Ship[]) {
    const hasAdjacentShips = this.hasAdjacentShips(playerShips);
    if (hasAdjacentShips)
      throw new ApiError("Ships cannot be cardinally adjacent to each other");
  }

  hasAdjacentShips(playerShips: Ship[]) {
    const shipPoints = shipsToPoints(playerShips);
    const adjacentShipPoints = playerShips
      .map((s) => {
        const ownPoints = shipToPoints(s);
        const rawAdjacent = ownPoints.map(this.getAdjacentPoints).flat();

        // Filter out points that belong to the ship itself
        const adjacent = rawAdjacent.filter(
          (p) => !ownPoints.some(pointEquals(p))
        );
        return adjacent;
      })
      .flat();

    const hasAdjacentShips = shipPoints.some((p) =>
      adjacentShipPoints.some(pointEquals(p))
    );
    return hasAdjacentShips;
  }

  getAdjacentPoints(p: Point) {
    return [
      { x: p.x, y: p.y + 1 },
      { x: p.x + 1, y: p.y },
      { x: p.x, y: p.y - 1 },
      { x: p.x - 1, y: p.y },
    ];
  }

  validatePointsInsideBorders(shipPoints: Point[]) {
    const allShipsInsideBorders = this.arePointsInsideBorders(shipPoints);
    if (!allShipsInsideBorders)
      throw new ApiError("All ships are not within the board limits");
  }

  arePointsInsideBorders(allShipPoints: Point[]) {
    const boardSize = 10;
    const playArea: PointArea = {
      start: { x: 0, y: 0 },
      end: { x: boardSize - 1, y: boardSize - 1 },
    };
    const allShipsInsideBorders = allShipPoints.every((p) =>
      this.pointWithinArea(p, playArea)
    );
    return allShipsInsideBorders;
  }

  validateAllShipsPlaced(playerShips: Ship[]) {
    const allShipsPlaced = this.areAllShipsPlaced(playerShips);
    if (!allShipsPlaced)
      throw new ApiError("All required ships have not been placed on board");
  }

  areAllShipsPlaced(playerShips: Ship[]) {
    const fleets = standardReserve.fleets;
    const allShipsPlaced = fleets.every((fleet) => {
      const matchingShips = playerShips.filter(
        (s) => s.length === fleet.class.size
      );
      return matchingShips.length === fleet.quantity;
    });
    return allShipsPlaced;
  }

  validateCorrectGameState(gameState: GameState) {
    const isCorrectState = gameState === GameState.PLACEMENTS;
    if (!isCorrectState) {
      throwInvalidStateError(gameState, GameState.PLACEMENTS);
    }
  }

  hasDuplicates(points: Point[]) {
    const pointsAggregated: Point[] = [];
    for (let i = 0; i < points.length; ++i) {
      const point = points[i];
      if (pointsAggregated.some(pointEquals(point))) {
        return true;
      }
      pointsAggregated.push(point);
    }
    return false;
  }

  pointWithinArea(point: Point, area: PointArea) {
    const minX = area.start.x;
    const minY = area.start.y;
    const maxX = area.end.x;
    const maxY = area.end.y;
    const { x, y } = point;
    return minX <= x && x <= maxX && minY <= y && y <= maxY;
  }
}

export function throwInvalidStateError(
  state: GameState,
  expectedState: GameState
) {
  const current = GameState[state];
  const expected = GameState[expectedState];
  throw new ApiError(`Invalid game state '${current}'. Expected '${expected}'`);
}
