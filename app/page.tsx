"use client";

import { useState } from "react";

export default function Home() {
  const [wallet, setWallet] = useState("");

  const connectWallet = async () => {
    try {
      const response = await window.petra?.connect();
      setWallet(response.address);
    } catch (err) {
      alert("Petra wallet not found");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="flex justify-end p-6">
        <button
          onClick={connectWallet}
          className="bg-blue-600 px-5 py-2 rounded-lg"
        >
          {wallet ? wallet.slice(0,6)+"..."+wallet.slice(-4) : "Connect Wallet"}
        </button>
      </header>

      <div className="flex justify-center items-center h-[80vh]">

        <div className="bg-zinc-900 p-8 rounded-xl w-[420px]">

          <h1 className="text-3xl font-bold text-center mb-5">
            Shelby Storage
          </h1>

          <input type="file"/>

        </div>

      </div>

    </main>
  );
}