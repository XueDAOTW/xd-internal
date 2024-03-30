import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnectButton() {
  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <>
              {!connected ? (
                <button
                  onClick={openConnectModal}
                  type="button"
                  className="btn-primary btn w-full"
                >
                  <span className="mr-2.5">
                    <svg
                      height={20}
                      width={20}
                      viewBox="0 0 19 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 13V5C7 3.9 7.89 3 9 3H18V2C18 0.9 17.1 0 16 0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V15H9C7.89 15 7 14.1 7 13ZM10 5C9.45 5 9 5.45 9 6V12C9 12.55 9.45 13 10 13H19V5H10ZM13 10.5C12.17 10.5 11.5 9.83 11.5 9C11.5 8.17 12.17 7.5 13 7.5C13.83 7.5 14.5 8.17 14.5 9C14.5 9.83 13.83 10.5 13 10.5Z"
                        fill="black"
                      />
                    </svg>
                  </span>
                  Connect Wallet
                </button>
              ) : (
                <div>
                  <ConnectButton chainStatus={"none"} showBalance={false} />
                </div>
              )}
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
