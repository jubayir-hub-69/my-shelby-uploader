"use client";

import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

function WalletButton() {
  const { connect, account } = useWallet();

  const connectWallet = async () => {
    try {
      await connect("Petra");
    } catch (e) {
      console.log(e);
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
      {account ? (
        <button>
          {account.address.slice(0,6)}...
        </button>
      ) : (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      <WalletButton />
    </AptosWalletAdapterProvider>
  );
}