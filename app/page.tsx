"use client";

import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

import { useState } from "react";

function WalletButton() {
  const { connect, disconnect, account } = useWallet();

  const [file, setFile] = useState<File | null>(null);

  const connectWallet = async () => {
    try {
      await connect("Petra");
    } catch (e) {
      console.log(e);
    }
  };

  const shortAddress = account?.address
    ? `${account.address.toString().slice(0, 6)}...${account.address
        .toString()
        .slice(-4)}`
    : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Shelby Uploader</h2>

        {account ? (
          <div>
            {shortAddress}

            <button
              onClick={disconnect}
              style={{
                marginLeft: "10px",
                padding: "8px 14px",
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            style={{
              padding: "8px 14px",
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
          border: "1px solid #333",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h1>Shelby File Uploader</h1>

        <p>
          Upload files and verify ownership with Aptos wallet
        </p>

        <br />

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files
                ? e.target.files[0]
                : null
            )
          }
        />

        <br />
        <br />

        {file && (
          <div>
            Selected: {file.name}
          </div>
        )}

        <br />

        <button
  onClick={() => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    alert(`Uploading: ${file.name}`);
  }}
  style={{
    padding: "12px 22px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
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
