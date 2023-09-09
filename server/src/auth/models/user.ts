import { Types } from "mongoose";

export type User = {
  username: string;
  password: string;
};

export type UserDTO = {
  id: string;
  username: string;
  gamesJoined: string[];
};

export interface IUser {
  id?: string;

  username: string;
  password: string;

  gamesJoined: Types.ObjectId[];
}