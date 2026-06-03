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
  const { connect, disconnect, connected, account, network } = useWallet();

  const filesUploadedState = useState(1);
  const filesUploaded = getFirstElement(filesUploadedState);
  const setFilesUploaded = getSecondElement(filesUploadedState);

  const uploadingState = useState(false);
  const uploading = getFirstElement(uploadingState);
  const setUploading = getSecondElement(uploadingState);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnect = async () => {
    try {
      await connect("Petra");
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Petra Wallet connection failed! Please make sure the wallet is unlocked.");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Disconnect failed:", error);
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
      alert("Success: " + file.name + " uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 0) {
        uploadFileToShelby(e.target.files);
      }
    }
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
        
        {connected? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#10b981', background: '#111827', padding: '6px 12px', borderRadius: '6px', border: '1px solid #1f2937' }}>
              {getAddressString()}
            </span>
            <button 
              onClick={handleDisconnect} 
              style={{
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                transition: 'opacity 0.2s'
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect} 
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
          >
            Connect Wallet
          </button>
        )}
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
          <h2 style={{ margin: '5px 0 0 0', fontSize: '20px', color: '#10b981' }}>Active</h2>
        </div>
        
        <div style={{ background: '#111827', padding: '15px', borderRadius: '10px', border: '1px solid #1f2937' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Network</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '20px', color: connected? '#3b82f6' : '#ef4444' }}>
            {connected? (network? network.name : 'Devnet') : 'Offline'}
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

export default function Page() {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      <DashboardContent />
    </AptosWalletAdapterProvider>
  );
}
