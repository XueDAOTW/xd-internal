import { publicClient } from "./client";
import { wagmiAbi } from "../../abi/abi";
import deployments from "../../abi/deployments.json";

// Example:
// hasNFT("0xD49EeDbE1287C7C8d7a1906477de4184e7988dBD");
// hasNFT("0x65DC003A7f24fcEbe791Dab3D4d277B265c04c10");
export async function hasNFT(ethAddress: string) {
  const balanceOf = Number(
    await publicClient.readContract({
      address: deployments.base.address as `0x${string}`,
      abi: wagmiAbi,
      functionName: "balanceOf",
      args: [ethAddress],
    }),
  );
  console.log(`Balance of ${ethAddress} is ${balanceOf}`);
  return balanceOf > 0;
}
