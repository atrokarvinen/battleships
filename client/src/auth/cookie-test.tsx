import { Button } from "@mui/material";
import { useState } from "react";
import { axios } from "../api/axios";

type CookieTestProps = {};

const CookieTest = ({}: CookieTestProps) => {
  const [cookie, setCookie] = useState(undefined);

  async function generate() {
    try {
      await axios.get(`/cookie/test-cookie/gen`);
      await axios.get(`/cookie/test-cookie/secure/gen`);
      await axios.get(`/cookie/test-cookie/http/gen`);
      await axios.get(`/cookie`);
    } catch (error) {
      console.log("failed to generate");
    }
  }

  async function get() {
    try {
      await axios.get(`/cookie/test-cookie/get`);
    } catch (error) {
      console.log("failed to get");
    }
  }

  async function post() {
    try {
      await axios.post(`/cookie/test-cookie/post`);
    } catch (error) {
      console.log("failed to post");
    }
  }

  function jsAccess() {
    const cookie = document.cookie;
    console.log("cookies:", cookie);
  }

  const getCookie = async () => {
    await axios.get("/cookie");
  };
  const postCookie = async () => {
    const response = await axios.post("/cookie");
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
