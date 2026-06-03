"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";

const EMPTY_DEPS: any = new Array();

// Safe helper functions to extract array values without using any square brackets (bypasses platform filter bugs)
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

  // Meme Editor States
  const topTextState = useState("SHELBY IS HOT");
  const topText = getFirstElement(topTextState);
  const setTopText = getSecondElement(topTextState);

  const bottomTextState = useState("AWS IS COLD");
  const bottomText = getFirstElement(bottomTextState);
  const setBottomText = getSecondElement(bottomTextState);

  const activeGradientState = useState("linear-gradient(135deg, #3b82f6, #8b5cf6)");
  const activeGradient = getFirstElement(activeGradientState);
  const setActiveGradient = getSecondElement(activeGradientState);

  const uploadedMemesState = useState<Array<any>>(new Array());
  const uploadedMemes = getFirstElement(uploadedMemesState);
  const setUploadedMemes = getSecondElement(uploadedMemesState);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pure Web Audio API Synthesizer (No external asset files needed, 100% reliable sound effects)
  const playWebSound = (type: string) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "click") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "success") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Redraw Meme Canvas whenever text or gradient changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Drawing Gradient Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (activeGradient.includes("135deg")) {
      grad.addColorStop(0, "#3b82f6");
      grad.addColorStop(1, "#8b5cf6");
    } else if (activeGradient.includes("#f43f5e")) {
      grad.addColorStop(0, "#f43f5e");
      grad.addColorStop(1, "#eab308");
    } else {
      grad.addColorStop(0, "#10b981");
      grad.addColorStop(1, "#06b6d4");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Styling Text
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.textAlign = "center";
    ctx.font = "bold 32px Impact, sans-serif";

    // Draw Top Text
    ctx.textBaseline = "top";
    ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 30);
    ctx.fillText(topText.toUpperCase(), canvas.width / 2, 30);

    // Draw Bottom Text
    ctx.textBaseline = "bottom";
    ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
    ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
  },);

  const handleConnect = async () => {
    playWebSound("click");
    try {
      await connect("Petra");
    } catch (error) {
      console.error(error);
      alert("Petra Wallet connection failed!");
    }
  };

  const handleDisconnect = async () => {
    playWebSound("click");
    try {
      await disconnect();
    } catch (error) {
      console.error(error);
    }
  };

  const getAddressString = () => {
    if (!account) return "";
    try {
      const addrStr = account.address.toString();
      if (addrStr.length > 10) {
        const startStr = addrStr.substring(0, 6);
        const endStr = addrStr.substring(addrStr.length - 4);
        return startStr + "..." + endStr;
      }
      return addrStr;
    } catch (e) {
      return "Connected";
    }
  };

  // Simulated Web3 Upload & On-Chain registration
  const publishMemeToShelby = async () => {
    if (!connected) {
      alert("Please connect your Petra Wallet first!");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    setUploading(true);
    playWebSound("click");

    try {
      // 2 seconds simulated delay for decentralized sharding & erasure coding replication
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const memeUrl = canvas.toDataURL("image/png");
      const randomId = Math.floor(Math.random() * 10000);
      const newMeme = {
        id: randomId,
        name: "Shelby_Meme_" + randomId + ".png",
        url: memeUrl,
        size: "2.4 MB",
        price: "Free",
        paid: false
      };

      const updatedList = new Array(newMeme).concat(uploadedMemes);
      setUploadedMemes(updatedList);
      setFilesUploaded(filesUploaded + 1);
      
      playWebSound("success");
      alert("Successfully uploaded your custom Meme to the Shelby hot storage network!");
    } catch (e) {
      console.error(e);
      alert("Failed to upload. Try again!");
    } finally {
      setUploading(false);
    }
  };

  // Copy simulated gateway link to clipboard
  const copyGatewayLink = (id: number) => {
    playWebSound("click");
    const link = "https://gateway.shelby.xyz/blob/account/" + account?.address + "/meme-" + id;
    navigator.clipboard.writeText(link);
    alert("Gateway URL copied to clipboard!\n\n" + link);
  };

  // Toggle Paywall/Paid Read on a file
  const togglePaywall = (id: number) => {
    playWebSound("click");
    const updated = uploadedMemes.map((m: any) => {
      if (m.id === id) {
        const nextPrice = m.price === "Free"? "0.1 APT" : "Free";
        return {...m, price: nextPrice, paid:!m.paid };
      }
      return m;
    });
    setUploadedMemes(updated);
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #060913, #020308)',
      color: 'white',
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #111827',
        paddingBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', margin: 0, color: '#38bdf8', fontWeight: 'bold', letterSpacing: '1px' }}>SHELBY</h1>
          <p style={{ opacity: 0.6, margin: '5px 0 0 0', fontSize: '13px' }}>Web3 Meme Engine & Hot-Storage Hub</p>
        </div>
        
        {connected? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#10b981', background: '#090d16', padding: '8px 16px', borderRadius: '8px', border: '1px solid #10b981' }}>
              {getAddressString()}
            </span>
            <button 
              onClick={handleDisconnect} 
              onMouseEnter={() => playWebSound("click")}
              style={{
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect} 
            onMouseEnter={() => playWebSound("click")}
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              border: 'none',
              padding: '11px 24px',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <p style={{ fontSize: '13px', opacity: 0.6, margin: 0 }}>Meme Blobs Uploaded</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#38bdf8', fontWeight: 'bold' }}>{filesUploaded}</h2>
        </div>
        
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <p style={{ fontSize: '13px', opacity: 0.6, margin: 0 }}>Storage Speed</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#10b981', fontWeight: 'bold' }}>Sub-Second</h2>
        </div>
        
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <p style={{ fontSize: '13px', opacity: 0.6, margin: 0 }}>Active Connection</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: connected? '#38bdf8' : '#ef4444', fontWeight: 'bold' }}>
            {connected? (network? network.name : 'Mainnet') : 'Offline'}
          </h2>
        </div>

        <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <p style={{ fontSize: '13px', opacity: 0.6, margin: 0 }}>AIP-62 Standard</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: connected? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
            {connected? 'Active' : 'Disconnected'}
          </h2>
        </div>
      </div>

      {/* Main App Work Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {/* Left: Live Meme Canvas Editor */}
        <div style={{ background: '#090d16', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>Meme Live Canvas</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <canvas 
              ref={canvasRef} 
              width={360} 
              height={360} 
              style={{
                borderRadius: '12px',
                border: '1px solid #334155',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                maxWidth: '100%'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => { playWebSound("click"); setActiveGradient("linear-gradient(135deg, #3b82f6, #8b5cf6)"); }}
              style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: 'white' }}
            >
              Synthwave
            </button>
            <button 
              onClick={() => { playWebSound("click"); setActiveGradient("linear-gradient(135deg, #f43f5e, #eab308)"); }}
              style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #f43f5e, #eab308)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: 'white' }}
            >
              Sunset
            </button>
            <button 
              onClick={() => { playWebSound("click"); setActiveGradient("linear-gradient(135deg, #10b981, #06b6d4)"); }}
              style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: 'white' }}
            >
              Neon Green
            </button>
          </div>
        </div>

        {/* Right: Controls & Input Fields */}
        <div style={{ background: '#090d16', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>Configure Meme Asset</h3>
            
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', opacity: 0.6, display: 'block', marginBottom: '6px' }}>TOP CAPTION</label>
              <input 
                type="text" 
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#030712', border: '1px solid #334155', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', opacity: 0.6, display: 'block', marginBottom: '6px' }}>BOTTOM CAPTION</label>
              <input 
                type="text" 
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#030712', border: '1px solid #334155', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ background: '#030712', padding: '15px', borderRadius: '8px', border: '1px dashed #1e293b', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', lineHeight: '1.5' }}>
                💡 <strong>Shelby Hot Storage Power:</strong> This Meme is rendered on a client-side HTML5 canvas and prepares instantly for hot replication across Shelby Storage Providers.
              </p>
            </div>
          </div>

          <button 
            onClick={publishMemeToShelby}
            disabled={uploading}
            style={{
              width: '100%',
              background: uploading? '#1e293b' : 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              color: 'white',
              cursor: uploading? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'all 0.2s'
            }}
          >
            {uploading? "Publishing to Shelby..." : "Publish to Shelby Network"}
          </button>
        </div>
      </div>

      {/* Live Shelby Storage Vault List */}
      <div style={{ background: '#090d16', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>Live Shelby Meme Vault</h3>
        
        {uploadedMemes.length === 0? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#4b5563', fontSize: '13px' }}>
            No memes published yet. Create one above and click "Publish" to start hot storage!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {uploadedMemes.map((m: any) => (
              <div key={m.id} style={{ background: '#030712', border: '1px solid #1e2937', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <img src={m.url} alt={m.name} style={{ width: '100%', borderRadius: '8px', border: '1px solid #1e293b' }} />
                
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>Size: {m.size} | Mode: Hot-Storage</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: m.price === 'Free'? '#10b981' : '#f59e0b' }}>
                    Access: {m.price}
                  </span>
                  
                  <button 
                    onClick={() => togglePaywall(m.id)}
                    style={{ background: '#111827', border: '1px solid #334155', borderRadius: '6px', color: 'white', padding: '5px 10px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    {m.price === 'Free'? 'Add Paywall' : 'Make Free'}
                  </button>
                </div>

                <button 
                  onClick={() => copyGatewayLink(m.id)}
                  style={{
                    width: '100%',
                    background: '#1f2937',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Copy Gateway Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
