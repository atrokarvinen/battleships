import { defaultGameDto } from "../../testing/defaults/defaultGameDto";
import { defaultPlayerDto } from "../../testing/defaults/defaultPlayerDto";
import { GameDTO } from "../models";
import { ShipDTO } from "../models/ship";
import { filterPlayerInfo } from "./info-filter";

it("only sends information known to the player", () => {
  const game: GameDTO = {
    ...defaultGameDto,
    players: [
      {
        ...defaultPlayerDto,
        playerId: "1",
        attacks: [
          {
            x: 0,
            y: 0,
          },
        ],
      },
      {
        ...defaultPlayerDto,
        playerId: "2",
        ownShips: [
          {
            id: "1",
            isVertical: false,
            length: 2,
            start: { x: 0, y: 0 },
          },
        ],
      },
    ],
  };
  const playerId = "1";

  const info = filterPlayerInfo(playerId, game);

  expect(info.players[1].ownShips).toStrictEqual<ShipDTO[]>([
    {
      id: "0",
      isVertical: false,
      length: 1,
      start: { x: 0, y: 0 },
    },
  ]);
});
