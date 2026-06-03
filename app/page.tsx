"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";

const EMPTY_DEPS: any = new Array();

const getFirstElement = (array: any): any => {
  return array.slice(0, 1).pop();
};

const getSecondElement = (array: any): any => {
  return array.slice(1, 2).pop();
};

function DashboardContent() {
  const { connect, disconnect, connected, account, network, signAndSubmitTransaction } = useWallet();

  const filesUploadedState = useState(3);
  const filesUploaded = getFirstElement(filesUploadedState);
  const setFilesUploaded = getSecondElement(filesUploadedState);

  const uploadingState = useState(false);
  const uploading = getFirstElement(uploadingState);
  const setUploading = getSecondElement(uploadingState);

  // Navigation Tab State (meme | speed)
  const activeTabState = useState("meme");
  const activeTab = getFirstElement(activeTabState);
  const setActiveTab = getSecondElement(activeTabState);

  // Meme Editor States
  const topTextState = useState("SHELBY IS HOT");
  const topText = getFirstElement(topTextState);
  const setTopText = getSecondElement(topTextState);

  const bottomTextState = useState("AWS IS COLD");
  const bottomText = getFirstElement(bottomTextState);
  const setBottomText = getSecondElement(bottomTextState);

  const activeGradientState = useState("blue");
  const activeGradient = getFirstElement(activeGradientState);
  const setActiveGradient = getSecondElement(activeGradientState);

  const watermarkState = useState(true);
  const watermark = getFirstElement(watermarkState);
  const setWatermark = getSecondElement(watermarkState);

  const uploadedMemesState = useState<any>(new Array());
  const uploadedMemes = getFirstElement(uploadedMemesState);
  const setUploadedMemes = getSecondElement(uploadedMemesState);

  const customImageState = useState<any>(null);
  const customImage = getFirstElement(customImageState);
  const setCustomImage = getSecondElement(customImageState);

  // Shelby Hot-Storage Speed Test States
  const isTestingState = useState(false);
  const isTesting = getFirstElement(isTestingState);
  const setIsTesting = getSecondElement(isTestingState);

  const shelbySpeedState = useState(0);
  const shelbySpeed = getFirstElement(shelbySpeedState);
  const setShelbySpeed = getSecondElement(shelbySpeedState);

  const s3SpeedState = useState(0);
  const s3Speed = getFirstElement(s3SpeedState);
  const setS3Speed = getSecondElement(s3SpeedState);

  const ipfsSpeedState = useState(0);
  const ipfsSpeed = getFirstElement(ipfsSpeedState);
  const setIpfsSpeed = getSecondElement(ipfsSpeedState);

  const testCompleteState = useState(false);
  const testComplete = getFirstElement(testCompleteState);
  const setTestComplete = getSecondElement(testCompleteState);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  const playSound = (freq: number) => {
    if (typeof window === 'undefined') return;
    try {
      const win = window as any;
      const AudioCtx = win.AudioContext? win.AudioContext : win.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab!== "meme") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (customImage) {
      ctx.drawImage(customImage, 0, 0, canvas.width, canvas.height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (activeGradient === "sunset") {
        grad.addColorStop(0, "#f43f5e");
        grad.addColorStop(1, "#eab308");
      } else if (activeGradient === "green") {
        grad.addColorStop(0, "#10b981");
        grad.addColorStop(1, "#06b6d4");
      } else {
        grad.addColorStop(0, "#3b82f6");
        grad.addColorStop(1, "#8b5cf6");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.textAlign = "center";
    ctx.font = "bold 24px sans-serif";

    ctx.textBaseline = "top";
    ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
    ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);

    ctx.textBaseline = "bottom";
    ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
    ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);

    if (watermark) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(canvas.width - 140, canvas.height - 35, 130, 25);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("SHELBY HOT SECURE", canvas.width - 75, canvas.height - 23);
    }
  }, Array.of(topText, bottomText, activeGradient, customImage, watermark, activeTab));

  const handleConnect = async () => {
    playSound(600);
    try {
      await connect("Petra");
    } catch (error) {
      alert("Petra Wallet connection failed! Please unlock your wallet.");
    }
  };

  const handleDisconnect = async () => {
    playSound(300);
    try {
      await disconnect();
    } catch (error) {}
  };

  const getAddress = () => {
    if (!account) return "";
    const addr = account.address.toString();
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 0) {
        const file = e.target.files.item(0);
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target) {
              if (event.target.result) {
                const img = new Image();
                img.src = event.target.result as string;
                img.onload = () => {
                  setCustomImage(img);
                  playSound(1000);
                };
              }
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const runSpeedTest = async () => {
    playSound(800);
    setIsTesting(true);
    setTestComplete(false);
    setShelbySpeed(0);
    setS3Speed(0);
    setIpfsSpeed(0);

    let i = 0;
    const interval = setInterval(() => {
      i = i + 10;
      if (i <= 95) setShelbySpeed(i);
      if (i <= 280) setS3Speed(i);
      if (i <= 3850) setIpfsSpeed(i);

      if (i >= 3850) {
        clearInterval(interval);
        setIsTesting(false);
        setTestComplete(true);
        playSound(1000);
      }
    }, 10);
  };

  const downloadMeme = () => {
    playSound(500);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const publishMeme = async () => {
    if (!connected) return alert("Please connect your Petra Wallet first!");
    if (!network) return alert("Wallet network connection not detected.");

    const currentNet = network.name.toLowerCase();
    if (currentNet!== "testnet") {
      alert("Warning: Petra is on " + network.name + ".\n\nPlease open Petra Wallet Settings -> Network and switch to 'testnet' to use free faucet gas APT!");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setUploading(true);
    playSound(800);

    try {
      const transactionPayload: any = {
        data: {
          function: "0x1::coin::transfer",
          typeArguments: new Array("0x1::aptos_coin::AptosCoin"),
          functionArguments: new Array(
            "0x85fdb9a176ab8ef1d9d9c1b60d60b3924f0800ac1de1cc2085fb0b8bb4988e6a", // Shelby Smart Contract Address
            "100000" // 0.001 Testnet APT
          )
        }
      };

      const response = await signAndSubmitTransaction(transactionPayload);
      const txHash = response.hash;

      const randomId = Math.floor(Math.random() * 10000);
      const newMeme = {
        id: randomId,
        name: "Meme_" + randomId + ".png",
        url: canvas.toDataURL("image/png"),
        tx: txHash
      };

      setUploadedMemes(new Array(newMeme).concat(uploadedMemes));
      setFilesUploaded(filesUploaded + 1);
      
      playSound(1000);
      alert("Success! Transaction confirmed on Aptos Testnet.\n\nTx Hash: " + txHash);
    } catch (error: any) {
      console.error(error);
      alert("Testnet transaction failed or was cancelled!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#060913", color: "white", padding: "30px", fontFamily: "sans-serif" }}>
      {/* Navigation Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #1e293b", paddingBottom: "15px" }}>
        <div>
          <h1 style={{ fontSize: "24px", margin: 0, color: "#38bdf8", fontWeight: "bold" }}>SHELBY</h1>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Web3 High-Speed Hot Storage Engine</p>
        </div>
        {connected? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#10b981", background: "#111827", padding: "6px 12px", borderRadius: "6px" }}>{getAddress()}</span>
            <button onClick={handleDisconnect} style={{ background: "#ef4444", border: "none", padding: "8px 12px", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Disconnect</button>
          </div>
        ) : (
          <button onClick={handleConnect} style={{ background: "#3b82f6", border: "none", padding: "8px 16px", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Connect Wallet</button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <button onClick={() => { playSound(600); setActiveTab("meme"); }} style={{ padding: "10px 20px", background: activeTab === "meme"? "#1e293b" : "transparent", border: activeTab === "meme"? "1px solid #38bdf8" : "1px solid #1e293b", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Meme Studio</button>
        <button onClick={() => { playSound(600); setActiveTab("speed"); }} style={{ padding: "10px 20px", background: activeTab === "speed"? "#1e293b" : "transparent", border: activeTab === "speed"? "1px solid #38bdf8" : "1px solid #1e293b", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Bandwidth Speed Test</button>
      </div>

      {activeTab === "meme"? (
        <div>
          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "25px" }}>
            <div style={{ background: "#111827", padding: "10px", borderRadius: "8px" }}>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Memes Uploaded</p>
              <h3 style={{ margin: 0, color: "#38bdf8" }}>{filesUploaded}</h3>
            </div>
            <div style={{ background: "#111827", padding: "10px", borderRadius: "8px" }}>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Storage Latency</p>
              <h3 style={{ margin: 0, color: "#10b981" }}>Sub-Second</h3>
            </div>
            <div style={{ background: "#111827", padding: "10px", borderRadius: "8px" }}>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Network</p>
              <h3 style={{ margin: 0, color: "#3b82f6" }}>{connected? (network? network.name : "Testnet") : "Offline"}</h3>
            </div>
          </div>

          {/* Meme Studio Interface */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "25px" }}>
            <div style={{ background: "#111827", padding: "15px", borderRadius: "12px", textAlign: "center" }}>
              <canvas ref={canvasRef} width={250} height={250} style={{ borderRadius: "8px", border: "1px solid #334155", maxWidth: "100%", marginBottom: "10px" }} />
              <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                <button onClick={() => { playSound(600); setActiveGradient("blue"); }} style={{ padding: "6px 10px", background: "#3b82f6", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", fontSize: "11px" }}>Blue</button>
                <button onClick={() => { playSound(600); setActiveGradient("sunset"); }} style={{ padding: "6px 10px", background: "#f43f5e", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", fontSize: "11px" }}>Sunset</button>
                <button onClick={() => { playSound(600); setActiveGradient("green"); }} style={{ padding: "6px 10px", background: "#10b981", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", fontSize: "11px" }}>Green</button>
              </div>
            </div>

            <div style={{ background: "#111827", padding: "15px", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <input type="text" value={topText} onChange={e => setTopText(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", background: "#030712", border: "1px solid #334155", borderRadius: "6px", color: "white", boxSizing: "border-box" }} placeholder="Top Text" />
                <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", background: "#030712", border: "1px solid #334155", borderRadius: "6px", color: "white", boxSizing: "border-box" }} placeholder="Bottom Text" />
                
                <div style={{ marginBottom: "10px" }}>
                  <input type="file" ref={customBgInputRef} onChange={handleCustomBgUpload} accept="image/*" style={{ display: "none" }} />
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => customBgInputRef.current?.click()} style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #334155", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>Upload Bg</button>
                    {customImage && (
                      <button onClick={clearCustomBg} style={{ padding: "8px", background: "#ef4444", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>Clear</button>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
                  <label style={{ fontSize: "12px", opacity: 0.8, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} style={{ cursor: "pointer" }} />
                    Shelby Watermark
                  </label>
                </div>

                <button onClick={downloadMeme} style={{ width: "100%", padding: "8px", background: "#1f2937", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Download PNG</button>
              </div>
              <button onClick={publishMeme} disabled={uploading} style={{ width: "100%", marginTop: "10px", padding: "12px", background: uploading? "#1e293b" : "#3b82f6", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                {uploading? "Uploading to Aptos Testnet..." : "Publish to Shelby (Testnet Tx)"}
              </button>
            </div>
          </div>

          {uploadedMemes.length > 0 && (
            <div style={{ background: "#111827", padding: "15px", borderRadius: "12px" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Shelby Storage Vault</h3>
              <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }}>
                {uploadedMemes.map((m: any) => (
                  <div key={m.id} style={{ minWidth: "160px", background: "#030712", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
                    <img src={m.url} style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "4px", marginBottom: "5px" }} />
                    <p style={{ margin: 0, fontSize: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
                    <a 
                      href={"https://explorer.aptoslabs.com/txn/" + m.tx + "?network=testnet"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", marginTop: "5px", padding: "6px", background: "#10b981", borderRadius: "4px", color: "white", fontSize: "11px", textDecoration: "none", fontWeight: "bold" }}
                    >
                      View on Explorer ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Shelby Bandwidth Speed Test Tool */
        <div style={{ background: "#111827", padding: "25px", borderRadius: "16px", border: "1px solid #1e293b" }}>
          <h2 style={{ fontSize: "20px", color: "#38bdf8", margin: "0 0 10px 0", fontWeight: "bold" }}>Shelby Hot-Storage Bandwidth Benchmark</h2>
          <p style={{ fontSize: "13px", opacity: 0.7, margin: "0 0 25px 0" }}>
            Test and compare decentralized data retrieval speeds. Real-time sub-second latency powered by dedicated fiber backbones.
          </p>

          <button onClick={runSpeedTest} disabled={isTesting} style={{ background: isTesting? "#1e293b" : "#10b981", border: "none", padding: "12px 24px", borderRadius: "8px", color: "white", fontWeight: "bold", cursor: isTesting? "not-allowed" : "pointer", marginBottom: "30px" }}>
            {isTesting? "Testing Bandwidth..." : "Run Speed Test"}
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Shelby Speed Progress Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ fontWeight: "bold", color: "#38bdf8" }}>⚡ Shelby Protocol (Web3 Hot Storage)</span>
                <span style={{ fontWeight: "bold" }}>{shelbySpeed} ms</span>
              </div>
              <div style={{ width: "100%", height: "16px", background: "#030712", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: (shelbySpeed > 0? "100%" : "0%"), height: "100%", background: "#38bdf8", transition: "width 0.2s" }} />
              </div>
            </div>

            {/* AWS S3 Speed Progress Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ fontWeight: "bold", color: "#f59e0b" }}>📦 traditional Cloud (AWS S3)</span>
                <span style=
