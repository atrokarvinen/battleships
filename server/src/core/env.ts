import dotenv from "dotenv";

const config = dotenv.config();

export interface EnvConfig {
  CLIENT_ADDRESS: string;
  DB_CONNECTION_STRING: string;
  DB_CONNECTION_STRING_TESTS: string;
  HOST_ADDRESS: string;
  HTTP_PORT: number;
  JWT_COOKIE_NAME: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

const parseConfig = () => {
  console.log("Parsing environment variables...");

  const {
    CLIENT_ADDRESS,
    DB_CONNECTION_STRING,
    DB_CONNECTION_STRING_TESTS,
    HOST_ADDRESS,
    HTTP_PORT,
    JWT_COOKIE_NAME,
    JWT_SECRET,
    NODE_ENV,
  } = process.env;

  const env: EnvConfig = {
    CLIENT_ADDRESS: toString(CLIENT_ADDRESS, "CLIENT_ADDRESS"),
    DB_CONNECTION_STRING: toString(
      DB_CONNECTION_STRING,
      "DB_CONNECTION_STRING"
    ),
    DB_CONNECTION_STRING_TESTS: toString(
      DB_CONNECTION_STRING_TESTS,
      "DB_CONNECTION_STRING_TESTS"
    ),
    HOST_ADDRESS: toString(HOST_ADDRESS, "HOST_ADDRESS"),
    HTTP_PORT: toNumber(HTTP_PORT, "HTTP_PORT"),
    JWT_COOKIE_NAME: toString(JWT_COOKIE_NAME, "JWT_COOKIE_NAME"),
    JWT_SECRET: toString(JWT_SECRET, "JWT_SECRET"),
    NODE_ENV: toString(NODE_ENV, "NODE_ENV"),
  };

  // console.log("Successfully parsed environment variables:", env);

  return env;
};

const toNumber = (value: string | undefined, name: string) => {
  if (!value) {
    return 0;
    throw new Error(`Environment variable '${name}' is missing`);
  }
  if (isNaN(+value)) {
    return -1;
    const msg = `Failed to convert environment variable '${name}': '${value}' to number`;
    throw new Error(msg);
  }
  return +value;
};

const toString = (value: string | undefined, name: string) => {
  if (!value) {
    return "N/A";
    throw new Error(`Environment variable '${name}' is missing`);
  }
  return value;
};

export const env = parseConfig();
