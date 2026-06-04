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

export default function DashboardContent() {
  const { connect, disconnect, connected, account, network, signAndSubmitTransaction } = useWallet();

  // Core States
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
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Text Positioning Sliders States
  const [topTextY, setTopTextY] = useState<number>(30);
  const [bottomTextY, setBottomTextY] = useState<number>(420);
  const [textFontSize, setTextFontSize] = useState<number>(24);

  // Notification and Logs States
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showLogCenter, setShowLogCenter] = useState<boolean>(false);

  // Progress Modal States
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [txStep, setTxStep] = useState<number>(1); 

  // Speed Test States
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const [shelbySpeed, setShelbySpeed] = useState<number>(0);
  const [s3Speed, setS3Speed] = useState<number>(0);
  const [ipfsSpeed, setIpfsSpeed] = useState<number>(0);

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
      addLog('info', 'Shelby Engine v2.1 Initialization Successful.');
    }
  }, []);

  useEffect(() => {
    if (connected && account) {
      const currentNet = network?.name ? network.name : "Unknown Network";
      addLog('success', `Wallet linked successfully on ${currentNet}`);
    }
  }, [connected, account, network]);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shelby_theme', nextTheme ? 'dark' : 'light');
    }
    addLog('info', `UI Context updated to ${nextTheme ? 'Dark' : 'Light'} Mode.`);
  };

  const removeMemeFromVault = (id: number) => {
    const updatedList = uploadedMemes.filter(item => item.id !== id);
    setUploadedMemes(updatedList);
    setFilesUploaded(5 + updatedList.length);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shelby_memes', JSON.stringify(updatedList));
    }
    addLog('info', `Flushed reference ID: [${id}] from asset list.`);
  };

  const clearEntireVaultCache = () => {
    if (window.confirm("Are you sure you want to completely clear the local Vault storage cache?")) {
      setUploadedMemes([]);
      setFilesUploaded(5);
      if (typeof window !== 'undefined') localStorage.removeItem('shelby_memes');
      addLog('warning', 'Vault cache storage initialized to factory state.');
    }
  };

  // High Resolution Canvas Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Layer
    if (customImage) {
      ctx.drawImage(customImage, 0, 0, canvas.width, canvas.height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (activeGradient === "sunset") {
        grad.addColorStop(0, "#f43f5e"); grad.addColorStop(1, "#eab308");
      } else if (activeGradient === "green") {
        grad.addColorStop(0, "#10b981"); grad.addColorStop(1, "#06b6d4");
      } else {
        grad.addColorStop(0, "#3b82f6"); grad.addColorStop(1, "#8b5cf6");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Text Font Configuration
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.max(4, textFontSize / 5);
    ctx.textAlign = "center";
    ctx.font = `bold ${textFontSize}px sans-serif`;

    const renderTopText = topText.trim() !== "" ? topText.toUpperCase() : "SHELBY IS HOT";
    const renderBottomText = bottomText.trim() !== "" ? bottomText.toUpperCase() : "AWS IS COLD";

    // Top text rendering with placeholder opacity handling
    if (topText.trim() === "") {
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.25)";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.textBaseline = "top";
    ctx.strokeText(renderTopText, canvas.width / 2, topTextY);
    ctx.fillText(renderTopText, canvas.width / 2, topTextY);

    // Bottom text rendering with placeholder opacity handling
    if (bottomText.trim() === "") {
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.25)";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.textBaseline = "bottom";
    ctx.strokeText(renderBottomText, canvas.width / 2, bottomTextY);
    ctx.fillText(renderBottomText, canvas.width / 2, bottomTextY);

    // Neon Secure Label Layer
    if (watermark) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(canvas.width - 140, canvas.height - 35, 130, 25);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 9px sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("SHELBY HOT SECURE", canvas.width - 75, canvas.height - 23);
    }
  }, [topText, bottomText, activeGradient, customImage, watermark, isDarkMode, topTextY, bottomTextY, textFontSize]);

  const handleConnect = async () => {
    try {
      await connect("Petra");
    } catch (error) {
      addLog('warning', 'Wallet connection flow closed or rejected.');
    }
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files.item(0);
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const img = new Image();
            img.src = event.target.result as string;
            img.onload = () => {
              setCustomImage(img);
              addLog('info', 'Custom background buffer loaded successfully.');
            };
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearCustomBg = () => {
    setCustomImage(null);
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
      link.download = `shelby_hq_meme_${Date.now()}.png`;
      link.href = exportCanvas.toDataURL("image/png", 1.0);
      link.click();
      addLog('success', 'High-Res Studio assets compiled and downloaded.');
    }
  };

  const runSpeedTest = () => {
    setIsTesting(true);
    setTestComplete(false);
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current <= 95) setShelbySpeed(current);
      if (current <= 280) setS3Speed(current);
      if (current <= 3850) setIpfsSpeed(current);

      if (current >= 3850) {
        clearInterval(interval);
        setIsTesting(false);
        setTestComplete(true);
        addLog('success', 'Network audit logs refreshed.');
      }
    }, 15);
  };

  const publishMeme = async () => {
    if (!connected) return alert("Please connect your Petra Wallet first!");
    if (!network) return alert("Network parameters missing.");

    if (String(network.name).toLowerCase().indexOf("testnet") === -1) {
      alert("Please toggle network configuration to 'Testnet' inside Petra extension.");
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

      const randomId = Math.floor(Math.random() * 10000);
      const newMeme: UploadedMeme = {
        id: randomId,
        name: `Shelby_Asset_${randomId}.png`,
        url: canvas.toDataURL("image/png"),
        tx: response.hash,
        networkName: network.name
      };

      const updatedList = [newMeme, ...uploadedMemes];
      setUploadedMemes(updatedList);
      setFilesUploaded(prev => prev + 1);
      localStorage.setItem('shelby_memes', JSON.stringify(updatedList));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (error) {
      alert("Transaction declined or rejected.");
      setShowProgressModal(false);
    } finally {
      setUploading(false);
    }
  };

  const themeStyles = {
    mainBg: isDarkMode ? "#0a0f24" : "#f8fafc",
    cardBg: isDarkMode ? "#111827" : "#ffffff",
    textMain: isDarkMode ? "#ffffff" : "#0f172a",
    textMuted: isDarkMode ? "#64748b" : "#475569",
    inputBg: isDarkMode ? "#030712" : "#f1f5f9",
    inputBorder: isDarkMode ? "#1e293b" : "#cbd5e1",
    tabActive: isDarkMode ? "#1e293b" : "#e2e8f0"
  };

  return (
    <main style={{ minHeight: "100vh", background: themeStyles.mainBg, color: themeStyles.textMain, padding: "20px", fontFamily: "sans-serif", position: "relative", transition: "all 0.3s ease" }}>
      
      {/* Dynamic Progress Modal */}
      {showProgressModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(3, 7, 18, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
          <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "12px", padding: "25px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#38bdf8" }}>Aptos Blockchain Pipeline</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left", marginBottom: "25px", marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", opacity: txStep >= 1 ? 1 : 0.4 }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: txStep === 1 ? "#38bdf8" : "#10b981" }} />
                <span>Preparing Digital Structural Matrix</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", opacity: txStep >= 2 ? 1 : 0.4 }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: txStep === 2 ? "#eab308" : txStep > 2 ? "#10b981" : "#334155" }} />
                <span>Awaiting Ledger Master Signature</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", opacity: txStep >= 3 ? 1 : 0.4 }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: txStep === 3 ? "#10b981" : "#334155" }} />
                <span>Asset Successfully Minted to Vault</span>
              </div>
            </div>
            {txStep === 3 && (
              <button onClick={() => setShowProgressModal(false)} style={{ background: "#10b981", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", width: "100%" }}>Dismiss Dashboard</button>
            )}
          </div>
        </div>
      )}

      {/* Terminal Drawer Component */}
      {showLogCenter && (
        <div style={{ position: "fixed", top: 0, right: 0, width: "320px", height: "100vh", background: isDarkMode ? "#0f172a" : "#f1f5f9", borderLeft: `1px solid ${themeStyles.inputBorder}`, padding: "20px", boxSizing: "border-box", zIndex: 9998, boxShadow: "-5px 0 25px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${themeStyles.inputBorder}`, paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", color: "#38bdf8" }}>Node Activity Terminal</h3>
            <button onClick={() => setShowLogCenter(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "calc(100vh - 80px)", overflowY: "auto" }}>
            {activityLogs.map((log) => (
              <div key={log.id} style={{ fontSize: "11px", background: isDarkMode ? "#030712" : "#ffffff", padding: "8px", borderRadius: "6px", borderLeft: `3px solid ${log.type === 'success' ? '#10b981' : '#38bdf8'}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.5, marginBottom: "4px" }}>
                  <span>{log.type.toUpperCase()}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "rgba(31, 41, 55, 0.95)", border: "1px solid #10b981", borderRadius: "9999px", padding: "10px 24px", display: "inline-flex", alignItems: "center", gap: "10px", zIndex: 9999 }}>
          <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>Transaction successful!</span>
        </div>
      )}

      {/* Navigation and Actions Row Container */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", margin: 0, color: "#38bdf8", fontWeight: "bold" }}>SHELBY</h1>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.6, color: themeStyles.textMuted }}>Decentralized Asset Workshop</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={toggleTheme} style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "8px 14px", borderRadius: "6px", color: themeStyles.textMain, cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={() => setShowLogCenter(!showLogCenter)} style={{ position: "relative", background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>
            🔔 {activityLogs.length > 0 && <span style={{ position: "absolute", top: "0", right: "0", background: "#ef4444", width: "6px", height: "6px", borderRadius: "50%" }} />}
          </button>
          {connected && account ? (
            <button onClick={() => disconnect()} style={{ background: "#ef4444", border: "none", padding: "8px 12px", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Disconnect Wallet</button>
          ) : (
            <button onClick={handleConnect} style={{ background: "#3b82f6", border: "none", padding: "8px 16px", borderRadius: "6px", color: "white", fontWeight: "bold", cursor: "pointer" }}>Connect Wallet</button>
          )}
        </div>
      </div>

      {/* Dynamic Wallet Profile Status Dashboard Component */}
      {connected && account && (
        <div style={{ background: `linear-gradient(135deg, ${isDarkMode ? '#1e1b4b' : '#e0e7ff'}, ${isDarkMode ? '#111827' : '#ffffff'})`, border: `1px solid ${themeStyles.inputBorder}`, padding: "15px 20px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "bold", color: "#818cf8", display: "block" }}>SECURED NODE PATH</span>
            <span style={{ fontSize: "14px", fontFamily: "monospace", color: themeStyles.textMain }}>{account.address.toString()}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: themeStyles.textMuted, display: "block" }}>CHAIN ECOSYSTEM</span>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#10b981" }}>● Aptos {network?.name || "Testnet"} Active</span>
          </div>
        </div>
      )}

      {/* Interface Context Tabs Row Control */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <button onClick={() => setActiveTab("meme")} style={{ padding: "10px 20px", background: activeTab === "meme" ? themeStyles.tabActive : "transparent", border: activeTab === "meme" ? "1px solid #38bdf8" : `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, cursor: "pointer", fontWeight: "bold", borderRadius: "8px" }}>Meme Studio</button>
        <button onClick={() => setActiveTab("speed")} style={{ padding: "10px 20px", background: activeTab === "speed" ? themeStyles.tabActive : "transparent", border: activeTab === "speed" ? "1px solid #38bdf8" : `1px solid ${themeStyles.inputBorder}`, color: themeStyles.textMain, cursor: "pointer", fontWeight: "bold", borderRadius: "8px" }}>Bandwidth Speed Test</button>
      </div>

      {activeTab === "meme" ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "20px" }}>
            
            {/* Left Box Canvas Frame */}
            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "15px", borderRadius: "12px", textAlign: "center" }}>
              <canvas ref={canvasRef} width={450} height={450} style={{ borderRadius: "8px", border: `1px solid ${themeStyles.inputBorder}`, maxWidth: "100%", height: "auto", background: "#000", marginBottom: "12px" }} />
              <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                <button onClick={() => setActiveGradient("blue")} style={{ padding: "6px 12px", background: "#3b82f6", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" }}>Classic</button>
                <button onClick={() => setActiveGradient("sunset")} style={{ padding: "6px 12px", background: "#f43f5e", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" }}>Sunset</button>
                <button onClick={() => setActiveGradient("green")} style={{ padding: "6px 12px", background: "#10b981", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" }}>Nordic</button>
              </div>
            </div>

            {/* Right Box Input Customizer Control Frame */}
            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <input type="text" value={topText} onChange={e => setTopText(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "8px", color: themeStyles.textMain, boxSizing: "border-box" }} placeholder="Top Text (SHELBY IS HOT)" />
                
                {/* Top Text Y Sliders Control */}
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "11px", color: themeStyles.textMuted, display: "flex", justifyContent: "space-between" }}>
                    <span>TOP CAPTION POSITION</span>
                    <span>{topTextY}px</span>
                  </div>
                  <input type="range" min="10" max="150" value={topTextY} onChange={e => setTopTextY(Number(e.target.value))} style={{ width: "100%", accentColor: "#3b82f6" }} />
                </div>

                <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "8px", color: themeStyles.textMain, boxSizing: "border-box" }} placeholder="Bottom Text (AWS IS COLD)" />
                
                {/* Bottom Text Y Sliders Control */}
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "11px", color: themeStyles.textMuted, display: "flex", justifyContent: "space-between" }}>
                    <span>BOTTOM CAPTION POSITION</span>
                    <span>{bottomTextY}px</span>
                  </div>
                  <input type="range" min="300" max="440" value={bottomTextY} onChange={e => setBottomTextY(Number(e.target.value))} style={{ width: "100%", accentColor: "#3b82f6" }} />
                </div>

                {/* Font Size Controller Slider */}
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "11px", color: themeStyles.textMuted, display: "flex", justifyContent: "space-between" }}>
                    <span>CAPTION FONT SIZE</span>
                    <span>{textFontSize}px</span>
                  </div>
                  <input type="range" min="16" max="48" value={textFontSize} onChange={e => setTextFontSize(Number(e.target.value))} style={{ width: "100%", accentColor: "#10b981" }} />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <input type="file" ref={customBgInputRef} onChange={handleCustomBgUpload} accept="image/*" style={{ display: "none" }} />
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => customBgInputRef.current?.click()} style={{ flex: 1, padding: "10px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "6px", color: themeStyles.textMain, cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>Upload Media Canvas</button>
                    {customImage && <button onClick={clearCustomBg} style={{ padding: "10px", background: "#ef4444", border: "none", color: "white", borderRadius: "6px", cursor: "pointer" }}>Reset</button>}
                  </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <select value={expiration} onChange={(e) => setExpiration(e.target.value)} style={{ width: "100%", padding: "10px", background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, borderRadius: "8px", color: themeStyles.textMain, cursor: "pointer" }}>
                    <option value="1day">Buffer Allocation Framework: 1 Day</option>
                    <option value="1week">Buffer Allocation Framework: 1 Week</option>
                  </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", marginBottom: "15px", cursor: "pointer" }}>
                  <input type="checkbox" checked={watermark} onChange={e => setWatermark(e.target.checked)} />
                  Embed Encrypted Watermark Tag
                </label>

                <button onClick={downloadMeme} style={{ width: "100%", padding: "10px", background: isDarkMode ? "#1f2937" : "#e2e8f0", border: "none", color: themeStyles.textMain, fontWeight: "bold", borderRadius: "8px", cursor: "pointer" }}>Download Ultra-HQ PNG</button>
              </div>
              <button onClick={publishMeme} disabled={uploading} style={{ width: "100%", padding: "14px", background: "#3b82f6", color: "white", border: "none", fontWeight: "bold", borderRadius: "8px", cursor: "pointer", marginTop: "15px" }}>
                {uploading ? "Broadcasting Core Node Transactions..." : "Publish to Shelby Storage"}
              </button>
            </div>

          </div>

          {/* Lower Vault Storage Section Component Module */}
          <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "20px", borderRadius: "12px", marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", color: "#38bdf8" }}>Shelby Decentralized Storage Hub Vault</h3>
              {uploadedMemes.length > 0 && (
                <button onClick={clearEntireVaultCache} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Clear All Cache Assets</button>
              )}
            </div>

            {uploadedMemes.length === 0 ? (
              <p style={{ fontSize: "12px", opacity: 0.5, textAlign: "center", padding: "20px 0" }}>No assets indexed inside the local secure buffer.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" }}>
                {uploadedMemes.map((meme) => (
                  <div key={meme.id} style={{ background: themeStyles.inputBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "8px", borderRadius: "8px", position: "relative" }}>
                    <button onClick={() => removeMemeFromVault(meme.id)} style={{ position: "absolute", top: "5px", right: "5px", width: "18px", height: "18px", background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#ef4444", borderRadius: "50%", cursor: "pointer", fontSize: "10px" }}>✕</button>
                    <img src={meme.url} alt="Vault Card Item" style={{ width: "100%", borderRadius: "4px", marginBottom: "6px" }} />
                    <p style={{ fontSize: "10px", margin: "0 0 6px 0", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{meme.name}</p>
                    <a href={`https://explorer.aptoslabs.com/txn/${meme.tx}?network=testnet`} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#1e293b", color: "#38bdf8", textAlign: "center", fontSize: "10px", padding: "4px 0", borderRadius: "4px", textDecoration: "none", fontWeight: "bold" }}>View Node Ledger</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Speed Test Block */
        <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.inputBorder}`, padding: "30px", borderRadius: "12px", textAlign: "center" }}>
          <h3>Network Infrastructure Performance Node Matrix</h3>
          <div style={{ maxWidth: "450px", margin: "20px auto", textAlign: "left", display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}><span>⚡ SHELBY NETWORK</span><span>{shelbySpeed}ms</span></div>
              <div style={{ background: "#1e293b", height: "8px", borderRadius: "4px", overflow: "hidden", marginTop: "4px" }}><div style={{ width: isTesting || testComplete ? "100%" : "0%", background: "#38bdf8", height: "10px" }} /></div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}><span>Legacy AWS S3 Storage Cluster</span><span>{s3Speed}ms</span></div>
              <div style={{ background: "#1e293b", height: "8px", borderRadius: "4px", overflow: "hidden", marginTop: "4px" }}><div style={{ width: isTesting || testComplete ? "45%" : "0%", background: "#eab308", height: "10px" }} /></div>
            </div>
          </div>
          <button onClick={runSpeedTest} style={{ background: "#10b981", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Run Pipeline Performance Audit</button>
        </div>
      )}

      <footer style={{ marginTop: "40px", borderTop: `1px solid ${themeStyles.inputBorder}`, paddingTop: "20px", textAlign: "center", opacity: 0.4, fontSize: "12px" }}>
        © 2026 Shelby Workspace Ecosystem. Powered by Aptos Secure High-Performance Blockchain Modules.
      </footer>
    </main>
  );
}
