export type CreateGame = {
  title: string;
  opponentType: OpponentType;
};

export enum OpponentType {
  UNKNOWN,
  HUMAN,
  COMPUTER,
}
