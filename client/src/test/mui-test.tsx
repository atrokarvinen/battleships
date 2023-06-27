import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import styles from "./styles.module.scss";

type MuiTestProps = {};

const MuiTest = ({}: MuiTestProps) => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'>
  return (
    <Box
      sx={{ flexGrow: 1 }}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      <Paper sx={{ flex: "0 1" }}>Header</Paper>
      <Paper sx={{ flex: "0 1" }}>Navigation Menu</Paper>
      <Box display={"flex"} flexDirection={"row"} flex={"1 1"}>
        <Paper sx={{ flex: "1 1" }}>Content 1</Paper>
        <Paper sx={{ flex: "1 1" }}>
          <Stack height={"100%"}>
            <Typography>Kana</Typography>
            <Typography flex={"1 1"}>Kala</Typography>
            <Typography>Kukko</Typography>
          </Stack>
        </Paper>
        <Paper sx={{ flex: "1 1" }}>Content 2</Paper>
      </Box>
      <Paper sx={{ flex: "0 1" }}>Footer</Paper>
    </Box>
  );
};

export default MuiTest;
