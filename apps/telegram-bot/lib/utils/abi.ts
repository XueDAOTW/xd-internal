import fs from "fs";

export const wagmiAbi = JSON.parse(
  fs.readFileSync(`${__dirname}/../../abi/XueDAOCoreContributor.abi`, "utf8")
);
