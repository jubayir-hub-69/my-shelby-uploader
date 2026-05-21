"use client";

import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

function WalletButton() {
  const { connect, account, connected, wallets } = useWallet();

  const connectWallet = async () => {
    try {
      console.log("wallets =", wallets);

      await connect("Petra");

      console.log("connected");
    } catch (e) {
      console.log("ERROR =", e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "20px",
      }}
    >
      {connected ? (
        <p>{account?.address?.toString()}</p>
      ) : (
        <button onClick={connectWallet}>
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