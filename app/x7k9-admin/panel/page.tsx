"use client";
import { useState, useEffect } from "react";

interface Img {
  url: string;
  public_id: string;
}

export default function Panel() {
  const [images, setImages] = useState<Img[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState({ done: 0, total: 0 });

  async function loadImages() {
    const res = await fetch("/api/images");
    if (res.ok) setImages(await res.json());
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleFolder(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;

    setUploading(true);
    setProgress(0);
    setCount({ done: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      try {
        await fetch("/api/upload", { method: "POST", body: fd });
      } catch (err) {
        console.error("Upload failed:", files[i].name);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
      setCount({ done: i + 1, total: files.length });
    }

    setUploading(false);
    loadImages();
    alert(`✅ ${files.length}টি ছবি আপলোড সম্পন্ন!`);
  }

  async function deleteImage(public_id: string) {
    if (!confirm("এই ছবিটা ডিলিট করবেন?")) return;
    await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id }),
    });
    loadImages();
  }

  const folderInputProps = {
    type: "file" as const,
    multiple: true,
    onChange: handleFolder,
    className: "hidden",
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">🖼️ Gallery Manager</h1>
        <button
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/x7k9-admin";
          }}
          className="px-4 py-2 bg-red-500 text-black font-semibold rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <label className="inline-block px-6 py-4 bg-emerald-500 text-black font-bold rounded-xl cursor-pointer hover:bg-emerald-400">
          📁 ফোল্ডার সিলেক্ট (সব ছবি একসাথে)
          <input
            {...folderInputProps}
            {...({ webkitdirectory: "true", directory: "" } as any)}
          />
        </label>

        <label className="inline-block px-6 py-4 bg-blue-500 text-black font-bold rounded-xl cursor-pointer hover:bg-blue-400">
          🖼️ গ্যালারি থেকে বাছুন
          <input {...folderInputProps} accept="image/*" />
        </label>
      </div>

      {uploading && (
        <div className="mt-6">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-gray-400">
            আপলোড হচ্ছে... {count.done}/{count.total} ({progress}%)
          </p>
        </div>
      )}

      <p className="mt-6 text-sm text-gray-500">মোট ছবি: {images.length}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {images.map((img, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group"
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="p-3 flex justify-between text-sm">
              <a
                href={img.url}
                target="_blank"
                className="text-emerald-400 hover:underline"
              >
                View
              </a>
              <a
                href={img.url}
                download
                className="text-blue-400 hover:underline"
              >
                Download
              </a>
              <button
                onClick={() => deleteImage(img.public_id)}
                className="text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}