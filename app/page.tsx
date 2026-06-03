"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";

const EMPTY_DEPS: any = new Array();

// Safe helper functions to extract array values without using any square brackets
const getFirstElement = (array: any): any => {
  return array.slice(0, 1).pop();
};

const getSecondElement = (array: any): any => {
  return array.slice(1, 2).pop();
};

function DashboardContent() {
  const { connect, disconnect, connected, account, network } = useWallet();

  const filesUploadedState = useState(2);
  const filesUploaded = getFirstElement(filesUploadedState);
  const setFilesUploaded = getSecondElement(filesUploadedState);

  const uploadingState = useState(false);
  const uploading = getFirstElement(uploadingState);
  const setUploading = getSecondElement(uploadingState);

  const topTextState = useState("SHELBY IS HOT");
  const topText = getFirstElement(topTextState);
  const setTopText = getSecondElement(topTextState);

  const bottomTextState = useState("AWS IS COLD");
  const bottomText = getFirstElement(bottomTextState);
  const setBottomText = getSecondElement(bottomTextState);

  const activeGradientState = useState("blue");
  const activeGradient = getFirstElement(activeGradientState);
  const setActiveGradient = getSecondElement(activeGradientState);

  const uploadedMemesState = useState<any>(new Array());
  const uploadedMemes = getFirstElement(uploadedMemesState);
  const setUploadedMemes = getSecondElement(uploadedMemesState);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web Audio API Synthesizer for premium click & success sounds
  const playSound = (freq: number) => {
    if (typeof window === 'undefined') return;
    try {
      const win = window as any;
      const AudioCtx = win.AudioContext || win.webkitAudioContext;
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

  // Draw gradient background and meme captions on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  }, EMPTY_DEPS);

  const handleConnect = async () => {
    playSound(600);
    try {
      await connect("Petra");
    } catch (error) {
      console.error(error);
      alert("Petra Wallet connection failed! Please unlock your wallet first.");
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

  const publishMeme = async () => {
    if (!connected) return alert("Please connect your Petra Wallet first!");
    const canvas = canvasRef.current;
    if (!canvas) return;

    setUploading(true);
    playSound(800);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newMeme = {
      id: Math.random(),
      name: "Meme_" + Math.floor(Math.random() * 1000) + ".png",
      url: canvas.toDataURL("image/png")
    };

    setUploadedMemes(new Array(newMeme).concat(uploadedMemes));
    setFilesUploaded(filesUploaded + 1);
    setUploading(false);
    playSound(1000);
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

  return (
    <main style={{ minHeight: "100vh", background: "#0a0f24", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", margin: 0, color: "#38bdf8" }}>SHELBY</h1>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Meme & Storage Hub</p>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        <div style={{ background: "#111827", padding: "10px", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Memes Uploaded</p>
          <h3 style={{ margin: 0, color: "#38bdf8" }}>{filesUploaded}</h3>
        </div>
        <div style={{ background: "#111827", padding: "10px", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Speed</p>
          <h3 style={{ margin: 0, color: "#10b981" }}>Sub-Second</h3>
        </div>
        <div style={{ background: "#111827", padding: "10px", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>Network</p>
          <h3 style={{ margin: 0, color: "#3b82f6" }}>{connected? "Mainnet" : "Offline"}</h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "20px" }}>
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
            <button onClick={downloadMeme} style={{ width: "100%", padding: "8px", background: "#1f2937", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Download PNG</button>
          </div>
          <button onClick={publishMeme} disabled={uploading} style={{ width: "100%", marginTop: "10px", padding: "12px", background: uploading? "#1e293b" : "#3b82f6", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "bold" }}>
            {uploading? "Uploading..." : "Publish to Shelby"}
          </button>
        </div>
      </div>

      {uploadedMemes.length > 0 && (
        <div style={{ background: "#111827", padding: "15px", borderRadius: "12px" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Shelby Storage Vault</h3>
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }}>
            {uploadedMemes.map((m: any) => (
              <div key={m.id} style={{ minWidth: "100px", background: "#030712", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
                <img src={m.url} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", marginBottom: "5px" }} />
                <p style={{ margin: 0, fontSize: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      <DashboardContent />
    </AptosWalletAdapterProvider>
  );
                     }
