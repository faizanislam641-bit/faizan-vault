"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/x7k9-admin/panel");
    } else {
      setErr("ভুল ইমেইল বা পাসওয়ার্ড");
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-200">
      <form onSubmit={login} className="bg-gray-900 p-8 rounded-xl w-80 border border-gray-800 shadow-2xl">
        <h2 className="text-lg font-semibold mb-1">System Access</h2>
        <p className="text-xs text-gray-500 mb-5">Restricted area</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white mb-3 text-sm focus:outline-none focus:border-emerald-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
          className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white mb-4 text-sm focus:outline-none focus:border-emerald-500"
        />

        <button
          disabled={loading}
          className="w-full py-2.5 bg-emerald-500 text-black font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Checking..." : "Enter"}
        </button>

        {err && <p className="text-red-400 text-xs mt-3">{err}</p>}
      </form>
    </main>
  );
}