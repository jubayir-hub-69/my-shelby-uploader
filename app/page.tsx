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
        minHeight:
          "100vh",
        background:
          "#020617",
        color:
          "white",
        padding:
          "20px",
      }}
    >
      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize:
                "58px",

              color:
                "#00bfff",
            }}
          >
            Shelby
          </h1>

          <p>
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
              "#06b6d4",

            color:
              "white",

            padding:
              "14px",

            border:
              "none",

            borderRadius:
              "12px",
          }}
        >
          {connected
            ? account
                ?.address
                ?.toString()
                .slice(
                  0,
                  6
                ) +
              "..." +
              account
                ?.address
                ?.toString()
                .slice(
                  -4
                )
            : "Connect Wallet"}
        </button>
      </div>

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",

          gap:
            "15px",

          marginTop:
            "30px",
        }}
      >
        <div>
          Files Uploaded
          <br />
          1
        </div>

        <div>
          Storage Active
        </div>

        <div>
          Network
          <br />
          {network}
        </div>

        <div>
          {connected
            ? "Wallet Connected"
            : "Wallet Not Connected"}
        </div>
      </div>
    </main>
  );
}
