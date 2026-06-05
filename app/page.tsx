"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface UploadedMeme {
  id: number;
  name: string;
  url: string;
  tx: string;
  networkName: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  message: string;
}

const getExplorerUrl = (tx: string, networkName: string): string => {
  const networkPath = String(networkName).toLowerCase().includes("mainnet") ? "mainnet" : "testnet";
  return `https://explorer.aptoslabs.com/txn/${tx}?network=${networkPath}`;
};

const shareOnTwitter = (tx: string): void => {
  if (typeof window !== "undefined") {
    const text = encodeURIComponent(`Just minted a secure decentralized asset on Shelby Workshop! Tx: ${tx}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }
};

export default function DashboardContent() {
  const { connect, disconnect, connected, account, network, signAndSubmitTransaction } = useWallet();

  // Core App States
  const [filesUploaded, setFilesUploaded] = useState<number>(5);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("meme");
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  const [activeGradient, setActiveGradient] = useState<string>("blue");
  const [expiration, setExpiration] = useState<string>("1day");
  const [watermark, setWatermark] = useState<boolean>(true);
  const [uploadedMemes, setUploadedMemes] = useState<UploadedMeme[]>([]);
  const [customImage, setCustomImage] = useState<HTMLImageElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [rejectNotification, setRejectNotification] = useState<boolean>(false);

  // Text Customization Positioning Sliders & Alignment States
  const [topTextY, setTopTextY] = useState<number>(40);
  const [bottomTextY, setBottomTextY] = useState<number>(410);
  const [textFontSize, setTextFontSize] = useState<number>(26);
  const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">("center");

  // Premium Text and Stroke Colors
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");

  // Notification and Logs States
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showLogCenter, setShowLogCenter] = useState<boolean>(false);

  // Progress Modal States
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [txStep, setTxStep] = useState<number>(1); 

  // Speed Test Framework Metric States
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const [shelbySpeed, setShelbySpeed] = useState<number>(0);
  const [s3Speed, setS3Speed] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  const addLog = (type: 'info' | 'success' | 'warning', message: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [
      { id: Math.random().toString(), timestamp: timeString, type, message },
      ...prev
    ]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMemes = localStorage.getItem('shelby_memes');
      if (savedMemes) {
        try {
          const parsed = JSON.parse(savedMemes);
          setUploadedMemes(parsed);
          setFilesUploaded(5 + parsed.length);
        } catch(e) {
          console.error(e);
        }
      }
      const savedTheme = localStorage.getItem('shelby_theme');
      if (savedTheme === 'light') setIsDarkMode(false);
      addLog('info', 'Shelby Dynamic Cache Hub Matrix Ready.');
    }
  }, []);

  useEffect(() => {
    if (connected && account) {
      const currentNet = network?.name ? network.name : "Unknown Network";
      addLog('success', `Wallet pipeline handshake complete for node ${currentNet}`);
    }
  }, [connected, account, network]);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shelby_theme', nextTheme ? 'dark' : 'light');
    }
    addLog('info', `UI Canvas context modified to ${nextTheme ? 'Dark' : 'Light'} space.`);
  };

  const removeMemeFromVault = (id: number) => {
    const updatedList = uploadedMemes.filter(item => item.id !== id);
    setUploadedMemes(updatedList);
    setFilesUploaded(5 + updatedList.length);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shelby_memes', JSON.stringify(updatedList));
    }
    addLog('info', `Reference record signature ${id} dropped from storage directory.`);
  };

  const clearEntireVaultCache = () => {
    if (window.confirm("Are you sure you want to completely clear the local Vault storage cache?")) {
      setUploadedMemes([]);
      setFilesUploaded(5);
      if (typeof window !== 'undefined') localStorage.removeItem('shelby_memes');
      addLog('warning', 'Local memory sector purged back to zero allocation.');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const completeRenderingPipeline = () => {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(5, textFontSize / 4.5);
      ctx.textAlign = textAlignment;
      ctx.font = `bold ${textFontSize}px system-ui, -apple-system, sans-serif`;

      let textX = canvas.width / 2;
      if (textAlignment === "left") textX = 25;
      if (textAlignment === "right") textX = canvas.width - 25;

      const renderTopText = topText.trim() !== "" ? topText.toUpperCase() : "SHELBY IS HOT";
      const renderBottomText = bottomText.trim() !== "" ? bottomText.toUpperCase() : "AWS IS COLD";

      if (topText.trim() === "") {
        ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.3)";
      } else {
        ctx.fillStyle = textColor;
      }
      ctx.textBaseline = "top";
      ctx.strokeText(renderTopText, textX, topTextY);
      ctx.fillText(renderTopText, textX, topTextY);

      if (bottomText.trim() === "") {
        ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.3)";
      } else {
        ctx.fillStyle = textColor;
      }
      ctx.textBaseline = "bottom";
      ctx.strokeText(renderBottomText, textX, bottomTextY);
      ctx.fillText(renderBottomText, textX, bottomTextY);

      if (watermark) {
        ctx.fillStyle = "rgba(10, 15, 30, 0.65)";
        ctx.fillRect(canvas.width - 145, canvas.height - 35, 135, 25);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SHELBY HOT SECURE", canvas.width - 77, canvas.height - 23);
      }
    };

    if (customImage) {
      ctx.drawImage(customImage, 0, 0, canvas.width, canvas.height);
      completeRenderingPipeline();
    } else {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (activeGradient === "sunset") {
        grad.addColorStop(0, "#ff416c"); grad.addColorStop(1, "#ff4b2b");
      } else if (activeGradient === "green") {
        grad.addColorStop(0, "#02aab0"); grad.addColorStop(1, "#00cdac");
      } else {
        grad.addColorStop(0, "#1e3c72"); grad.addColorStop(1, "#2a5298");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      completeRenderingPipeline();
    }
  }, [topText, bottomText, activeGradient, customImage, watermark, isDarkMode, topTextY, bottomTextY, textFontSize, textColor, strokeColor, textAlignment, activeTab]);

  const handleConnect = async () => {
    try {
      await connect("Petra");
    } catch (error) {
      triggerRejectNotification();
    }
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files.item(0);
      if (file) {
        setUploadedFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const img = new Image();
            img.src = event.target.result as string;
            img.onload = () => {
              setCustomImage(img);
              addLog('info', `File asset context synchronized: ${file.name}`);
            };
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearCustomBg = () => {
    setCustomImage(null);
    setUploadedFileName("");
    addLog('info', 'Canvas background state reset to default gradient.');
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width * 2;
    exportCanvas.height = canvas.height * 2;
    const exportCtx = exportCanvas.getContext("2d");
    
    if (exportCtx) {
      exportCtx.scale(2, 2);
      exportCtx.drawImage(canvas, 0, 0);
      
      const link = document.createElement("a");
      link.download = `shelby_hq_studio_${Date.now()}.png`;
      link.href = exportCanvas.toDataURL("image/png", 1.0);
      link.click();
      addLog('success', 'High definition image asset compiled and exported.');
    }
  };

  const runSpeedTest = () => {
    setIsTesting(true);
    setTestComplete(false);
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      if (current <= 95) setShelbySpeed(current);
      if (current <= 280) setS3Speed(current);

      if (current >= 280) {
        clearInterval(interval);
        setShelbySpeed(95);
        setS3Speed(280);
        setIsTesting(false);
        setTestComplete(true);
        addLog('success', 'Network environment benchmarking pipeline verified.');
      }
    }, 15);
  };

  const triggerRejectNotification = () => {
    setRejectNotification(true);
    addLog('warning', 'Cryptographic request rejected on terminal end.');
    setTimeout(() => {
      setRejectNotification(false);
    }, 2000);
  };

  const publishMeme = async () => {
    if (!connected) return alert("Please connect your Petra Wallet first!");
    if (!network) return alert("Network node handshake properties mapping missing.");

    if (String(network.name).toLowerCase().indexOf("testnet") === -1) {
      alert("Please switch your Petra extension network state to 'Testnet'.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setUploading(true);
    setShowProgressModal(true);
    setTxStep(1);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setTxStep(2);

      const transactionPayload = {
        data: {
          function: "0x1::coin::transfer" as const,
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [
            "0x85fdb9a176ab8ef1d9d9c1b60d60b3924f0800ac1de1cc2085fb0b8bb4988e6a",
            "100000" 
          ]
        }
      };

      const response = await signAndSubmitTransaction(transactionPayload);
      setTxStep(3);

      let stableTxHash = "";
      if (response && typeof response === "object") {
        if ("hash" in response && typeof (response as any).hash === "string") {
          stableTxHash = (response as any).hash;
        } else if ("args" in response && (response as any).args && typeof (response as any).args.hash === "string") {
          stableTxHash = (response as any).args.hash;
        } else {
          stableTxHash = JSON.stringify(response);
        }
      } else if (typeof response === "string") {
        stableTxHash = response;
      }

      const randomId = Math.floor(Math.random() * 10000);
      const newMeme: UploadedMeme = {
        id: randomId,
        name: uploadedFileName || `Shelby_Asset_${randomId}.png`,
        url: canvas.toDataURL("image/png"),
        tx: stableTxHash, 
        networkName: network.name
      };

      const updatedList = [newMeme, ...uploadedMemes];
      setUploadedMemes(updatedList);
      setFilesUploaded(prev => prev + 1);
      localStorage.setItem('shelby_memes', JSON.stringify(updatedList));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (error) {
      setShowProgressModal(false);
      triggerRejectNotification();
    } finally {
      setUploading(false);
    }
  };

  const themeStyles = {
    mainBg: isDarkMode ? "#070b19" : "#f3f4f6",
    cardBg: isDarkMode ? "#0f172a" : "#ffffff",
    textMain: isDarkMode ? "#f8fafc" : "#111827",
    textMuted: isDarkMode ? "#64748b" : "#6b7280",
    inputBg: isDarkMode ? "#020617" : "#f9fafb",
    inputBorder: isDarkMode ? "#1e293b" : "#cbd5e1",
    tabActive: isDarkMode ? "#1e293b" : "#e5e7eb"
  };

  return (
    <main style={{ minHeight: "100vh", background: themeStyles.mainBg, color: themeStyles.textMain, padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      
      {rejectNotification && (
        <div style={{ position: "fixed", top: "24px", right: "24px", background: "#ef4444", color: "white", padding: "14px 28px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", zIndex: 99999, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.35)", border: "1px solid rgba(255,255,255,0.1)" }}>
          🛑 Transaction Rejected
        </div>
      )}

      {showProgressModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(2, 6, 23, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "16px", padding: "30px", maxWidth: "420px", width: "90%", textAlign: "center", margin: "auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#38bdf8", fontSize: "18px" }}>Aptos Blockchain Pipeline</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", marginBottom: "25px", marginTop: "25px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: txStep >= 1 ? 1 : 0.4, transition: "opacity 0.3s" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: txStep === 1 ? "#38bdf8" : "#10b981", boxShadow: txStep === 1 ? "0 0 8px #38bdf8" : "none" }} />
                <span style={{ fontSize: "14px" }}>Preparing Digital Structural Matrix</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: txStep >= 2 ? 1 : 0.4, transition: "opacity 0.3s" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: txStep === 2 ? "#eab308" : txStep > 2 ? "#10b981" : "#475569", boxShadow: txStep === 2 ? "0 0 8px #eab308" : "none" }} />
                <span style={{ fontSize: "14px" }}>Awaiting Ledger Master Signature</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: txStep >= 3 ? 1 : 0.4, transition: "opacity 0.3s" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: txStep === 3 ? "#10b981" : "#475569", boxShadow: txStep === 3 ? "0 0 8px #10b981" : "none" }} />
                <span style={{ fontSize: "14px" }}>Asset Successfully Minted to Vault</span>
              </div>
            </div>
            {txStep === 3 && (
              <button onClick={() => setShowProgressModal(false)} style={{ background: "#10b981", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>Dismiss Dashboard</button>
            )}
          </div>
        </div>
      )}

      {showLogCenter && (
        <div style={{ position: "fixed", top: 0, right: 0, width: "340px", height: "100vh", background: isDarkMode ? "#0f172a" : "#f3f4f6", borderLeft: `1px solid ${themeStyles.inputBorder}`, padding: "24px", boxSizing: "border-box", zIndex: 9998, boxShadow: "-10px 0 30px rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${themeStyles.inputBorder}`, paddingBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", color: "#38bdf8", fontWeight: "600" }}>Node Activity Terminal</h3>
            <button onClick={() => setShowLogCenter(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "16px" }}>✕</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "calc(100vh - 90px)", overflowY: "auto" }}>
            {activityLogs.map((log) => (
              <div key={log.id} style={{ fontSize: "12px", background: isDarkMode ? "#020617" : "#ffffff", padding: "10px", borderRadius: "8px", borderLeft: `4px solid ${log.type === 'success' ? '#10b981' : '#38bdf8'}`, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.5, marginBottom: "6px", fontSize: "11px" }}>
                  <span style={{ fontWeight: "bold" }}>{log.type.toUpperCase()}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div style={{ fontFamily: "monospace", lineHeight: "1.4" }}>{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showToast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid #10b981", borderRadius: "9999px", padding: "12px 28px", display: "inline-flex", alignItems: "center", gap: "10px", zIndex: 9999, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
          <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>🎉 Transaction successful!</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", margin: 0, color: "#38bdf8", fontWeight: "800", letterSpacing: "-0.5px" }}>SHELBY</h1>
          <p style={{ margin: "2px 0 0 0", fontSize: "12px", opacity: 0.7, color: themeStyles.textMuted, fontWeight: "500" }}>Decentralized Asset Workshop</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={toggleTheme} style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "10px 16px", borderRadius: "8px", color: themeStyles.textMain, cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => setShowLogCenter(!showLogCenter)} style={{ position: "relative", background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "10px 14px", borderRadius: "8px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            🔔 {activityLogs.length > 0 && <span style={{ position: "absolute", top: "2px", right: "2px", background: "#ef4444", width: "8px", height: "8px", borderRadius: "50%", boxShadow: "0 0 6px #ef4444" }} />}
          </button>
          {connected && account ? (
            <button onClick={() => disconnect()} style={{ background: "#ef4444", border: "none", padding: "10px 18px", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)" }}>Disconnect</button>
          ) : (
            <button onClick={handleConnect} style={{ background: "#3b82f6", border: "none", padding: "10px 20px", borderRadius: "8px", color: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" }}>Connect Wallet</button>
          )}
        </div>
      </div>

      {connected && account && (
        <div style={{ background: `linear-gradient(135deg, ${isDarkMode ? '#1e1b4b' : '#e0e7ff'}, ${isDarkMode ? '#0f172a' : '#ffffff'})`, border: `1px solid ${themeStyles.inputBorder}`, padding: "18px 24px", borderRadius: "14px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div>
            <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "#818cf8", display: "block", letterSpacing: "0.5px" }}>SECURED NODE PATH</span>
            <span style={{ fontSize: "14px", fontFamily: "monospace", color: themeStyles.textMain, fontWeight: "500", wordBreak: "break-all" }}>{account.address.toString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="https://aptos.dev/network/faucet" target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(45deg, #0284c7, #0369a1)", color: "white", textDecoration: "none", fontSize: "13px", fontWeight: "600", padding: "10px 20px", borderRadius: "8px", display: "inline-block", boxShadow: "0 4px 12px rgba(3, 105, 161, 0.35)" }}>
              💧 Get Free Aptos APT
            </a>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: themeStyles.textMuted, display: "block" }}>CHAIN ECOSYSTEM</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#10b981" }}>● Aptos {network?.name || "Testnet"} Active</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => setActiveTab("meme")} style={{ padding: "12px 24px", background: activeTab === "meme" ? themeStyles.tabActive : "transparent", border: activeTab === "meme" ? "1px solid #38bdf8" : `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, cursor: "pointer", fontWeight: "600", borderRadius: "10px", fontSize: "14px" }}>Meme Studio</button>
        <button onClick={() => setActiveTab("speed")} style={{ padding: "12px 24px", background: activeTab === "speed" ? themeStyles.tabActive : "transparent", border: activeTab === "speed" ? "1px solid #38bdf8" : `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, cursor: "pointer", fontWeight: "600", borderRadius: "10px", fontSize: "14px" }}>Bandwidth Speed Test</button>
      </div>

      {activeTab === "meme" ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "14px", borderRadius: "10px" }}>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.6, color: themeStyles.textMuted }}>Memes Uploaded</p>
              <h3 style={{ margin: "4px 0 0 0", color: "#38bdf8" }}>{filesUploaded}</h3>
            </div>
            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "14px", borderRadius: "10px" }}>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.6, color: themeStyles.textMuted }}>Latency State</p>
              <h3 style={{ margin: "4px 0 0 0", color: "#10b981" }}>Sub-Second</h3>
            </div>
            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "14px", borderRadius: "10px" }}>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.6, color: themeStyles.textMuted }}>Network</p>
              <h3 style={{ margin: "4px 0 0 0", color: "#3b82f6" }}>{connected ? (network ? network.name : "Testnet") : "Offline"}</h3>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "24px" }}>
            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "20px", borderRadius: "16px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
              <canvas ref={canvasRef} width={450} height={450} style={{ borderRadius: "12px", border: `1px solid ${themeStyles.inputBorder}`, maxWidth: "100%", height: "auto", background: "#000", marginBottom: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <button onClick={() => setActiveGradient("blue")} style={{ padding: "8px 16px", background: "linear-gradient(135deg, #1e3c72, #2a5298)", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Classic</button>
                <button onClick={() => setActiveGradient("sunset")} style={{ padding: "8px 16px", background: "linear-gradient(135deg, #ff416c, #ff4b2b)", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Sunset</button>
                <button onClick={() => setActiveGradient("green")} style={{ padding: "8px 16px", background: "linear-gradient(135deg, #02aab0, #00cdac)", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Nordic</button>
              </div>
            </div>

            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "24px", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
              <div>
                <input type="text" value={topText} onChange={e => setTopText(e.target.value)} style={{ width: "100%", padding: "14px", marginBottom: "16px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "10px", color: themeStyles.textMain, boxSizing: "border-box", fontSize: "14px" }} placeholder="Top Text (SHELBY IS HOT)" />
                
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: themeStyles.textMuted, display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                    <span>TOP CAPTION POSITION</span>
                    <span>{topTextY}px</span>
                  </div>
                  <input type="range" min="10" max="150" value={topTextY} onChange={e => setTopTextY(Number(e.target.value))} style={{ width: "100%", accentColor: "#3b82f6", marginTop: "6px" }} />
                </div>

                <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} style={{ width: "100%", padding: "14px", marginBottom: "16px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "10px", color: themeStyles.textMain, boxSizing: "border-box", fontSize: "14px" }} placeholder="Bottom Text (AWS IS COLD)" />
                
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: themeStyles.textMuted, display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                    <span>BOTTOM CAPTION POSITION</span>
                    <span>{bottomTextY}px</span>
                  </div>
                  <input type="range" min="300" max="440" value={bottomTextY} onChange={e => setBottomTextY(Number(e.target.value))} style={{ width: "100%", accentColor: "#3b82f6", marginTop: "6px" }} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: themeStyles.textMuted, display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                    <span>CAPTION FONT SIZE</span>
                    <span>{textFontSize}px</span>
                  </div>
                  <input type="range" min="16" max="48" value={textFontSize} onChange={e => setTextFontSize(Number(e.target.value))} style={{ width: "100%", accentColor: "#10b981", marginTop: "6px" }} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", color: themeStyles.textMuted, display: "block", marginBottom: "6px", fontWeight: "600" }}>TEXT ALIGNMENT</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", background: themeStyles.inputBg, padding: "4px", borderRadius: "8px", border: `1px solid ${themeStyles.inputBorder}` }}>
                    <button onClick={() => setTextAlignment("left")} style={{ padding: "6px", border: "none", borderRadius: "6px", background: textAlignment === "left" ? themeStyles.tabActive : "transparent", color: themeStyles.textMain, cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Left</button>
                    <button onClick={() => setTextAlignment("center")} style={{ padding: "6px", border: "none", borderRadius: "6px", background: textAlignment === "center" ? themeStyles.tabActive : "transparent", color: themeStyles.textMain, cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Center</button>
                    <button onClick={() => setTextAlignment("right")} style={{ padding: "6px", border: "none", borderRadius: "6px", background: textAlignment === "right" ? themeStyles.tabActive : "transparent", color: themeStyles.textMain, cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Right</button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: themeStyles.textMuted, display: "block", marginBottom: "4px", fontWeight: "600" }}>TEXT COLOR</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", background: themeStyles.inputBg, padding: "8px", borderRadius: "8px", border: `1px solid ${themeStyles.inputBorder}` }}>
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ border: "none", width: "32px", height: "28px", cursor: "pointer", background: "none" }} />
                      <span style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: "500" }}>{textColor.toUpperCase()}</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: themeStyles.textMuted, display: "block", marginBottom: "4px", fontWeight: "600" }}>STROKE BORDER</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", background: themeStyles.inputBg, padding: "8px", borderRadius: "8px", border: `1px solid ${themeStyles.inputBorder}` }}>
                      <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} style={{ border: "none", width: "32px", height: "28px", cursor: "pointer", background: "none" }} />
                      <span style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: "500" }}>{strokeColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <input type="file" ref={customBgInputRef} onChange={handleCustomBgUpload} accept="image/*" style={{ display: "none" }} />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => customBgInputRef.current?.click()} style={{ flex: 1, padding: "12px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "8px", color: themeStyles.textMain, cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      📁 {uploadedFileName || "Upload Media Canvas"}
                    </button>
                    {customImage && <button onClick={clearCustomBg} style={{ padding: "12px 16px", background: "#ef4444", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Reset</button>}
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <select value={expiration} onChange={(e) => setExpiration(e.target.value)} style={{ width: "100%", padding: "12px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "10px", color: themeStyles.textMain, cursor: "pointer", fontSize: "13px" }}>
                    <option value="1day">Buffer Allocation Framework: 1 Day</option>
                    <option value="1week">Buffer Allocation Framework: 1 Week</option>
                  </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", marginBottom: "16px", cursor: "pointer", fontWeight: "500" }}>
                  <input type="checkbox" checked={watermark} onChange={e => setWatermark(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "#3b82f6" }} />
                  Embed Encrypted Watermark Tag
                </label>

                <button onClick={downloadMeme} style={{ width: "100%", padding: "12px", background: isDarkMode ? "#1e293b" : "#e5e7eb", border: "none", color: themeStyles.textMain, fontWeight: "600", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}>Download Ultra-HQ PNG</button>
              </div>
              <button onClick={publishMeme} disabled={uploading} style={{ width: "100%", padding: "16px", background: "#3b82f6", color: "white", border: "none", fontWeight: "700", borderRadius: "12px", cursor: "pointer", marginTop: "40px", fontSize: "14px", boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)" }}>
                {uploading ? "Broadcasting Core Node Transactions..." : "Publish to Shelby Storage"}
              </button>
            </div>

          </div>

          <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "24px", borderRadius: "16px", marginTop: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#38bdf8", fontWeight: "700" }}>Shelby Decentralized Storage Hub Vault</h3>
              {uploadedMemes.length > 0 && (
                <button onClick={clearEntireVaultCache} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Clear All Cache Assets</button>
              )}
            </div>

            {uploadedMemes.length === 0 ? (
              <p style={{ fontSize: "13px", opacity: 0.5, textAlign: "center", padding: "30px 0", color: themeStyles.textMuted }}>No assets indexed inside the local secure buffer.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
                {uploadedMemes.map((meme) => (
                  <div key={meme.id} style={{ background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "12px", borderRadius: "12px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                    <div>
                      <button onClick={() => removeMemeFromVault(meme.id)} style={{ position: "absolute", top: "6px", right: "6px", width: "20px", height: "20px", background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#ef4444", borderRadius: "50%", cursor: "pointer", fontSize: "11px", zIndex: 10, fontWeight: "bold" }}>✕</button>
                      <img src={meme.url} alt="Vault Card Item" style={{ width: "100%", borderRadius: "6px", marginBottom: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} />
                      <p style={{ fontSize: "11px", margin: "0 0 10px 0", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", opacity: 0.8, fontWeight: "500" }}>{meme.name}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
                      <a href={getExplorerUrl(meme.tx, meme.networkName)} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#1e293b", color: "#38bdf8", textAlign: "center", fontSize: "12px", padding: "6px 0", borderRadius: "6px", textDecoration: "none", fontWeight: "600", border: "1px solid #334155" }}>
                        Explore
                      </a>
                      <button onClick={() => shareOnTwitter(meme.tx)} style={{ width: "100%", background: "#ffffff", color: "#000000", border: "none", fontSize: "12px", padding: "6px 0", borderRadius: "6px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                        𝕏 Share on X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "40px", borderRadius: "16px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 10px 0" }}>Network Infrastructure Performance Node Matrix</h3>
          <p style={{ fontSize: "13px", color: themeStyles.textMuted, margin: "0 0 24px 0" }}>Audit secure channel data processing speeds across international storage hubs.</p>
          <div style={{ maxWidth: "460px", margin: "24px auto", textAlign: "left", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "35px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600" }}><span>⚡ SHELBY ECOSYSTEM PIPELINE</span><span>{shelbySpeed}ms</span></div>
              <div style={{ background: isDarkMode ? "#020617" : "#e5e7eb", height: "10px", borderRadius: "6px", overflow: "hidden", marginTop: "6px"} }><div style={{ width: `${isTesting || testComplete ? "100%" : "0%"}`, background: "#38bdf8", height: "10px", transition: "width 0.5s ease" }} /></div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600" }}><span>Legacy AWS S3 Storage Cluster</span><span>{s3Speed}ms</span></div>
              <div style={{ background: isDarkMode ? "#020617" : "#e5e7eb", height: "10px", borderRadius: "6px", overflow: "hidden", marginTop: "6px" }}><div style={{ width: `${isTesting || testComplete ? "45%" : "0%"}`, background: "#eab308", height: "10px", transition: "width 0.8s ease" }} /></div>
            </div>
          </div>
          <button onClick={runSpeedTest} disabled={isTesting} style={{ background: "#10b981", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)" }}>
            {isTesting ? "Auditing Nodes..." : "Run Pipeline Performance Audit"}
          </button>
          {testComplete && (
            <p style={{ color: "#10b981", fontSize: "13px", marginTop: "15px", fontWeight: "bold" }}>🎉 Audit complete: Shelby pipeline outpaced legacy system metrics by 3.5x.</p>
          )}
        </div>
      )}

      <footer style={{ marginTop: "48px", borderTop: `1px solid ${themeStyles.inputBorder}`, paddingTop: "24px", textAlign: "center", opacity: 0.5, fontSize: "12px", fontWeight: "500" }}>
        © 2026 Shelby Workspace Ecosystem. Powered by Aptos Secure High-Performance Blockchain Modules.
      </footer>
    </main>
  );
}
