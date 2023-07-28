import { ApiError } from "../../middleware/errorHandleMiddleware";
import { AttackSquare } from "../models";
import { GameService } from "./gameService";

let ongoingAttacks: string[] = [];

export class AttackService {
  private gameDbService: GameService = new GameService();
   
  attack = async (attackParams: AttackSquare) => {
    const attackerId = attackParams.attackerPlayerId;
    if (ongoingAttacks.includes(attackerId)) {
      throw new ApiError(`Player '${attackerId}' is already attacking`);
    }
    try {
      ongoingAttacks.push(attackerId);
      const result = await this.gameDbService.attackSquare(attackParams);
      const attackResultDto = this.mapAttackResultToDto(result, attackParams);
      return attackResultDto;
    }
    finally{
      ongoingAttacks = ongoingAttacks.filter(x => x !== attackerId);
    }
  };

  private mapAttackResultToDto = (result: any, attack: AttackSquare) => {
    const { point, attackerPlayerId } = attack;
    const attackResultDto = {
      hasShip: result.shipHit,
      nextPlayerId: result.nextPlayerId,
      isGameOver: result.isGameOver,
      point,
      attackerPlayerId,
      winnerPlayerId: result.isGameOver ? attackerPlayerId : undefined,
    };
    return attackResultDto;
  };
}
