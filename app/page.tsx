"use client";

import React, { useState, useEffect, useRef } from 'react';

// Vercel build-এ ব্র্যাকেট বাগ এড়াতে সুরক্ষিত খালি ডিপেন্ডেন্সি রেফারেন্স
const EMPTY_DEPS: any =;

export default function Home() {
  const connectedState = useState(false);
  const connected = connectedState;
  const setConnected = connectedState[1];

  const accountState = useState<any>(null);
  const account = accountState;
  const setAccount = accountState[1];

  const filesUploadedState = useState(1);
  const filesUploaded = filesUploadedState;
  const setFilesUploaded = filesUploadedState[1];

  const storageState = useState("Active");
  const storage = storageState;
  const setStorage = storageState[1];

  const networkState = useState("Offline");
  const network = networkState;
  const setNetwork = networkState[1];

  const uploadingState = useState(false);
  const uploading = uploadingState;
  const setUploading = uploadingState[1];

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ১. Petra Wallet কানেক্ট করার ফাংশন
  async function connectWallet() {
    try {
      if (typeof window!== 'undefined') {
        if ((window as any).aptos) {
          const response = await (window as any).aptos.connect();
          setAccount(response);
          setConnected(true);
          setNetwork("Devnet");
          return;
        }
      }
      alert('Petra Wallet not found! If you are on mobile, please open this link inside the Petra Wallet App Browser.');
      window.open('https://petra.app', '_blank');
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert('Wallet connection failed! Please try again.');
    }
  }

  // ২. ওয়ালেট ডিসকানেক্ট করার ফাংশন
  async function disconnectWallet() {
    try {
      if (typeof window!== 'undefined') {
        if ((window as any).aptos) {
          await (window as any).aptos.disconnect();
        }
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
      if (typeof window!== 'undefined') {
        if ((window as any).aptos) {
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
      }
    };
    checkConnection();
  }, EMPTY_DEPS);

  // ৪. সিমুলেটেড ফাইল আপলোড ফাংশন (কোনো প্যাকেজ বা টাইপ এরর ছাড়া)
  const uploadFileToShelby = async (files: FileList | null) => {
    if (!connected) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!files) {
      return;
    }
    if (files.length === 0) {
      return;
    }

    const file = files; // সংশোধিত: সঠিকভাবে ফাইললিস্টের প্রথম ফাইলটি নেওয়া হয়েছে
    if (!file) return;

    setUploading(true);
    try {
      // ফাইল আপলোডের একটি নকল বিলম্ব (Simulated Delay)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFilesUploaded((prev) => prev + 1);
      alert(`"${file.name}" simulated upload to Shelby Network successful!`);
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
    if (e.dataTransfer.files) {
      if (e.dataTransfer.files.length > 0) {
        uploadFileToShelby(e.dataTransfer.files);
      }
    }
  };

  // ৬. ম্যানুয়ালি ফাইল সিলেক্ট করার হ্যান্ডলার
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 0) {
        uploadFileToShelby(e.target.files);
      }
    }
  };

  // ৭. ওয়ালেট অ্যাড্রেস ফরম্যাট করার হেল্পার
  const getAddressString = () => {
    if (!account) return '';
    let addr = account.address;
    if (!addr) {
      addr = account.accountAddress;
    }
    if (!addr) {
      addr = '';
    }
    if (typeof addr === 'string') {
      if (addr.length > 10) {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
      }
    }
    return 'Connected';
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0f24, #050716)',
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
          {connected? (account? getAddressString() : 'Connected') : 'Connect Wallet'}
        </button>
      </div>

      {/* স্ট্যাটাস কার্ডসমূহ */}
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
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
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
