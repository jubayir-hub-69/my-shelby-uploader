"use client";

import { useState } from "react";

export default function ShelbyUploader() {

  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">

      <div className="max-w-lg w-full bg-zinc-900 rounded-2xl p-8 border border-zinc-800">

        <h1 className="text-4xl font-bold text-center mb-2">
  Shelby Decentralized Storage
</h1>
      

        <p className="text-zinc-400 text-center mb-8">
  Fast • Secure • Decentralized
</p>

        <div className="border-2 border-dashed border-zinc-700 rounded-xl p-10 text-center">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="fileInput"
          />

          <label
            htmlFor="fileInput"
            className="cursor-pointer"
          >

            <div className="text-6xl mb-4">
              📁
            </div>

            {file && (
  <p className="mt-2 text-green-400 text-sm">
    File ready for upload 🚀
  </p>
)}

            <p className="text-sm text-zinc-500">
              Upload any file
            </p>

          </label>
          {file && (
  <p className="mt-2 text-green-400 text-sm">
    File ready for upload 🚀
  </p>
)}

        </div><p className="mt-6 text-center text-xs text-zinc-500">
  Powered by Shelby Protocol ⚡
</p>

      </div>

    </div>
  );
}