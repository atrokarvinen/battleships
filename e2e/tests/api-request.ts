import { APIRequestContext, APIResponse } from "@playwright/test";
import { config } from "./config";

/*
    For some reason, Playwright 'request' does not send cookies with direct
    API requests. This is a workaround to manually add the cookies.
*/

const { backendUrl } = config;
const jwtCookieName = "jwt-cookie";

type APIRequest = {
  request: APIRequestContext;
  url: string;
  data?: any;
};

type APIMethod = "get" | "put" | "post" | "delete";

export const get = (req: APIRequest) => apiRequest(req, "get");
export const put = (req: APIRequest) => apiRequest(req, "put");
export const post = (req: APIRequest) => apiRequest(req, "post");
export const deleteRequest = (req: APIRequest) => apiRequest(req, "delete");

const apiRequest = async (req: APIRequest, method: APIMethod) => {
  const { request, url, data } = req;
  const options = await getOptions(request, data);

  let response: APIResponse;
  switch (method) {
    case "get":
      response = await request.get(backendUrl + url, options);
      break;
    case "put":
      response = await request.put(backendUrl + url, options);
      break;
    case "post":
      response = await request.post(backendUrl + url, options);
      break;
    case "delete":
      response = await request.delete(backendUrl + url, options);
      break;
    default:
      throw new Error("Unknown method " + method);
  }
  return response;
};

const getOptions = async (
  request: APIRequestContext,
  data: any = undefined
) => {
  const jwt = await getJwtCookie(request);
  const headers = { ["Cookie"]: `${jwtCookieName}=${jwt}` };
  const baseOptions = { headers, failOnStatusCode: true };
  const options = data ? { ...baseOptions, data } : baseOptions;
  return options;
};

const getJwtCookie = async (request: APIRequestContext) => {
  const cookies = (await request.storageState()).cookies;
  const jwt = cookies.find((c) => c.name === jwtCookieName);
  return jwt?.value;
};
