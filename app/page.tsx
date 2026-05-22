"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    aptos?: any;
  }
}

type UploadItem = {
  name: string;
  size: string;
  time: string;
};

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("Offline");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState<UploadItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedUploads = localStorage.getItem("shelby_uploads");
    const savedWallet = localStorage.getItem("wallet_address");

    if (savedUploads) {
      try {
        setUploadedFiles(JSON.parse(savedUploads));
      } catch {
        setUploadedFiles([]);
      }
    }

    if (savedWallet) {
      setWalletAddress(savedWallet);
    }

    checkWallet();
  }, []);

  useEffect(() => {
    localStorage.setItem("shelby_uploads", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  async function checkWallet() {
    try {
      const aptos = (window as any).aptos;

      if (!aptos || !aptos.isConnected) return;

      const isConnected = await aptos.isConnected();

      if (isConnected) {
        const account = await aptos.account?.();

        if (account?.address) {
          setWalletConnected(true);
          setWalletAddress(account.address);
          setNetwork("Online");
          localStorage.setItem("wallet_address", account.address);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function connectWallet() {
    try {
      const aptos = (window as any).aptos;

      if (aptos && typeof aptos.connect === "function") {
        const response = await aptos.connect();

        const account = await aptos.account?.();
        const address =
          response?.address ||
          account?.address ||
          "";

        if (address) {
          setWalletConnected(true);
          setWalletAddress(address);
          setNetwork("Online");
          localStorage.setItem("wallet_address", address);
          return;
        }

        throw new Error("Wallet address missing");
      }

      const isMobile = /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

      if (isMobile) {
        alert("Petra Wallet app বা browser extension not detected");
        window.location.href = "https://petra.app/";
        return;
      }

      alert("Petra extension not detected");
    } catch (err) {
      console.log(err);
      alert("Wallet connection failed");
    }
  }

  async function disconnectWallet() {
    try {
      const aptos = (window as any).aptos;

      if (aptos?.disconnect) {
        await aptos.disconnect();
      }
    } catch (err) {
      console.log(err);
    }

    setWalletConnected(false);
    setWalletAddress("");
    setNetwork("Offline");
    localStorage.removeItem("wallet_address");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function uploadFile() {
    if (!selectedFile) {
      alert("Select file first");
      return;
    }

    setProgress(0);

    let p = 0;
    const timer = setInterval(() => {
      p += 10;
      setProgress(p);

      if (p >= 100) {
        clearInterval(timer);

        const newItem: UploadItem = {
          name: selectedFile.name,
          size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
          time: new Date().toLocaleTimeString(),
        };

        setUploadedFiles((prev) => [newItem, ...prev]);
      }
    }, 150);
  }

  const filtered = uploadedFiles.filter((x) =>
    x.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#01081f,#020d33)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "58px",
              color: "#22d3ee",
              margin: 0,
            }}
          >
            Shelby
          </h1>
          <p style={{ marginTop: "6px" }}>Storage Dashboard</p>
        </div>

        {!walletConnected ? (
          <button
            onClick={connectWallet}
            style={{
              padding: "12px 18px",
              background: "#06b6d4",
              border: "none",
              borderRadius: "12px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "12px 18px",
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "white",
              }}
            >
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </button>

            <button
              onClick={disconnectWallet}
              style={{
                padding: "12px 18px",
                background: "#dc2626",
                border: "none",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          Files Uploaded
          <br />
          <strong>{uploadedFiles.length}</strong>
        </div>

        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          Storage Active
        </div>

        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          Network
          <br />
          {network}
        </div>

        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {walletConnected ? "Wallet Connected" : "Wallet Not Connected"}
        </div>
      </div>

      <div
        style={{
          background: "#071226",
          marginTop: "30px",
          padding: "30px",
          borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3
          style={{
            color: "#38bdf8",
            textAlign: "center",
            marginTop: 0,
          }}
        >
          Shelby File Uploader
        </h3>

        <p style={{ textAlign: "center", color: "#cbd5e1" }}>
          Powered by Aptos
        </p>

        <div
          style={{
            border: "2px dashed #22d3ee",
            borderRadius: "18px",
            padding: "30px",
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "20px",
            color: "#94a3b8",
          }}
        >
          Drag & Drop Files
          <br />
          or browse files
        </div>

        <input type="file" onChange={handleFile} />

        {preview && (
          <div style={{ marginTop: "18px" }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: "18px" }}>
          <button
            onClick={uploadFile}
            style={{
              padding: "12px 20px",
              background: "#06b6d4",
              border: "none",
              borderRadius: "12px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Upload To Shelby
          </button>
        </div>

        <div
          style={{
            width: "100%",
            height: "12px",
            background: "#1e293b",
            borderRadius: "999px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg,#22d3ee,#0ea5e9)",
              borderRadius: "999px",
              transition: "width 0.2s ease",
            }}
          />
        </div>

        <div style={{ marginTop: "10px", color: "#cbd5e1" }}>
          Upload: {progress}%
        </div>

        {selectedFile && (
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              background: "#0f172a",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>Name: {selectedFile.name}</div>
            <div>Size: {(selectedFile.size / 1024).toFixed(2)} KB</div>
            <div>Time: {new Date().toLocaleTimeString()}</div>
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <h3 style={{ margin: 0 }}>Upload History</h3>

            <button
              onClick={() => {
                setUploadedFiles([]);
                localStorage.removeItem("shelby_uploads");
              }}
              style={{
                padding: "8px 12px",
                background: "#dc2626",
                border: "none",
                borderRadius: "10px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              width: "100%",
              padding: "12px",
              background: "#0f172a",
              color: "white",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              marginBottom: "14px",
            }}
          />

          <div style={{ display: "grid", gap: "10px" }}>
            {filtered.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>No uploads yet</div>
            ) : (
              filtered.map((file, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0f172a",
                    padding: "12px",
                    borderRadius: "12px",
                  }}
                >
                  <div>{file.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                    {file.size} • {file.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            background: "#071226",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Recent Activity</h3>

          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ background: "#0f172a", padding: "12px", borderRadius: "12px" }}>
              Wallet Ready
            </div>
            <div style={{ background: "#0f172a", padding: "12px", borderRadius: "12px" }}>
              Storage Active
            </div>
            <div style={{ background: "#0f172a", padding: "12px", borderRadius: "12px" }}>
              Upload Verified
            </div>
          </div>
        </div>
      </div>

      <footer
        style={{
          textAlign: "center",
          marginTop: "30px",
          color: "#94a3b8",
          paddingBottom: "20px",
        }}
      >
        Shelby Storage Protocol Built With Aptos
      </footer>
    </main>
  );
              }
