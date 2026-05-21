"use client";

import { useState } from "react";

export default function ShelbyUploader() {
  const [wallet, setWallet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const connectWallet = async () => {
    if ((window as any).aptos) {
      const response = await (window as any).aptos.connect();
      setWallet(response.address);
    } else {
      alert("Install Petra wallet");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-xl w-[420px]">

        <h1 className="text-3xl font-bold text-center">
          Shelby Storage
        </h1>

        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 p-3 rounded mt-5"
        >
          {wallet ? "Connected" : "Connect Wallet"}
        </button>

        {wallet && (
          <p className="mt-3 text-sm break-all">
            {wallet}
          </p>
        )}

        <input
          type="file"
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
          className="mt-5"
        />

        {file && (
          <p className="mt-3 text-green-400">
            File ready ✅
          </p>
        )}

      </div>

    </main>
  );
}