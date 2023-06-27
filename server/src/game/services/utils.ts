export const convertMongo = <T>(entity: T): T & { id: string } => {
  return { id: "1", ...entity };
};
