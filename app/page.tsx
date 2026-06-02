"use client";

import React, { useState, useEffect, useRef } from 'react';

// Safe helper functions to extract array values without using any square brackets to prevent parser swallowing
const getFirstElement = (array: any): any => {
  return array.slice(0, 1).pop();
};

const getSecondElement = (array: any): any => {
  return array.slice(1, 2).pop();
};

const EMPTY_DEPS: any = new Array();

export default function Home() {
  const connectedState = useState(false);
  const connected = getFirstElement(connectedState);
  const setConnected = getSecondElement(connectedState);

  const accountState = useState<any>(null);
  const account = getFirstElement(accountState);
  const setAccount = getSecondElement(accountState);

  const filesUploadedState = useState(1);
  const filesUploaded = getFirstElement(filesUploadedState);
  const setFilesUploaded = getSecondElement(filesUploadedState);

  const storageState = useState("Active");
  const storage = getFirstElement(storageState);
  const setStorage = getSecondElement(storageState);

  const networkState = useState("Offline");
  const network = getFirstElement(networkState);
  const setNetwork = getSecondElement(networkState);

  const uploadingState = useState(false);
  const uploading = getFirstElement(uploadingState);
  const setUploading = getSecondElement(uploadingState);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to activate Mock/Demo Mode when wallet connection is unavailable
  function activateDemoMode() {
    setAccount({ address: "0x1234567890abcdef1234567890abcdef12345678" });
    setConnected(true);
    setNetwork("Devnet (Demo)");
    alert("Connected in Demo Mode! You can now test the upload area and dashboard status.");
  }

  // 1. Wallet connection using Petra extension API with dynamic error catcher and Demo Mode fallback
  async function connectWallet() {
    try {
      if (typeof window!== 'undefined') {
        const win = window as any;
        if (win.aptos) {
          const response = await win.aptos.connect();
          setAccount(response);
          setConnected(true);
          setNetwork("Devnet");
          return;
        }
      }
      
      // Fallback to Demo Mode if Petra is not found in the browser
      const useDemo = confirm("Petra Wallet extension not found!\n\nWould you like to connect in 'Demo Mode' to test the dashboard UI?");
      if (useDemo) {
        activateDemoMode();
      } else {
        window.open("https://petra.app", "_blank");
      }
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      
      // Dynamic error detection (e.g. if the extension is locked or user cancels)
      const errorMessage = error && error.message? error.message : String(error);
      
      const useDemo = confirm(
        "Wallet Connection Failed!\n\nReason: " + errorMessage + 
        "\n\nWould you like to bypass this and connect in 'Demo Mode' to test your website?"
      );
      
      if (useDemo) {
        activateDemoMode();
      }
    }
  }

  // 2. Disconnect wallet connection with defensive fallback
  async function disconnectWallet() {
    try {
      if (typeof window!== 'undefined') {
        const win = window as any;
        if (win.aptos) {
          await win.aptos.disconnect();
        }
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    } finally {
      // Always reset frontend state to disconnected even if the extension throws an error
      setConnected(false);
      setAccount(null);
      setNetwork("Offline");
    }
  }

  // 3. Automatically check wallet connection status on refresh
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window!== 'undefined') {
        const win = window as any;
        if (win.aptos) {
          try {
            const isConnected = await win.aptos.isConnected();
            if (isConnected) {
              const response = await win.aptos.account();
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

  // 4. Simulated file upload method
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

    const file = files.item(0);
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const currentCount = filesUploaded? filesUploaded : 0;
      setFilesUploaded(currentCount + 1);
      
      alert("Success: " + file.name + " simulated upload completed successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  // 5. Drag and Drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) {
      if (e.dataTransfer.files) {
        if (e.dataTransfer.files.length > 0) {
          uploadFileToShelby(e.dataTransfer.files);
        }
      }
    }
  };

  // 6. Manual file selection handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 0) {
        uploadFileToShelby(e.target.files);
      }
    }
  };

  // 7. Format connected wallet address smoothly
  const getAddressString = () => {
    if (!account) return "";
    let addr = account.address;
    if (!addr) {
      addr = account.accountAddress;
    }
    if (!addr) {
      addr = "";
    }
    if (typeof addr === "string") {
      if (addr.length > 10) {
        const startStr = addr.substring(0, 6);
        const endStr = addr.substring(addr.length - 4);
        return startStr + "..." + endStr;
      }
    }
    return "Connected";
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0f24, #050716)',
      color: 'white',
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
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
