// import { MembershipNFTs, MembershipNFTsContract } from "@xd/contracts";
// import { providers } from "ethers";

// const Envs = ["production", "development"] as const;
// export type Env = (typeof Envs)[number];

// function isOfTypeEnv(typeEnvCandidate: string): typeEnvCandidate is Env {
//   return (Envs as readonly string[]).includes(typeEnvCandidate);
// }

// function getEnv(): Env {
//   // @ts-ignore
//   if (isOfTypeEnv(process.env.NODE_ENV)) {
//     return process.env.NODE_ENV as Env;
//   }
//   return "development";
// }

// export const AppEnv = getEnv();

// export function getEndpoint(): string {
//   if (AppEnv === "production") {
//     return "https://app.buzhidao.tw";
//   }

//   return "http://localhost:3000";
// }

// export function getChainConfig(): {
//   providerUrl: string;
//   chainName: "polygon" | "mumbai";
// } {
//   if (AppEnv === "production") {
//     return {
//       providerUrl: "https://rpc.ankr.com/polygon",
//       chainName: "polygon",
//     };
//   }
//   return {
//     providerUrl: "https://rpc.ankr.com/polygon_mumbai",
//     chainName: "mumbai",
//   };
// }

// export function getProvider(overrideUrl?: string): providers.JsonRpcProvider {
//   if (overrideUrl) {
//     return new providers.JsonRpcProvider(overrideUrl);
//   }
//   const { providerUrl } = getChainConfig();
//   return new providers.JsonRpcProvider(providerUrl);
// }

// export function getNFTContract(): MembershipNFTs {
//   const { providerUrl, chainName } = getChainConfig();
//   return MembershipNFTsContract.getInstance(providerUrl, chainName);
// }
