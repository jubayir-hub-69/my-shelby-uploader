"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [wallet, setWallet] = useState("");
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState("Offline");

  async function connectWallet() {

    try {

      const aptos =
        (window as any).aptos;

      if (!aptos) {

        alert(
          "Petra Wallet not installed"
        );

        return;

      }

      const response =
        await aptos.connect();

      if (
        response?.address
      ) {

        setWallet(
          response.address
        );

        setConnected(true);

        setNetwork(
          "Online"
        );

      }

    }

    catch (error) {

      console.error(
        error
      );

      alert(
        "Wallet connection failed"
      );

    }

  }

  async function checkWallet() {

    try {

      const aptos =
        (window as any).aptos;

      if (!aptos)
        return;

      const isConnected =
        await aptos
        .isConnected();

      if (
        isConnected
      ) {

        const account =
          await aptos
          .account();

        setWallet(
          account.address
        );

        setConnected(
          true
        );

        setNetwork(
          "Online"
        );

      }

    }

    catch (err) {

      console.log(
        err
      );

    }

  }

  useEffect(() => {

    checkWallet();

  }, []);

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
        "20px"

      }}
    >

      <div
        style={{

          display:
          "flex",

          justifyContent:
          "space-between",

          alignItems:
          "center"

        }}
      >

        <div>

          <h1
            style={{

              fontSize:
              "58px",

              color:
              "#00bfff"

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
            connectWallet
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
            "12px"

          }}
        >

          {

            connected

            ?

            wallet
            .slice(0,6)

            +

            "..."

            +

            wallet
            .slice(-4)

            :

            "Connect Wallet"

          }

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
          "30px"

        }}
      >

        <div>

          Files Uploaded

          <br/>

          0

        </div>

        <div>

          Storage Active

        </div>

        <div>

          Network

          <br/>

          {

            network

          }

        </div>

        <div>

          {

            connected

            ?

            "Wallet Connected"

            :

            "Wallet Not Connected"

          }

        </div>

      </div>

    </main>

  );

}
