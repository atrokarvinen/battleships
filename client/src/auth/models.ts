export type ValidationError = {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
};

export type FormErrorMap = { [path: string]: string };
