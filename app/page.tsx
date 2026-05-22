"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    aptos?: {
      connect: () => Promise<{ address: string }>;
      account: () => Promise<{ address: string }>;
      isConnected: () => Promise<boolean>;
      disconnect: () => Promise<void>;
    };
      petra?: {
      connect: () => Promise<{ address: string }>;
      account: () => Promise<{ address: string }>;
      isConnected: () => Promise<boolean>;
      disconnect: () => Promise<void>;
    };
  }
}

export default function Home() {
  const [wallet, setWallet] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState("Offline");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    checkWallet();
  }, []);

  async function checkWallet() {
    try {
      const provider = window.aptos || window.petra;

      if (!provider) {
        console.log("Wallet not found");
        return;
      }

      const isConnected = await provider.isConnected();

      if (isConnected) {
        const account = await provider.account();

        setWallet(account.address);
        setConnected(true);
        setNetwork("Online");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function connectWallet() {
    try {
      const provider = window.aptos || window.petra;

      if (!provider) {
        alert(
          "Petra wallet not found. Install Petra browser extension or mobile app."
        );
        return;
      }

      const response = await provider.connect();

      setWallet(response.address);
      setConnected(true);
      setNetwork("Online");

      alert("Wallet connected");
    } catch (err) {
      console.log(err);

      alert("Wallet connection failed");
    }
  }

  async function disconnectWallet() {
    try {
      const provider = window.aptos || window.petra;

      if (provider) {
        await provider.disconnect();
      }

      setWallet("");
      setConnected(false);
      setNetwork("Offline");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#38bdf8",
              fontSize: "58px",
              marginBottom: "10px",
            }}
          >
            Shelby
          </h1>

          <p style={{ color: "#cbd5e1" }}>
            Storage Dashboard
          </p>
        </div>

        {!connected ? (
          <button
            onClick={connectWallet}
            style={{
              background: "#0891b2",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              color: "white",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={disconnectWallet}
            style={{
              background: "#dc2626",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              color: "white",
            }}
          >
            Disconnect
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          Files Uploaded
          <br />
          0
        </div>

        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          Storage Active
        </div>

        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          Network {network}
        </div>

        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {connected
            ? wallet.slice(0, 8) +
              "..." +
              wallet.slice(-6)
            : "Wallet Not Connected"}
        </div>
      </div>

      <div
        style={{
          background: "#06142b",
          padding: "30px",
          borderRadius: "15px",
        }}
      >
        <h3
          style={{
            color: "#38bdf8",
            textAlign: "center",
          }}
        >
          Shelby File Uploader
        </h3>

        <p
          style={{
            textAlign: "center",
          }}
        >
          Powered by Aptos
        </p>

        <br />

        <input type="file" />

        <br />
        <br />

        Upload: {uploadProgress}%
      </div>
    </main>
  );
}
