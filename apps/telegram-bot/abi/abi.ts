import fs from "fs";

export const wagmiAbi = JSON.parse(
  fs.readFileSync(`${__dirname}/XueDAOCoreContributor.abi`, "utf8"),
);
