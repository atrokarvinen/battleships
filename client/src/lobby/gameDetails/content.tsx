import { DialogContent, Stack, Typography } from "@mui/material";
import { OpponentType } from "../createGameRoom/createGame";
import { GameRoom } from "../gameRoom";
import { getPlayerNames } from "../lobbyUtils";

type ContentProps = { game: GameRoom };

const Content = ({ game }: ContentProps) => {
  const { player1, player2 } = getPlayerNames(game);

  const ContentRow = ({ label, value }: { label: string; value: string }) => {
    return (
      <Stack direction="row" spacing={3} justifyContent="space-between">
        <Typography fontWeight="bold">{label}:</Typography>
        <Typography>{value}</Typography>
      </Stack>
    );
  };

  const formattedCreateDate = new Date(game.createdAt).toLocaleString("fi-FI");
  const gameMode =
    game.opponentType === OpponentType.HUMAN
      ? "Multiplayer"
      : game.opponentType === OpponentType.COMPUTER
      ? "Single player"
      : "N/A";

  return (
    <DialogContent>
      <Stack direction="column">
        <ContentRow label="Player 1" value={player1} />
        <ContentRow label="Player 2" value={player2} />
        <ContentRow label="Game mode" value={gameMode} />
        <ContentRow label="Created" value={formattedCreateDate} />
      </Stack>
    </DialogContent>
  );
};

export { Content };
