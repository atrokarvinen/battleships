import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { GameRoom } from "./gameRoom";
import { getPlayerNames } from "./lobbyUtils";

type GamesTableProps = {
  games: GameRoom[];
  onGameClicked(id: string): void;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const GamesTable = ({ games, onGameClicked }: GamesTableProps) => {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Player 1</StyledTableCell>
            <StyledTableCell>Player 2</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((game) => {
            const { player1, player2 } = getPlayerNames(game);
            return (
              <TableRow
                key={game.id}
                data-testid="game-row"
                hover
                onClick={() => onGameClicked(game.id)}
                sx={{ ":hover": { cursor: "pointer" } }}
              >
                <TableCell>{game.title}</TableCell>
                <TableCell>{player1}</TableCell>
                <TableCell>{player2}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default GamesTable;
