"use client";

import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

function WalletButton() {
  const { connect, disconnect, account } = useWallet();

  const connectWallet = async () => {
    try {
      await connect("Petra");
    } catch (e) {
      console.log(e);
    }
  };

  const shortAddress = account?.address
    ? ${account.address.toString().slice(0, 6)}...${account.address
        .toString()
        .slice(-4)}
    : "";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "20px",
        gap: "10px",
      }}
    >
      {account ? (
        <>
          <span
            style={{
              color: "white",
              paddingTop: "8px",
            }}
          >
            {shortAddress}
          </span>

          <button
            onClick={disconnect}
            style={{
              padding: "8px 12px",
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          style={{
            padding: "8px 12px",
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AptosWalletAdapterProvider autoConnect={false}>
      <WalletButton />
    </AptosWalletAdapterProvider>
  );
}