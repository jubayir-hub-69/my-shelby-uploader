"use client";

import { useState } from "react";

export default function Home() {
  const [account, setAccount] = useState("");
  const [fileName, setFileName] = useState("");

  const connectWallet = async () => {
    try {
      if ("aptos" in window) {
        const wallet = (window as any).aptos;

        const response = await wallet.connect();

        setAccount(response.address);

        alert("Wallet Connected ✅");
      } else {
        alert("Petra Wallet install করুন");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFile = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="flex justify-end p-6">

        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
          {account
            ? account.slice(0,6) +
              "..." +
              account.slice(-4)
            : "Connect Wallet"}
        </button>

      </header>

      <div className="flex justify-center items-center h-[80vh]">

        <div className="bg-zinc-900 p-8 rounded-2xl w-[420px] text-center shadow-lg">

          <h1 className="text-4xl font-bold mb-3">
            Shelby Storage
          </h1>

          <p className="text-gray-400 mb-8">
            Secure decentralized storage
          </p>

          <label
            htmlFor="file"
            className="border-2 border-dashed border-gray-600 rounded-xl p-10 block cursor-pointer hover:border-blue-500"
          >

            📁 Upload File

          </label>

          <input
            id="file"
            type="file"
            hidden
            onChange={handleFile}
          />

          {fileName && (

            <p className="mt-4 text-green-400">

              {fileName}

            </p>

          )}

        </div>

      </div>

    </main>
  );
}