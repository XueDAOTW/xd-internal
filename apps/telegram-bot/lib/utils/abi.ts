import fs from "fs";

export const wagmiAbi = JSON.parse(
  fs.readFileSync("./abi/XueDAOCoreContributor.abi", "utf8"),
);
