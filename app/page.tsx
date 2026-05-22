"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    aptos?: any;
    petra?: any;
  }
}

export default function Home() {

  const [walletConnected, setWalletConnected] =
    useState(false);

  const [walletAddress, setWalletAddress] =
    useState("");

  const [uploadedFiles, setUploadedFiles] =
    useState<string[]>([]);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  useEffect(() => {

    const savedFiles =
      localStorage.getItem(
        "shelby_uploads"
      );

    if (savedFiles) {
      setUploadedFiles(
        JSON.parse(savedFiles)
      );
    }

    const savedWallet =
      localStorage.getItem(
        "wallet_address"
      );

    if (savedWallet) {

      setWalletConnected(
        true
      );

      setWalletAddress(
        savedWallet
      );

    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "shelby_uploads",
      JSON.stringify(
        uploadedFiles
      )
    );

  }, [uploadedFiles]);

  async function connectWallet() {

    try {

      let wallet = null;

      if (
        typeof window !==
        "undefined" &&
        window.aptos
      ) {

        wallet =
          window.aptos;

      }

      else if (
        typeof window !==
        "undefined" &&
        window.petra
      ) {

        wallet =
          window.petra;

      }

      if (!wallet) {

        const mobile =
          /Android|iPhone|iPad/i
          .test(
            navigator.userAgent
          );

        if (mobile) {

          window.location.href =
            "petra://";

        }

        alert(
          "Petra Wallet পাওয়া যায়নি"
        );

        return;
      }

      let connected =
        false;

      try {

        connected =
          await wallet
          .isConnected();

      }

      catch {}

      if (
        !connected
      ) {

        await wallet
        .connect();

      }

      const account =
        await wallet
        .account();

      if (
        !account ||
        !account.address
      ) {

        throw new Error(
          "No address"
        );

      }

      setWalletConnected(
        true
      );

      setWalletAddress(
        account.address
      );

      localStorage.setItem(
        "wallet_address",
        account.address
      );

      alert(
        "Wallet Connected"
      );

    }

    catch (e) {

      console.log(e);

      alert(
        "Wallet connection failed"
      );

    }

  }

  function uploadFile(
    e:
    React.ChangeEvent<
      HTMLInputElement
    >
  ) {

    const file =
      e.target.files?.[0];

    if (!file)
      return;

    setUploadProgress(
      20
    );

    setTimeout(
      () => {

      setUploadProgress(
        60
      );

    }, 500);

    setTimeout(
      () => {

      setUploadProgress(
        100
      );

      setUploadedFiles(
        prev => [
          ...prev,
          file.name
        ]
      );

    }, 1200);

  }

  return (

    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#02061d",

        color:
          "white",

        padding:
          "15px"
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
              color:
                "#12b7ff",

              fontSize:
                "58px",

              margin:
                "0"
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
              "#00bcd4",

            color:
              "white",

            border:
              "none",

            borderRadius:
              "10px",

            padding:
              "12px"

          }}

        >

          {

            walletConnected

            ?

            walletAddress
            .slice(
              0,
              8
            )

            + "..."

            :

            "Connect Wallet"

          }

        </button>

      </div>

      <br />

      <div
        style={{

          display:
            "grid",

          gridTemplateColumns:
            "repeat(4,1fr)",

          gap:
            "10px"

        }}
      >

        <div>

          Files Uploaded

          <br />

          {
            uploadedFiles
            .length
          }

        </div>

        <div>

          Storage Active

        </div>

        <div>

          Network Online

        </div>

        <div>

          {

            walletConnected

            ?

            "Wallet Connected"

            :

            "Wallet Not Connected"

          }

        </div>

      </div>

      <br />

      <div

        style={{

          background:
            "#041233",

          padding:
            "25px",

          borderRadius:
            "15px"

        }}

      >

        <center>

          <h3>

            Shelby File Uploader

          </h3>

          <p>

            Powered by Aptos

          </p>

        </center>

        <input

          type="file"

          onChange={
            uploadFile
          }

        />

        <br />
        <br />

        Upload:

        {
          uploadProgress
        }

        %

      </div>

      <br />

      <h3>

        Upload History

      </h3>

      {

        uploadedFiles.map(

          (
            file,
            index
          ) => (

            <div
              key={
                index
              }
            >

              {file}

            </div>

          )

        )

      }

    </main>

  );

}
