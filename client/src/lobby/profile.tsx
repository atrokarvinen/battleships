import { Avatar, Box } from "@mui/material";
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
      <h2 datatest-id="player-name">{`Player: ${username}`}</h2>
      <Avatar sx={{ bgcolor: deepPurple[500] }}>
        {getFirstLetter(username)}
      </Avatar>
    </Box>
  );
};

export default Profile;
