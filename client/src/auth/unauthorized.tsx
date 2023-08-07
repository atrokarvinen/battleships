import { Button } from "@mui/material";
import { useNavigate } from "react-router";

type UnauthorizedProps = {
  deniedRoute?: string;
};

const Unauthorized = ({ deniedRoute }: UnauthorizedProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Unauthorized, please log in</h1>
      <Button
        onClick={() => navigate("/login", { state: { deniedRoute } })}
        variant="contained"
      >
        Login
      </Button>
    </div>
  );
};

export default Unauthorized;
