import { Button } from "@mui/material";
import ax from "axios";
import { useState } from "react";
import { config } from "../config/config";

const { backendBaseUrl } = config;
const axios = ax.create({ baseURL: backendBaseUrl, withCredentials: true });

type CookieTestProps = {};

const CookieTest = ({}: CookieTestProps) => {
  const [cookie, setCookie] = useState(undefined);

  async function generate() {
    try {
      await axios.get(`/auth/test-cookie/gen`);
      await axios.get(`/auth/test-cookie/secure/gen`);
      await axios.get(`/auth/test-cookie/http/gen`);
      await axios.get(`/cookie`);
    } catch (error) {
      console.log("failed to generate");
    }
  }

  async function get() {
    try {
      await axios.get(`/auth/test-cookie/get`);
    } catch (error) {
      console.log("failed to get");
    }
  }

  async function post() {
    try {
      await axios.post(`/auth/test-cookie/post`);
    } catch (error) {
      console.log("failed to post");
    }
  }

  function jsAccess() {
    const cookie = document.cookie;
    console.log("cookies:", cookie);
  }

  const getCookie = async () => {
    await axios.get(config.backendBaseUrl + "/cookie", {
      withCredentials: true,
    });
  };
  const postCookie = async () => {
    const response = await axios.post(
      config.backendBaseUrl + "/cookie",
      {},
      {
        withCredentials: true,
      }
    );
    setCookie(response.data.cookie);
  };

  return (
    <div>
      <Button onClick={jsAccess}>JS Access</Button>
      <Button onClick={generate}>Generate</Button>
      <Button onClick={get}>Get</Button>
      <Button onClick={post}>Post</Button>
      <Button onClick={getCookie}>get cookie</Button>
      <Button onClick={postCookie}>post cookie</Button>
      <div>{cookie}</div>
    </div>
  );
};

export default CookieTest;
