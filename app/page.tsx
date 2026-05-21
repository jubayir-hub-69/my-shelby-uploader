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
        background:
"linear-gradient(135deg,#050816 0%,#0f172a 40%,#111827 100%)",

backgroundImage:
"radial-gradient(circle at top left, rgba(0,255,255,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.15), transparent 30%)",
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
        <h2
style={{
color:"#38bdf8",
fontSize:"28px"
}}
>
Shelby
</h2>

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
          background:"rgba(255,255,255,0.03)",

backdropFilter:"blur(12px)",

boxShadow:"0 0 30px rgba(0,255,255,0.12)",
        }}
        >
      <h1
  style={{
    fontSize: "38px",
    marginBottom: "10px",
    background: "linear-gradient(to right, #38bdf8, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  }}
>
>
  Shelby File Uploader
</h1>

<p
  style={{
    color: "#94a3b8",
    fontSize: "15px",
    marginBottom: "25px"
  }}
 Secure file upload and ownership verification powered by Aptos
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
  style={{
  padding: "14px 30px",
  borderRadius: "14px",
  background: "linear-gradient(to right, #38bdf8, #06b6d4)",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 0 20px rgba(56,189,248,0.4)",
}}
  }}
>
  🚀 Upload to Shelby
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
