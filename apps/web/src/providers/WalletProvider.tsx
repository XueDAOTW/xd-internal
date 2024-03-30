"use client";

import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { type ReactNode } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Bu Zhi DAO internal",
});

const { chains, provider } = configureChains(
  [mainnet, polygon],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "buzhidao-internal",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export interface WalletProviderProps {
  children: ReactNode;
  session?: Session | null;
}

const WalletProvider = (props: WalletProviderProps) => {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider refetchInterval={0} session={props.session}>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider
              chains={chains}
              modalSize="compact"
              theme={lightTheme({
                borderRadius: "medium",
                fontStack: "system",
              })}
            >
              {props.children}
            </RainbowKitProvider>{" "}
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
    </>
  );
};

export default WalletProvider;
