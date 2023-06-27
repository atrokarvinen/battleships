import { Button } from "@mui/material";
import { config } from "../config/config";
import ax from "axios";

const { backendBaseUrl } = config;
const axios = ax.create({ baseURL: backendBaseUrl, withCredentials: true });

type CookieTestProps = {};

const CookieTest = ({}: CookieTestProps) => {
  async function generate() {
    try {
      await axios.get(`/auth/test-cookie/gen`);
      await axios.get(`/auth/test-cookie/secure/gen`);
      await axios.get(`/auth/test-cookie/http/gen`);
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

  return (
    <div>
      <Button onClick={jsAccess}>JS Access</Button>
      <Button onClick={generate}>Generate</Button>
      <Button onClick={get}>Get</Button>
      <Button onClick={post}>Post</Button>
    </div>
  );
};

export default CookieTest;
