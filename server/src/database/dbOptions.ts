import { ToObjectOptions } from "mongoose";

// Removes version key '__v', renames '_id' => 'id' and converts it to string
const options = (): ToObjectOptions => {
  return {
    versionKey: false,
    transform: transformMongooseModel,
  };
};

const transformMongooseModel = (doc: any, ret: any) => {
  const transformed = { ...ret, id: ret._id.toString() };
  delete transformed._id;
  return transformed;
};

export const toObjectOptions: ToObjectOptions = options();
