import { AxiosResponse } from "axios";
import { showErrorToast } from "../notification/notificationSlice";
import { useAppDispatch } from "../redux/hooks";
import { handleError } from "./errorHandling";

export const useApiRequest = () => {
  const dispatch = useAppDispatch();

  const request = async (req: Promise<AxiosResponse>, showToast = false) => {
    try {
      const response = await req;
      return response;
    } catch (error) {
      const errorMessage = handleError(error);
      if (showToast && typeof errorMessage === "string")
        dispatch(showErrorToast(errorMessage));
    }
  };

  return { request };
};
