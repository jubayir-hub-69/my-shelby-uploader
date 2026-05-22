"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    aptos?: any;
    petra?: any;
  }
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState("Offline");

  const getProvider = () => {
    if (typeof window === "undefined") return null;

    if (window.aptos) return window.aptos;

    if (window.petra?.aptos) return window.petra.aptos;

    return null;
  };

  useEffect(() => {
    autoConnect();
  }, []);

  async function autoConnect() {
    try {
      const provider = getProvider();

      if (!provider) return;

      const status = await provider.isConnected();

      if (status) {
        const account = await provider.account();

        setWalletAddress(account.address);

        setConnected(true);

        setNetwork("Online");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function connectWallet() {
    try {
      const provider = getProvider();

      if (!provider) {
        alert("Petra wallet not detected");
        return;
      }

      await provider.connect();

      const account = await provider.account();

      setWalletAddress(account.address);

      setConnected(true);

      setNetwork("Online");
    } catch (e) {
      console.log(e);

      alert("Wallet connection failed");
    }
  }

  async function disconnectWallet() {
    try {
      const provider = getProvider();

      if (provider) {
        await provider.disconnect();
      }

      setWalletAddress("");

      setConnected(false);

      setNetwork("Offline");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#38bdf8",
              fontSize: "60px",
              margin: 0,
            }}
          >
            Shelby
          </h1>

          <p>Storage Dashboard</p>
        </div>

        {!connected ? (
          <button
            onClick={connectWallet}
            style={{
              background: "#0891b2",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={disconnectWallet}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
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
          }}
        >
          {connected
            ? walletAddress.slice(0, 8) +
              "..." +
              walletAddress.slice(-6)
            : "Wallet Not Connected"}
        </div>
      </div>

      <div
        style={{
          background: "#071226",
          marginTop: "30px",
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

        <p style={{ textAlign: "center" }}>
          Powered by Aptos
        </p>

        <input type="file" />
      </div>
    </main>
  );
}
