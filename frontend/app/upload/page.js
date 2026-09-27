"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleFileChange = (e) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("processing");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("ready");
  };

  const canUpload = file && (status === "idle" || status === "ready");

  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-2xl items-center py-8">
      <div className="w-full rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0ebff] text-xl text-[#6e46e6]">↑</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Upload a document</h1>
          <p className="text-sm text-stone-500">Add a PDF and make it ready for questions.</p>
        </div>

        <label htmlFor="pdf-upload" className="block cursor-pointer rounded-xl border border-dashed border-[#cfc5ee] bg-[#fbfaff] p-7 text-center transition hover:border-[#8d6ae8] hover:bg-[#f7f4ff]">
          <span className="block text-sm font-semibold text-stone-800">{file ? file.name : "Choose a PDF file"}</span>
          <span className="mt-1 block text-xs text-stone-500">PDF files only</span>
          <input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} disabled={!canUpload && status !== "idle"} className="sr-only" />
        </label>

        {file && <p className="mt-3 truncate text-center text-xs text-stone-500">Selected file: {file.name}</p>}
        <button onClick={handleUpload} disabled={!canUpload} className="mt-6 w-full rounded-lg bg-[#6e46e6] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b36d6] disabled:cursor-not-allowed disabled:opacity-50">
          {status === "uploading" ? "Uploading…" : status === "processing" ? "Processing…" : status === "ready" ? "Upload another document" : "Upload document"}
        </button>

        {status !== "idle" && (
          <div className={"mt-6 rounded-xl border p-4 text-center text-sm " + (status === "ready" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#e5def8] bg-[#faf8ff] text-[#6e46e6]")}>
            {status === "ready" ? "Your PDF is now queryable." : status === "uploading" ? "Uploading your document…" : "Processing your document…"}
          </div>
        )}
      </div>
    </section>
  );
}
