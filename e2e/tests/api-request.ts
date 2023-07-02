import { APIRequestContext, expect } from "@playwright/test";
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

export const get = async ({ request, url }: APIRequest) => {
  const options = await getOptions(request);
  const response = await request.get(backendUrl + url, options);
  expect(response.ok()).toBeTruthy();
  return response;
};

export const put = async ({ request, url, data }: APIRequest) => {
  const options = await getOptions(request, data);
  const response = await request.put(backendUrl + url, options);
  expect(response.ok()).toBeTruthy();
  return response;
};

export const post = async ({ request, url, data }: APIRequest) => {
  const options = await getOptions(request, data);
  const response = await request.post(backendUrl + url, options);
  expect(response.ok()).toBeTruthy();
  return response;
};

// 'delete' is a reserved word
export const deleteRequest = async ({ request, url }: APIRequest) => {
  const options = await getOptions(request);
  const response = await request.delete(backendUrl + url, options);
  expect(response.ok()).toBeTruthy();
  return response;
};

const getOptions = async (
  request: APIRequestContext,
  data: any = undefined
) => {
  const jwt = await getJwtCookie(request);
  const headers = { ["Cookie"]: `${jwtCookieName}=${jwt}` };
  const options = { headers, data };
  return options;
};

const getJwtCookie = async (request: APIRequestContext) => {
  const cookies = (await request.storageState()).cookies;
  const jwt = cookies.find((c) => c.name === jwtCookieName);
  return jwt?.value;
};
