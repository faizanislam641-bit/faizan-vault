export default function Home() {
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
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition">
            <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-950 rounded-lg mb-4" />
            <h3 className="text-lg font-semibold">{g.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{g.tag} • {g.size}</p>
            <button className="w-full mt-4 py-2 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400">
              Download
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}