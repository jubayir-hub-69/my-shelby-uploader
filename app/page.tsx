"use client";

import { useState } from "react";

export default function ShelbyStorage() {
  const [wallet, setWallet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const connectWallet = async () => {
    try {
      const petra = (window as any).aptos;

      if (!petra) {
        alert("Petra wallet install করুন");
        return;
      }

      const response = await petra.connect();

      setWallet(response.address);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex justify-end p-6">

        <button
          onClick={connectWallet}
          className="bg-blue-600 px-5 py-2 rounded-lg"
        >
          {wallet
            ? wallet.slice(0,6)+"..."+wallet.slice(-4)
            : "Connect Wallet"}
        </button>

      </div>

      <div className="flex justify-center mt-20">

        <div className="bg-zinc-900 w-[520px] p-8 rounded-2xl">

          <h1 className="text-4xl text-center font-bold">
            Shelby Storage
          </h1>

          <p className="text-center mt-3 text-zinc-400">
            Fast • Secure • Decentralized
          </p>

          <div className="border border-dashed mt-8 p-10 rounded-xl text-center">

            <input
              type="file"
              onChange={(e)=>
                setFile(
                  e.target.files?.[0] || null
                )
              }
            />

            {file && (
              <p className="mt-4 text-green-400">
                File Ready 🚀
              </p>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}