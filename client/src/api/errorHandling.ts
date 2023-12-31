import axios, { AxiosError } from "axios";

export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return handleAxiosError(error);
  }

  console.log("Unknown client side error:", error);

  return "Unknown client error";
};

const handleAxiosError = (axiosError: AxiosError) => {
  if (axiosError.message === "Network Error") {
    return "Could not connect to server";
  }

  const message: any = axiosError.response?.data;
  if (!message) {
    console.log("axiosError.response.data is undefined");
    return "Unknown server side error";
  }

  const errorMessage: string | undefined = message.error;
  if (errorMessage) {
    console.log("[axios.message] rejection message:", errorMessage);
    return errorMessage;
  }

  console.log("No axios error parsed. Rejection reason:", axiosError);

  return "Unknown server side error";
};
