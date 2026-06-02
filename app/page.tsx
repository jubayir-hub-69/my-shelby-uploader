"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShelbyClient } from '@shelby-protocol/sdk';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<any>(null);
  const [filesUploaded, setFilesUploaded] = useState(1);
  const = useState("Active");
  const [network, setNetwork] = useState("Offline");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ১. Petra Wallet কানেক্ট করার ফাংশন
  async function connectWallet() {
    try {
      if (typeof window!== 'undefined' && (window as any).aptos) {
        const response = await (window as any).aptos.connect();
        setAccount(response);
        setConnected(true);
        setNetwork("Devnet"); // কানেক্ট হলে Devnet দেখাবে
      } else {
        alert('Petra Wallet not found! If you are on mobile, please open this link inside the Petra Wallet App Browser.');
        window.open('https://petra.app', '_blank');
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert('Wallet connection failed! Please try again.');
    }
  }

  // ২. ওয়ালেট ডিসকানেক্ট করার ফাংশন
  async function disconnectWallet() {
    try {
      if (typeof window!== 'undefined' && (window as any).aptos) {
        await (window as any).aptos.disconnect();
      }
      setConnected(false);
      setAccount(null);
      setNetwork("Offline");
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  }

  // ৩. ব্রাউজার রিফ্রেশ হলে ওয়ালেটের পূর্ববর্তী কানেকশন স্বয়ংক্রিয়ভাবে চেক করার হুক
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window!== 'undefined' && (window as any).aptos) {
        try {
          const isConnected = await (window as any).aptos.isConnected();
          if (isConnected) {
            const response = await (window as any).aptos.account();
            setAccount(response);
            setConnected(true);
            setNetwork("Devnet");
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkConnection();
  },); // সঠিক খালি ডিপেন্ডেন্সি অ্যারে [ ] সহ সঠিক ব্র্যাকেট বসানো হয়েছে

  // ৪. Shelby SDK ব্যবহার করে ফাইল আপলোড করার ফাংশন
  const uploadFileToShelby = async (files: FileList | null) => {
    if (!connected) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!files || files.length === 0) return;

    const file = files; // FileList থেকে প্রথম ফাইলটি সিলেক্ট করা হচ্ছে
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (!event.target ||!event.target.result) return;
          const fileData = new Uint8Array(event.target.result as ArrayBuffer);
          
          // Shelby Client ইনিশিয়ালাইজেশন
          const client = new ShelbyClient({
            apiKey: process.env.NEXT_PUBLIC_SHELBY_SHELBYNET_API_KEY || "demo-key",
            network: "devnet"
          });

          // ফাইল আপলোড কমান্ড
          await client.upload({
            blobData: fileData,
            signer: account,
            blobName: file.name,
            expirationMicros: Date.now() * 1000 + 86400 * 1000 * 1000, // ফাইলের মেয়াদ ২৪ ঘণ্টা
          });

          setFilesUploaded((prev) => prev + 1);
          alert(`"${file.name}" uploaded successfully to Shelby Network!`);
        } catch (err) {
          console.error(err);
          alert("Upload failed. Make sure @shelby-protocol/sdk package is installed.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  // ৫. ড্রপজোন হ্যান্ডলার (Drag and Drop)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFileToShelby(e.dataTransfer.files);
    }
  };

  // ६. ম্যানুয়ালি ফাইল সিলেক্ট করার হ্যান্ডলার
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFileToShelby(e.target.files);
    }
  };

  // ওয়ালেট অ্যাড্রেস ফরম্যাট করার হেল্পার
  const getAddressString = () => {
    if (!account) return '';
    const addr = account.address || account.accountAddress || '';
    if (typeof addr === 'string' && addr.length > 10) {
      return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    }
    return 'Connected';
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0f24, #050716)', // আপনার ডার্ক থিম
      color: 'white',
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
      {/* হেডার সেকশন */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0, color: '#38bdf8' }}>Shelby</h1>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0', fontSize: '12px' }}>Storage Dashboard</p>
        </div>
        
        {/* ওয়ালেট কানেক্ট বাটন */}
        <button 
          onClick={connected? disconnectWallet : connectWallet} 
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => ((e.target as HTMLButtonElement).style.opacity = '0.9')}
          onMouseOut={(e) => ((e.target as HTMLButtonElement).style.opacity = '1')}
        >
          {connected && account? getAddressString() : 'Connect Wallet'}
        </button>
      </div>

      {/* স্ট্যাটাস কার্ডসমূহ (ডাইনামিক গ্রিড) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ background: '#111827', padding: '15px', borderRadius: '10px', border: '1px solid #1f2937' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Files Uploaded</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '20px', color: '#38bdf8' }}>{filesUploaded}</h2>
        </div>
        
        <div style={{ background: '#111827', padding: '15px', borderRadius: '10px', border: '1px solid #1f2937' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Storage</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '20px', color: '#10b981' }}>{storage}</h2>
        </div>
        
        <div style={{ background: '#111827', padding: '15px', borderRadius: '10px', border: '1px solid #1f2937' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Network</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '20px', color: network === 'Offline'? '#ef4444' : '#3b82f6' }}>
            {network}
          </h2>
        </div>
        
        <div style={{ background: '#111827', padding: '15px', borderRadius: '10px', border: '1px solid #1f2937' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Status</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '20px', color: connected? '#10b981' : '#ef4444' }}>
            {connected? 'Connected' : 'Disconnected'}
          </h2>
        </div>
      </div>

      {/* ড্রপ ও আপলোড এরিয়া */}
      <div style={{
        background: '#111827',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #1f2937'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Upload Area</h3>
        
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #38bdf8',
            padding: '50px 20px',
            textAlign: 'center',
            borderRadius: '10px',
            cursor: 'pointer',
            background: uploading? '#0f172a' : 'transparent',
            transition: 'background 0.3s'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            style={{ display: 'none' }} 
          />
          <p style={{ margin: 0, color: '#9ca3af' }}>
            {uploading? 'Uploading to Shelby Network...' : 'Drop file here, or click to browse'}
          </p>
        </div>
      </div>
    </main>
  );
}
