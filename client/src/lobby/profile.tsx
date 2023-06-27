import { Avatar, Box } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useAuth } from "../auth/useAuth";

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const { username } = useAuth();

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
