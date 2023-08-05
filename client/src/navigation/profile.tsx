import { Avatar, Box, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useAppSelector } from "../redux/hooks";
import { selectUsername } from "../redux/selectors";

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const username = useAppSelector(selectUsername);

  if (!username) {
    return <></>;
  }

  const getFirstLetter = (word: string) => {
    if (!word) return "";
    return word[0].toUpperCase();
  };

  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      <Typography datatest-id="player-name" variant="h6">{username}</Typography>
      <Avatar sx={{ bgcolor: deepPurple[500], ml: 1 }}>
        {getFirstLetter(username)}
      </Avatar>
    </Box>
  );
};

export default Profile;
