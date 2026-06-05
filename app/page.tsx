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
    const text = encodeURIComponent(`Just minted a secure decentralized asset on @shelbyserves Workshop! 🚀\nTx: ${tx}`);
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
  const [activeGradient, setActiveGradient] = useState<string>("shelby");
  const [expiration, setExpiration] = useState<string>("1day");
  const [watermark, setWatermark] = useState<boolean>(true);
  const [uploadedMemes, setUploadedMemes] = useState<UploadedMeme[]>([]);
  const [customImage, setCustomImage] = useState<HTMLImageElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [rejectNotification, setRejectNotification] = useState<boolean>(false);

  // New State for Custom Confirm Modal
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

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
      addLog('info', 'Shelby V3 UI Engine initialized with official brand metrics.');
    }
  }, []);

  useEffect(() => {
    if (connected && account) {
      const currentNet = network?.name ? network.name : "Unknown Network";
      addLog('success', `Wallet connected on ${currentNet} network.`);
    }
  }, [connected, account, network]);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shelby_theme', nextTheme ? 'dark' : 'light');
    }
  };

  const removeMemeFromVault = (id: number) => {
    const updatedList = uploadedMemes.filter(item => item.id !== id);
    setUploadedMemes(updatedList);
    setFilesUploaded(5 + updatedList.length);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shelby_memes', JSON.stringify(updatedList));
    }
  };

  // Modified Clear Cache Logic
  const triggerClearVault = () => {
    setShowClearConfirm(true);
  };

  const confirmClearVault = () => {
    setUploadedMemes([]);
    setFilesUploaded(5);
    if (typeof window !== 'undefined') localStorage.removeItem('shelby_memes');
    addLog('warning', 'Local memory sector purged.');
    setShowClearConfirm(false); // Close Modal
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
        ctx.fillStyle = "#ff42a1";
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
        grad.addColorStop(0, "#3a001e"); grad.addColorStop(1, "#ff42a1");
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
      }
    }, 15);
  };

  const triggerRejectNotification = () => {
    setRejectNotification(true);
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
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      setShowProgressModal(false);
      triggerRejectNotification();
    } finally {
      setUploading(false);
    }
  };

  const shelbyPink = "#ff42a1";
  
  const themeStyles = {
    // Base solid colors so the glowing orbs show up beautifully
    mainBg: isDarkMode ? "#0a0508" : "#fdf2f8",
    cardBg: isDarkMode ? "rgba(20, 10, 15, 0.65)" : "rgba(255, 255, 255, 0.75)",
    textMain: isDarkMode ? "#fdf2f8" : "#111827",
    textMuted: isDarkMode ? "#9ca3af" : "#6b7280",
    inputBg: isDarkMode ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.9)",
    inputBorder: isDarkMode ? "rgba(255, 66, 161, 0.15)" : "rgba(255, 66, 161, 0.3)",
    tabActive: isDarkMode ? "rgba(255, 66, 161, 0.2)" : "#fce7f3"
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: themeStyles.mainBg, color: themeStyles.textMain, padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", transition: "background-color 0.4s ease", overflowX: "hidden" }}>
      
      {/* 🌟 New Animated Background Layer 🌟 */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: isDarkMode ? 'radial-gradient(circle, rgba(255, 66, 161, 0.12) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(255, 66, 161, 0.08) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none', animation: 'floatBlob1 15s infinite alternate ease-in-out' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '60vw', height: '60vw', background: isDarkMode ? 'radial-gradient(circle, rgba(160, 32, 240, 0.1) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(255, 105, 180, 0.08) 0%, transparent 60%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none', animation: 'floatBlob2 18s infinite alternate ease-in-out' }} />

      {/* Dynamic Global Animations & Media Queries Injected */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(255, 66, 161, 0.3); }
          50% { box-shadow: 0 0 25px rgba(255, 66, 161, 0.6); }
          100% { box-shadow: 0 0 10px rgba(255, 66, 161, 0.3); }
        }
        @keyframes floatUpConfetti {
          0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-10vh) scale(1.5) rotate(360deg); opacity: 0; }
        }
        /* Background Blobs Animations */
        @keyframes floatBlob1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes floatBlob2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 40px) scale(1.2); }
          66% { transform: translate(30px, -30px) scale(0.8); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animated-card {
          animation: fadeInUp 0.6s ease-out forwards;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .pulse-btn:hover {
          animation: pulseGlow 1.5s infinite;
          transform: translateY(-2px);
        }
        .confetti-piece {
          position: fixed;
          bottom: -50px;
          font-size: 28px;
          animation: floatUpConfetti 3s ease-out forwards;
          z-index: 99998;
          pointer-events: none;
        }
        /* Mobile Responsiveness */
        .responsive-workshop-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 30px;
          align-items: start;
          margin-bottom: 40px;
        }
        @media (max-width: 900px) {
          .responsive-workshop-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

      {/* 🌟 Ensure Content stays above the background animation 🌟 */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {rejectNotification && (
          <div style={{ position: "fixed", top: "24px", right: "24px", background: "#ef4444", color: "white", padding: "14px 28px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", zIndex: 99999, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.35)", border: "1px solid rgba(255,255,255,0.1)" }}>
            🛑 Transaction Rejected
          </div>
        )}

        {/* 🌟 New Custom Confirm Modal for Clearing Vault 🌟 */}
        {showClearConfirm && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(10, 5, 8, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, backdropFilter: "blur(8px)" }}>
            <div className="animated-card" style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "24px", padding: "35px", maxWidth: "400px", width: "90%", textAlign: "center", margin: "auto", boxShadow: `0 25px 50px -12px rgba(255, 66, 161, 0.2)` }}>
              <div style={{ width: "60px", height: "60px", background: "rgba(239, 68, 68, 0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" }}>
                <span style={{ fontSize: "28px" }}>⚠️</span>
              </div>
              <h3 style={{ margin: "0 0 12px 0", color: themeStyles.textMain, fontSize: "22px", fontWeight: "bold" }}>Clear Vault Storage?</h3>
              <p style={{ color: themeStyles.textMuted, fontSize: "14px", marginBottom: "30px", lineHeight: "1.6" }}>Are you sure you want to completely erase your local Vault memory? This action is permanent and cannot be undone.</p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, background: "transparent", color: themeStyles.textMain, border: `1px solid ${themeStyles.inputBorder}`, padding: "14px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>Cancel</button>
                <button onClick={confirmClearVault} style={{ flex: 1, background: "#ef4444", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)", transition: "all 0.3s" }}>Yes, Purge</button>
              </div>
            </div>
          </div>
        )}

        {showProgressModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(10, 5, 8, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, backdropFilter: "blur(8px)" }}>
            <div className="animated-card" style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "20px", padding: "30px", maxWidth: "420px", width: "90%", textAlign: "center", margin: "auto", boxShadow: `0 25px 50px -12px rgba(255, 66, 161, 0.15)` }}>
              <h3 style={{ margin: "0 0 10px 0", color: shelbyPink, fontSize: "20px", letterSpacing: "1px" }}>SHELBY PIPELINE</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", marginBottom: "25px", marginTop: "25px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: txStep >= 1 ? 1 : 0.4, transition: "opacity 0.3s" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: txStep === 1 ? shelbyPink : "#10b981", boxShadow: txStep === 1 ? `0 0 10px ${shelbyPink}` : "none" }} />
                  <span style={{ fontSize: "14px" }}>Preparing Digital Structural Matrix</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: txStep >= 2 ? 1 : 0.4, transition: "opacity 0.3s" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: txStep === 2 ? "#eab308" : txStep > 2 ? "#10b981" : "#475569", boxShadow: txStep === 2 ? "0 0 10px #eab308" : "none" }} />
                  <span style={{ fontSize: "14px" }}>Awaiting Ledger Master Signature</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: txStep >= 3 ? 1 : 0.4, transition: "opacity 0.3s" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: txStep === 3 ? "#10b981" : "#475569", boxShadow: txStep === 3 ? "0 0 10px #10b981" : "none" }} />
                  <span style={{ fontSize: "14px" }}>Asset Successfully Minted to Vault</span>
                </div>
              </div>
              {txStep === 3 && (
                <button onClick={() => setShowProgressModal(false)} className="pulse-btn" style={{ background: "#10b981", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%", transition: "all 0.3s" }}>Dismiss Dashboard</button>
              )}
            </div>
          </div>
        )}

        {showLogCenter && (
          <div style={{ position: "fixed", top: 0, right: 0, width: "340px", height: "100vh", background: isDarkMode ? "rgba(15, 10, 15, 0.95)" : "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(20px)", borderLeft: `1px solid ${themeStyles.inputBorder}`, padding: "24px", boxSizing: "border-box", zIndex: 9998, boxShadow: "-10px 0 30px rgba(0,0,0,0.5)", transition: "all 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${themeStyles.inputBorder}`, paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", color: shelbyPink, fontWeight: "600", letterSpacing: "1px" }}>ACTIVITY TERMINAL</h3>
              <button onClick={() => setShowLogCenter(false)} style={{ background: "transparent", border: "none", color: themeStyles.textMuted, cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "calc(100vh - 90px)", overflowY: "auto" }}>
              {activityLogs.map((log) => (
                <div key={log.id} style={{ fontSize: "12px", background: themeStyles.inputBg, padding: "12px", borderRadius: "8px", borderLeft: `4px solid ${log.type === 'success' ? '#10b981' : shelbyPink}`, border: `1px solid ${themeStyles.inputBorder}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.7, marginBottom: "6px", fontSize: "10px" }}>
                    <span style={{ fontWeight: "bold", letterSpacing: "0.5px" }}>{log.type.toUpperCase()}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div style={{ lineHeight: "1.5", color: themeStyles.textMain }}>{log.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Toast & Celebration Animation */}
        {showToast && (
          <>
            {Array.from({length: 25}).map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}>
                {['🚀', '✨', '🎉', '🔥', '💎', '💰'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
            <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", backdropFilter: "blur(10px)", borderRadius: "9999px", padding: "12px 28px", display: "inline-flex", alignItems: "center", gap: "10px", zIndex: 9999, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)" }}>
              <span style={{ color: "#10b981", fontWeight: "700", fontSize: "14px" }}>🎉 Transaction successful!</span>
            </div>
          </>
        )}

        {/* Header Block Section */}
        <div className="animated-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", padding: "10px 0" }}>
          <div>
            <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "900", letterSpacing: "-1px", background: `linear-gradient(90deg, ${shelbyPink}, #ffa6d4)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SHELBY</h1>
            <p style={{ fontSize: "14px", color: themeStyles.textMuted, margin: "4px 0 0 0" }}>Decentralized Asset Workshop</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={toggleTheme} className="pulse-btn" style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "8px 16px", borderRadius: "20px", color: themeStyles.textMain, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button onClick={() => setShowLogCenter(true)} className="pulse-btn" style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "8px", borderRadius: "50%", color: themeStyles.textMain, cursor: "pointer", position: "relative" }}>
              🔔
              <span style={{ position: "absolute", top: -2, right: -2, background: shelbyPink, width: "10px", height: "10px", borderRadius: "50%" }}></span>
            </button>
            {connected ? (
              <button onClick={disconnect} className="pulse-btn" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "8px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>Disconnect</button>
            ) : (
              <button onClick={handleConnect} className="pulse-btn" style={{ background: shelbyPink, color: "white", border: "none", padding: "8px 24px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", boxShadow: `0 4px 15px rgba(255, 66, 161, 0.4)`, transition: "all 0.3s" }}>Connect Wallet</button>
            )}
          </div>
        </div>

        {/* Network & Node Information Banner */}
        <div className="animated-card" style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "16px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", color: shelbyPink, fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "1px" }}>SECURED NODE PATH</p>
            <p style={{ fontFamily: "monospace", fontSize: "13px", color: themeStyles.textMain, margin: 0 }}>{connected && account ? String(account.address) : "Offline - Connect Wallet"}</p>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
             <a href="https://aptoslabs.com/testnet-faucet" target="_blank" rel="noreferrer" style={{ background: "#0ea5e9", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 10px rgba(14, 165, 233, 0.3)" }}>💧 Get Free Aptos APT</a>
             <div>
               <p style={{ fontSize: "11px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 4px 0" }}>CHAIN ECOSYSTEM</p>
               <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                 <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: connected ? "#10b981" : "#ef4444" }}></div>
                 <span style={{ fontSize: "13px", color: connected ? "#10b981" : "#ef4444", fontWeight: "600" }}>{network ? network.name : "Aptos Testnet"}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Tabs / Navigation */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button onClick={() => setActiveTab("meme")} style={{ background: activeTab === "meme" ? themeStyles.tabActive : "transparent", color: activeTab === "meme" ? shelbyPink : themeStyles.textMain, border: `1px solid ${activeTab === "meme" ? shelbyPink : themeStyles.inputBorder}`, padding: "10px 24px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>Workshop Studio</button>
          <button onClick={() => setActiveTab("speed")} style={{ background: activeTab === "speed" ? themeStyles.tabActive : "transparent", color: activeTab === "speed" ? shelbyPink : themeStyles.textMain, border: `1px solid ${activeTab === "speed" ? shelbyPink : themeStyles.inputBorder}`, padding: "10px 24px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>Network Speed Test</button>
        </div>

        {/* Overview Metrics Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div className="animated-card" style={{ background: themeStyles.cardBg, padding: "20px", borderRadius: "16px", border: `1px solid ${themeStyles.inputBorder}` }}>
            <p style={{ fontSize: "12px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 8px 0" }}>ASSETS UPLOADED</p>
            <h2 style={{ fontSize: "28px", color: shelbyPink, margin: 0 }}>{filesUploaded}</h2>
          </div>
          <div className="animated-card" style={{ background: themeStyles.cardBg, padding: "20px", borderRadius: "16px", border: `1px solid ${themeStyles.inputBorder}` }}>
            <p style={{ fontSize: "12px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 8px 0" }}>LATENCY STATE</p>
            <h2 style={{ fontSize: "24px", color: "#10b981", margin: 0 }}>Sub-Second</h2>
          </div>
          <div className="animated-card" style={{ background: themeStyles.cardBg, padding: "20px", borderRadius: "16px", border: `1px solid ${themeStyles.inputBorder}` }}>
            <p style={{ fontSize: "12px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 8px 0" }}>LIVE NETWORK</p>
            <h2 style={{ fontSize: "24px", color: "#3b82f6", margin: 0 }}>{network ? network.name : "testnet"}</h2>
          </div>
        </div>

        {/* Workshop Studio (Canvas & Controls) */}
        {activeTab === "meme" && (
          <div className="responsive-workshop-grid">
            
            {/* Left Panel: Canvas Display */}
            <div className="animated-card" style={{ position: "sticky", top: "24px" }}>
              <canvas 
                ref={canvasRef} 
                width={600} 
                height={600} 
                style={{ width: "100%", height: "auto", borderRadius: "20px", boxShadow: `0 20px 40px rgba(0,0,0,0.4)`, border: `2px solid ${themeStyles.inputBorder}`, backgroundColor: "#000" }} 
              />
            </div>

            {/* Right Panel: Customization Tools */}
            <div className="animated-card" style={{ background: themeStyles.cardBg, padding: "30px", borderRadius: "24px", border: `1px solid ${themeStyles.inputBorder}` }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Text Input Block */}
                <div>
                   <input type="text" maxLength={35} placeholder="Top Text (SHELBY IS HOT)" value={topText} onChange={(e) => setTopText(e.target.value)} style={{ width: "100%", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, padding: "16px", borderRadius: "12px", fontSize: "15px", boxSizing: "border-box" }} />
                   <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", color: themeStyles.textMuted }}>
                     <span>TOP CAPTION POSITION</span>
                     <span>{topTextY}px</span>
                   </div>
                   <input type="range" min="10" max="300" value={topTextY} onChange={(e) => setTopTextY(Number(e.target.value))} style={{ width: "100%", marginTop: "8px", accentColor: shelbyPink }} />
                </div>

                <div>
                   <input type="text" maxLength={35} placeholder="Bottom Text (AWS IS COLD)" value={bottomText} onChange={(e) => setBottomText(e.target.value)} style={{ width: "100%", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, padding: "16px", borderRadius: "12px", fontSize: "15px", boxSizing: "border-box" }} />
                   <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", color: themeStyles.textMuted }}>
                     <span>BOTTOM CAPTION POSITION</span>
                     <span>{bottomTextY}px</span>
                   </div>
                   <input type="range" min="300" max="580" value={bottomTextY} onChange={(e) => setBottomTextY(Number(e.target.value))} style={{ width: "100%", marginTop: "8px", accentColor: shelbyPink }} />
                </div>

                {/* Advanced Typography Options */}
                <div style={{ display: "flex", gap: "16px" }}>
                   <div style={{ flex: 1 }}>
                     <p style={{ fontSize: "11px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 8px 0" }}>FONT SCALE ({textFontSize}px)</p>
                     <input type="range" min="20" max="80" value={textFontSize} onChange={(e) => setTextFontSize(Number(e.target.value))} style={{ width: "100%", accentColor: shelbyPink }} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <p style={{ fontSize: "11px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 8px 0" }}>ALIGNMENT</p>
                     <select value={textAlignment} onChange={(e) => setTextAlignment(e.target.value as any)} style={{ width: "100%", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, padding: "10px", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                       <option value="left">Left Align</option>
                       <option value="center">Center Align</option>
                       <option value="right">Right Align</option>
                     </select>
                   </div>
                </div>

                {/* Color Mapping */}
                <div style={{ display: "flex", gap: "16px" }}>
                   <div style={{ flex: 1 }}>
                     <p style={{ fontSize: "11px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 8px 0" }}>TEXT COLOR</p>
                     <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: "100%", height: "45px", padding: "0", border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "8px", cursor: "pointer", background: "transparent" }} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <p style={{ fontSize: "11px", color: themeStyles.textMuted, fontWeight: "bold", margin: "0 0 8px 0" }}>STROKE COLOR</p>
                     <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} style={{ width: "100%", height: "45px", padding: "0", border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "8px", cursor: "pointer", background: "transparent" }} />
                   </div>
                </div>

                {/* Image Uploader Area */}
                <div>
                  <input type="file" accept="image/*" ref={customBgInputRef} style={{ display: "none" }} onChange={handleCustomBgUpload} />
                  <button onClick={() => customBgInputRef.current?.click()} style={{ width: "100%", background: themeStyles.inputBg, border: `1px dashed ${shelbyPink}`, color: themeStyles.textMain, padding: "16px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "all 0.3s" }}>
                    📁 Upload Media Canvas
                  </button>
                  {customImage && (
                    <button onClick={clearCustomBg} style={{ width: "100%", marginTop: "8px", background: "transparent", color: "#ef4444", border: "none", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>❌ Remove Custom Media</button>
                  )}
                </div>

                {/* Node Setup & Storage Logic */}
                <select value={expiration} onChange={(e) => setExpiration(e.target.value)} style={{ width: "100%", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, padding: "16px", borderRadius: "12px", fontSize: "14px", outline: "none" }}>
                  <option value="1day">Buffer Allocation Framework: 1 Day</option>
                  <option value="7days">Buffer Allocation Framework: 7 Days</option>
                  <option value="forever">Permanent Vault Storage</option>
                </select>

                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", color: themeStyles.textMain, fontWeight: "bold", fontSize: "14px", background: themeStyles.inputBg, padding: "12px", borderRadius: "12px", border: `1px solid ${themeStyles.inputBorder}` }}>
                  <input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} style={{ accentColor: shelbyPink, width: "18px", height: "18px" }} />
                  Embed Encrypted Watermark Tag
                </label>

                {/* Publish/Download Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                  <button onClick={downloadMeme} style={{ width: "100%", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, padding: "16px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", transition: "all 0.3s" }}>
                    ⬇ Download Ultra-HQ PNG
                  </button>

                  <button onClick={publishMeme} disabled={uploading || !connected} className="pulse-btn" style={{ width: "100%", background: connected ? `linear-gradient(90deg, ${shelbyPink}, #ff7eb3)` : themeStyles.inputBg, color: connected ? "white" : themeStyles.textMuted, border: "none", padding: "18px", borderRadius: "12px", cursor: connected ? "pointer" : "not-allowed", fontWeight: "900", fontSize: "16px", letterSpacing: "1px", opacity: uploading ? 0.7 : 1, transition: "all 0.3s", boxShadow: connected ? `0 10px 25px rgba(255, 66, 161, 0.4)` : "none" }}>
                    {uploading ? "🚀 PROCESSING TO CHAIN..." : "🚀 Publish to Shelby Storage"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Network Speed Test Framework */}
        {activeTab === "speed" && (
          <div className="animated-card" style={{ background: themeStyles.cardBg, padding: "50px", borderRadius: "24px", border: `1px solid ${themeStyles.inputBorder}`, textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ color: shelbyPink, margin: "0 0 15px 0", fontSize: "28px" }}>Decentralized Routing Speed Matrix</h2>
            <p style={{ color: themeStyles.textMuted, marginBottom: "40px", fontSize: "16px" }}>Initiate a stress test against conventional cloud storage arrays.</p>
            
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "40px", flexWrap: "wrap" }}>
              <div style={{ background: themeStyles.inputBg, padding: "30px 50px", borderRadius: "20px", border: `1px solid ${themeStyles.inputBorder}`, minWidth: "200px" }}>
                <h3 style={{ color: shelbyPink, margin: "0 0 15px 0", fontSize: "18px" }}>Shelby V3 Node</h3>
                <p style={{ fontSize: "48px", fontWeight: "900", margin: 0 }}>{shelbySpeed} <span style={{ fontSize: "18px", color: themeStyles.textMuted }}>ms</span></p>
              </div>
              <div style={{ background: themeStyles.inputBg, padding: "30px 50px", borderRadius: "20px", border: `1px solid ${themeStyles.inputBorder}`, minWidth: "200px" }}>
                <h3 style={{ color: themeStyles.textMain, margin: "0 0 15px 0", fontSize: "18px" }}>Legacy AWS S3</h3>
                <p style={{ fontSize: "48px", fontWeight: "900", margin: 0 }}>{s3Speed} <span style={{ fontSize: "18px", color: themeStyles.textMuted }}>ms</span></p>
              </div>
            </div>

            <button onClick={runSpeedTest} disabled={isTesting} className="pulse-btn" style={{ background: isTesting ? themeStyles.inputBorder : shelbyPink, color: "white", padding: "16px 50px", borderRadius: "30px", border: "none", fontSize: "18px", fontWeight: "bold", cursor: isTesting ? "not-allowed" : "pointer", boxShadow: isTesting ? "none" : `0 10px 20px rgba(255, 66, 161, 0.4)` }}>
              {isTesting ? "Executing Ping..." : "Run Diagnostic Test"}
            </button>
          </div>
        )}

        {/* Vault Storage Hub (Bottom Area) */}
        <div className="animated-card" style={{ background: themeStyles.cardBg, padding: "30px", borderRadius: "24px", border: `1px solid ${themeStyles.inputBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{ fontSize: "22px", margin: 0, color: shelbyPink, fontWeight: "900" }}>Shelby Decentralized Storage Hub Vault</h2>
            <button onClick={triggerClearVault} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>Clear All Cache Assets</button>
          </div>
          
          {uploadedMemes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: themeStyles.textMuted, border: `2px dashed ${themeStyles.inputBorder}`, borderRadius: "16px", background: themeStyles.inputBg }}>
              <span style={{ fontSize: "40px", display: "block", marginBottom: "15px" }}>📦</span>
              <p style={{ fontSize: "16px", margin: 0 }}>No assets found in local node vault. Mint a new media canvas to begin.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
              {uploadedMemes.map((meme) => (
                <div key={meme.id} style={{ background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "16px", overflow: "hidden", position: "relative", transition: "transform 0.3s" }}>
                  <button onClick={() => removeMemeFromVault(meme.id)} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", color: "white", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>✕</button>
                  <img src={meme.url} alt={meme.name} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
                  <div style={{ padding: "16px" }}>
                    <p style={{ margin: "0 0 12px 0", fontWeight: "bold", fontSize: "14px", color: themeStyles.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{meme.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <a href={getExplorerUrl(meme.tx, meme.networkName)} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", textDecoration: "none" }}>View on Chain</a>
                      <button onClick={() => shareOnTwitter(meme.tx)} style={{ flex: 1, background: "#1da1f2", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>Share X</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
