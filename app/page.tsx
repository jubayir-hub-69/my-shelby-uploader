"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Moon, 
  Bell, 
  Wallet, 
  Upload, 
  Download, 
  Trash2, 
  Sparkles, 
  Type, 
  Layers 
} from "lucide-react";

interface SavedMeme {
  id: string;
  url: string;
  topText: string;
  bottomText: string;
  timestamp: string;
}

export default function ShelbyUploader() {
  // Theme & UI States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [savedMemes, setSavedMemes] = useState<SavedMeme[]>([]);
  
  // Customization States
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [fontSize, setFontSize] = useState<number>(40);
  const [fontFamily, setFontFamily] = useState<string>("Impact");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load Memes from Cache on Mount
  useEffect(() => {
    const cached = localStorage.getItem("shelby_memes");
    if (cached) {
      try {
        setSavedMemes(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse cached memes", e);
      }
    }
  }, []);

  // Redraw Canvas whenever inputs change
  useEffect(() => {
    drawCanvas();
  }, [imageSrc, topText, bottomText, textColor, fontSize, fontFamily, isDarkMode]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        // Draw Main Image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        renderText(ctx, canvas.width, canvas.height);
      };
    } else {
      // Empty State Canvas Background
      ctx.fillStyle = isDarkMode ? "#1F2937" : "#F3F4F6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle border or pattern inside empty canvas
      ctx.strokeStyle = isDarkMode ? "#374151" : "#E5E7EB";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      renderText(ctx, canvas.width, canvas.height);
    }
  };

  const renderText = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Setup Text Styles
    ctx.fillStyle = textColor;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.max(2, fontSize / 8);
    ctx.textAlign = "center";
    ctx.font = `bold ${fontSize}px ${fontFamily}`;

    // 🌟 Feature 3: Live Placeholder Logic
    // যদি ইউজার কোনো টেক্সট না লেখে, তাহলে হালকা অপাসিটিতে প্লেসহোল্ডার দেখাবে
    const displayTop = topText.trim() !== "" ? topText.toUpperCase() : "YOUR TOP TEXT";
    const displayBottom = bottomText.trim() !== "" ? bottomText.toUpperCase() : "YOUR BOTTOM TEXT";

    // Apply lower opacity if it's a placeholder
    if (topText.trim() === "") {
      ctx.fillStyle = isDarkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)";
    } else {
      ctx.fillStyle = textColor;
    }

    // Top Text Draw
    ctx.textBaseline = "top";
    ctx.strokeText(displayTop, width / 2, 25);
    ctx.fillText(displayTop, width / 2, 25);

    // Apply lower opacity for bottom if it's a placeholder
    if (bottomText.trim() === "") {
      ctx.fillStyle = isDarkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)";
    } else {
      ctx.fillStyle = textColor;
    }

    // Bottom Text Draw
    ctx.textBaseline = "bottom";
    ctx.strokeText(displayBottom, width / 2, height - 25);
    ctx.fillText(displayBottom, width / 2, height - 25);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveMemeToVault = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const newMeme: SavedMeme = {
      id: Date.now().toString(),
      url: dataUrl,
      topText: topText || "(Empty)",
      bottomText: bottomText || "(Empty)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newMeme, ...savedMemes];
    setSavedMemes(updated);
    localStorage.setItem("shelby_memes", JSON.stringify(updated));
  };

  // 🌟 Feature 2: Clear Vault Cache Function
  const clearVaultCache = () => {
    if (window.confirm("Are you sure you want to clear all saved memes from vault?")) {
      setSavedMemes([]);
      localStorage.removeItem("shelby_memes");
    }
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `shelby-meme-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#F8FAFC] text-slate-900"}`}>
      
      {/* --- NAVBAR --- */}
      <nav className={`px-6 py-4 flex items-center justify-between border-b transition-colors ${isDarkMode ? "bg-[#111827]/80 border-gray-800" : "bg-white border-slate-200 shadow-sm"}`}>
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
            <Sparkles size={22} />
          </div>
          <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            Shelby Studio
          </span>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-4">
          {/* Light/Dark Toggle Button */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all ${
              isDarkMode 
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" 
                : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            }`}
            title="Toggle Light/Dark Mode"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* Notification Bell */}
          <button className={`p-2.5 rounded-xl border relative transition-all ${
            isDarkMode ? "bg-gray-800 border-gray-700 text-gray-400 hover:text-white" : "bg-white border-slate-300 text-slate-500 hover:text-slate-800 shadow-sm"
          }`}>
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          </button>

          {/* Connect Wallet Button */}
          <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/10 transition-all">
            <Wallet size={18} />
            <span>Connect Wallet</span>
          </button>
        </div>
      </nav>

      {/* --- MAIN WORKSPACE --- */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT WORKSPACE: CANVAS & VIEWPORT (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className={`p-4 rounded-2xl border w-full max-w-md transition-all ${
            // 🌟 Feature 1: UI Contrast Guard Enhancements
            isDarkMode 
              ? "bg-[#111827] border-gray-800 shadow-2xl" 
              : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
          }`}>
            <canvas 
              ref={canvasRef} 
              width={450} 
              height={450} 
              className={`w-full aspect-square rounded-xl object-contain border transition-colors ${
                isDarkMode ? "border-gray-800 bg-gray-900" : "border-slate-200 bg-slate-50"
              }`}
            />
            
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-orange-500/20"
              >
                <Upload size={18} />
                Upload Template
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />

              <button 
                onClick={saveMemeToVault}
                disabled={!imageSrc}
                className={`flex-1 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  imageSrc 
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/10" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                }`}
              >
                <Layers size={18} />
                Save to Vault
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT WORKSPACE: CONTROLS & EDITOR (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-2xl border transition-all ${
            // 🌟 Feature 1: UI Contrast Guard Enhancements
            isDarkMode ? "bg-[#111827] border-gray-800" : "bg-white border-slate-200 shadow-md"
          }`}>
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3 mb-4 dark:border-gray-800 border-slate-200">
              <Type size={18} className="text-orange-500" />
              Meme Customizer
            </h2>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Top Text</label>
                <input 
                  type="text" 
                  value={topText} 
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top caption"
                  className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    // 🌟 Feature 1: UI Contrast Guard Input Styles
                    isDarkMode 
                      ? "bg-gray-900 border-gray-800 text-white focus:border-gray-700" 
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-transparent"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Bottom Text</label>
                <input 
                  type="text" 
                  value={bottomText} 
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom caption"
                  className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    // 🌟 Feature 1: UI Contrast Guard Input Styles
                    isDarkMode 
                      ? "bg-gray-900 border-gray-800 text-white focus:border-gray-700" 
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-transparent"
                  }`}
                />
              </div>

              {/* Advanced Controls Layout Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Font Size ({fontSize}px)</label>
                  <input 
                    type="range" 
                    min={20} 
                    max={80} 
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Text Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className={`w-10 h-10 rounded-lg cursor-pointer border p-0.5 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-slate-300 bg-white"}`}
                    />
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className={`flex-1 px-2 rounded-lg text-xs font-medium border focus:outline-none ${
                        isDarkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-slate-50 border-slate-300 text-slate-800"
                      }`}
                    >
                      <option value="Impact">Impact</option>
                      <option value="Arial">Arial</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Comic Sans MS">Comic Sans</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={downloadMeme}
                disabled={!imageSrc}
                className={`w-full mt-2 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                  imageSrc 
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95 shadow-orange-500/20" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 shadow-none"
                }`}
              >
                <Download size={18} />
                Download Creation
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- LOWER VAULT AREA: SAVED VAULT STORAGE --- */}
      <section className={`max-w-7xl mx-auto px-6 py-8 border-t transition-colors ${isDarkMode ? "border-gray-900" : "border-slate-200"}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
              Shelby Storage Vault
            </h2>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Your local active workspace buffer storage</p>
          </div>

          {/* 🌟 Feature 2: Clear Vault Cache UI Trigger */}
          {savedMemes.length > 0 && (
            <button 
              onClick={clearVaultCache}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 rounded-lg transition-all border border-rose-500/10"
            >
              <Trash2 size={14} />
              Clear Vault Cache
            </button>
          )}
        </div>

        {/* Saved Items Grid Display */}
        {savedMemes.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 ${
            isDarkMode ? "border-gray-800 bg-gray-900/30 text-gray-500" : "border-slate-200 bg-slate-50 text-slate-400"
          }`}>
            <Layers size={36} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">Vault is completely empty</p>
            <p className="text-xs opacity-80 mt-1">Generate a meme and hit "Save to Vault" to secure it here temporarily</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {savedMemes.map((meme) => (
              <div 
                key={meme.id} 
                className={`group rounded-xl overflow-hidden border p-2 transition-all hover:-translate-y-1 ${
                  // 🌟 Feature 1: UI Contrast Guard Cards
                  isDarkMode 
                    ? "bg-[#111827] border-gray-800 hover:border-gray-700 shadow-md" 
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-black/5 dark:bg-black/20">
                  <img src={meme.url} alt="Saved Meme" className="w-full h-full object-cover" />
                  <a 
                    href={meme.url} 
                    download={`shelby-vault-${meme.id}.png`}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold"
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
                <div className="mt-2 px-1 flex items-center justify-between">
                  <span className={`text-[10px] font-mono block ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>ID: {meme.id.slice(-4)}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    isDarkMode ? "bg-gray-800 text-gray-400" : "bg-slate-100 text-slate-600"
                  }`}>{meme.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
