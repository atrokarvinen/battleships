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
            return (
              <TableRow
                key={game.id}
                data-testid="game-row"
                hover
                onClick={() => onGameClicked(game.id)}
                sx={{ ":hover": { cursor: "pointer" } }}
              >
                <TableCell>{game.title}</TableCell>
                <TableCell>
                  {game.players.length > 0 ? game.players[0].username : ""}
                </TableCell>
                <TableCell>
                  {game.players.length > 1 ? game.players[1].username : ""}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default GamesTable;
