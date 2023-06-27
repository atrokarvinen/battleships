import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import styles from "./styles.module.scss";
import { GameRoom } from "./gameRoom";
import { joinGameRequest } from "./api";

type GamesTableProps = {
  games: GameRoom[];
  onGameClicked(id: string): void;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Player 1</StyledTableCell>
            <StyledTableCell>Player 2</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((game, id) => {
            return (
              <TableRow
                key={game.id}
                data-testid="game-row"
                hover
                onClick={() => onGameClicked(game.id)}
                sx={{ ":hover": { cursor: "pointer" } }}
              >
                <TableCell>{id + 1}</TableCell>
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
