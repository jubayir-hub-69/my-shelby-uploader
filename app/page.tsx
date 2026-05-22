"use client";

import { useEffect, useState } from "react";

import {
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

export default function Home() {
  const {
    connect,
    disconnect,
    connected,
    account,
    wallets,
  } = useWallet();

  const [network, setNetwork] =
    useState("Offline");

  async function connectWallet() {
    try {
      // Desktop extension / mobile extension
      if (
        wallets.length > 0
      ) {
        await connect(
          wallets[0].name
        );

        setNetwork(
          "Online"
        );

        return;
      }

      // Mobile Petra app redirect
      const url =
        window.location.href;

      window.location.href =
        `petra://wallet/connect?url=${encodeURIComponent(
          url
        )}`;

      setTimeout(() => {
        window.open(
          "https://petra.app/",
          "_blank"
        );
      }, 1200);
    } catch (err) {
      console.log(err);

      alert(
        "Wallet connection failed"
      );
    }
  }

  useEffect(() => {
    if (
      connected
    ) {
      setNetwork(
        "Online"
      );
    }
  }, [connected]);

  return (
  <main
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(180deg,#07111f,#0c1830)",
      color: "white",
      padding: "25px",
      fontFamily: "sans-serif",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "48px",
            margin: 0,
            color: "#34d3ff",
          }}
        >
          Shelby
        </h1>

        <p
          style={{
            opacity: 0.7,
          }}
        >
          Storage Dashboard
        </p>
      </div>

      <button
        onClick={
          connected
            ? disconnect
            : connectWallet
        }
        style={{
          background:
            "linear-gradient(90deg,#00c6ff,#0072ff)",
          border: "none",
          padding: "14px 20px",
          borderRadius: "15px",
          color: "white",
        }}
      >
        {connected
          ? account?.address
              ?.toString()
              .slice(0,6)
            + "..."
            + account?.address
              ?.toString()
              .slice(-4)
          : "Connect Wallet"}
      </button>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "18px",
      }}
    >

      <div
        style={{
          background:"#101d36",
          padding:"20px",
          borderRadius:"20px",
        }}
      >
        <h3>Files Uploaded</h3>
        <h1>1</h1>
      </div>

      <div
        style={{
          background:"#101d36",
          padding:"20px",
          borderRadius:"20px",
        }}
      >
        <h3>Storage</h3>
        <h1>Active</h1>
      </div>

      <div
        style={{
          background:"#101d36",
          padding:"20px",
          borderRadius:"20px",
        }}
      >
        <h3>Network</h3>
        <h1>{network}</h1>
      </div>

      <div
        style={{
          background:"#101d36",
          padding:"20px",
          borderRadius:"20px",
        }}
      >
        <h3>Status</h3>

        <h1>
          {connected
            ? "Connected"
            : "Disconnected"}
        </h1>

      </div>

    </div>

    <div
      style={{
        marginTop:"30px",
        background:"#101d36",
        padding:"25px",
        borderRadius:"20px",
      }}
    >
      <h2>Upload Area</h2>

      <div
        style={{
          border:
            "2px dashed #34d3ff",
          padding:"50px",
          textAlign:"center",
          borderRadius:"20px",
        }}
      >
        Drop file here
      </div>

    </div>

  </main>
);

