// import { MembershipNFTs, MembershipNFTsContract } from "@xd/contracts";

// function getNFTContract(): MembershipNFTs {
//   const { providerUrl, chainName } = getChainConfig();
//   return MembershipNFTsContract.getInstance(providerUrl, chainName);
// }

// export async function hasCurrentSeasonNFT(ethAddress: string) {
//   // TODO: Check with XueDAO NFT
//   return true;
//   /*
//   const contract = getNFTContract();
//   const balanceOf = await contract.balanceOf(
//     ethAddress,
//     await contract.currentSeason()
//   );
//   console.log(`Balance of ${ethAddress} is ${balanceOf}`);
//   return balanceOf > BigInt(0);
//   */
// }

import { publicClient } from "./client";
import { wagmiAbi } from "./abi";
import fs from "fs";

const deployments = JSON.parse(
  fs.readFileSync("./abi/deployments.json", "utf8"),
);

export async function hasNFT(ethAddress: string) {
  const balanceOf = Number(
    await publicClient.readContract({
      address: deployments.base.address,
      abi: wagmiAbi,
      functionName: "balanceOf",
      args: [ethAddress],
    }),
  );
  console.log(`Balance of ${ethAddress} is ${balanceOf}`);
  return balanceOf > 0;
}

// Demo:
// hasNFT("0xD49EeDbE1287C7C8d7a1906477de4184e7988dBD");
// hasNFT("0x65DC003A7f24fcEbe791Dab3D4d277B265c04c10");
