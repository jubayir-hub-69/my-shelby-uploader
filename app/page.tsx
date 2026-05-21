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
    ? `${account.address.toString().slice(0,6)}...${account.address
        .toString()
        .slice(-4)}`
    : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        {account ? (
          <>
            <span>{shortAddress}</span>

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

      <div
        style={{
          maxWidth: "700px",
          margin: "80px auto",
          textAlign: "center",
        }}
      >
        <h1>Shelby Uploader</h1>

        <p>
          Upload and verify files on Aptos
        </p>

        <input type="file" />

        <br />
        <br />

        <button
          style={{
            padding: "10px 20px",
          }}
        >
          Upload File
        </button>
      </div>
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
