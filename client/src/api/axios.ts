import base from "axios";
import { config } from "../config/config";

const baseURL = config.backendBaseUrl;

export const axios = base.create({ baseURL, withCredentials: true });
