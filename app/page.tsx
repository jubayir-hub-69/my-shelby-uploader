"use client";

import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

import { useState } from "react";

function WalletButton() {
  const { connect, disconnect, account } =
    useWallet();

  const [file, setFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [history, setHistory] =
    useState<
      {
        name: string;
        time: string;
        size: string;
      }[]
    >([]);

  const connectWallet = async () => {
    try {
      await connect("Petra");
    } catch (e) {
      console.log(e);
    }
  };

  const shortAddress =
    account?.address
      ? `${account.address
          .toString()
          .slice(0, 6)}...${account.address
          .toString()
          .slice(-4)}`
      : "";

  const uploadFile = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Max file size 10MB"
      );
      return;
    }

    setUploading(true);

    for (
      let i = 0;
      i <= 100;
      i += 10
    ) {
      setProgress(i);

      await new Promise((r) =>
        setTimeout(r, 200)
      );
    }

    setHistory((prev) => [
      {
        name: file.name,
        time:
          new Date().toLocaleTimeString(),
        size:
          (
            file.size /
            1024 /
            1024
          ).toFixed(2) + " MB",
      },
      ...prev,
    ]);

    setUploading(false);

    alert(
      "Upload complete"
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg,#050816 0%,#0f172a 45%,#111827 100%)",

        color: "white",

        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          marginBottom: "40px",
        }}
      >
        <div>
          <h2
            style={{
              color:
                "#38bdf8",
            }}
          >
            Shelby
          </h2>

          <div
            style={{
              color:
                "#94a3b8",
            }}
          >
            Storage Dashboard
          </div>
        </div>

        {account ? (
          <div>
            <div>
              {shortAddress}
            </div>

            <div
              style={{
                color:
                  "#22c55e",

                fontSize:
                  "13px",
              }}
            >
              Wallet
              Connected ✓
            </div>

            <button
              onClick={
                disconnect
              }
              style={{
                marginTop:
                  "10px",
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={
              connectWallet
            }
          >
            Connect
            Wallet
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(3,1fr)",

          gap: "15px",

          maxWidth:
            "900px",

          margin:
            "0 auto 30px",
        }}
      >
        <div
          style={{
            padding:
              "20px",

            border:
              "1px solid #222",

            borderRadius:
              "18px",
          }}
        >
          Files Uploaded

          <h2>
            {
              history.length
            }
          </h2>
        </div>

        <div
          style={{
            padding:
              "20px",

            border:
              "1px solid #222",

            borderRadius:
              "18px",
          }}
        >
          Storage

          <h2>
            Active
          </h2>
        </div>

        <div
          style={{
            padding:
              "20px",

            border:
              "1px solid #222",

            borderRadius:
              "18px",
          }}
        >
          Network

          <h2>
            Aptos
          </h2>
        </div>
      </div>

      <div
        style={{
          maxWidth:
            "760px",

          margin:
            "auto",

          textAlign:
            "center",

          border:
            "1px solid #333",

          padding:
            "35px",

          borderRadius:
            "24px",

          background:
            "rgba(255,255,255,0.03)",

          backdropFilter:
            "blur(12px)",

          boxShadow:
            "0 0 35px rgba(0,255,255,.12)",
        }}
      >
        <h1
          style={{
            fontSize:
              "42px",

            background:
              "linear-gradient(to right,#38bdf8,#06b6d4)",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",
          }}
        >
          Shelby File
          Uploader
        </h1>

        <p
          style={{
            color:
              "#94a3b8",
          }}
        >
          Secure file
          upload and
          ownership
          verification
          powered by
          Aptos
        </p>

        <div
          style={{
            border:
              "2px dashed #38bdf8",

            padding:
              "25px",

            borderRadius:
              "18px",

            marginTop:
              "25px",

            marginBottom:
              "20px",

            color:
              "#94a3b8",
          }}
        >
          Drag &
          Drop Files

          <br />

          or browse
          files
        </div>

        <input
          type="file"
          onChange={(
            e
          ) =>
            setFile(
              e.target
                .files
                ? e.target
                    .files[0]
                : null
            )
          }
        />

        <br />
        <br />

        {file && (
          <div>
            Selected:
            {file.name}
          </div>
        )}

        <br />

        <button
          onClick={
            uploadFile
          }
          disabled={
            uploading
          }
          style={{
            padding:
              "14px 34px",

            borderRadius:
              "14px",

            background:
              "linear-gradient(to right,#38bdf8,#06b6d4)",

            color:
              "white",

            border:
              "none",

            fontWeight:
              "bold",

            cursor:
              "pointer",
          }}
        >
          {uploading
            ? `Uploading ${progress}%`
            : "Upload to Shelby"}
        </button>

        {uploading && (
          <>
            <br />
            <br />

            <div
              style={{
                height:
                  "12px",

                background:
                  "#222",

                borderRadius:
                  "20px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,

                  height:
                    "100%",

                  background:
                    "#38bdf8",

                  borderRadius:
                    "20px",
                }}
              />
            </div>
          </>
        )}

        {history.length >
          0 && (
          <div
            style={{
              marginTop:
                "35px",

              textAlign:
                "left",
            }}
          >
            <h3>
              Upload
              History
            </h3>

            {history.map(
              (
                h,
                i
              ) => (
                <div
                  key={i}
                  style={{
                    marginBottom:
                      "10px",
                  }}
                >
                  📄{" "}
                  {
                    h.name
                  }

                  {" - "}

                  {
                    h.size
                  }

                  {" - "}

                  {
                    h.time
                  }
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AptosWalletAdapterProvider
      autoConnect={
        false
      }
    >
      <WalletButton />
    </AptosWalletAdapterProvider>
  );
}
