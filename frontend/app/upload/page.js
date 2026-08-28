"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // "idle" | "uploading" | "processing" | "ready"

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");

    // TODO: Replace with actual API call
    // Simulate file uploading
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus("processing");

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setStatus("ready");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">Upload Document</h1>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400" htmlFor="pdf-upload">
              Select PDF File
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={status !== "idle" && status !== "ready"}
              className="block w-full text-sm text-zinc-300
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-500
                file:cursor-pointer
                cursor-pointer
                focus:outline-none"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || (status !== "idle" && status !== "ready")}
            className="w-full py-3 px-4 bg-white text-zinc-950 font-semibold rounded-lg shadow-sm hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Upload
          </button>

          {status !== "idle" && (
            <div className="mt-6 transition-all duration-300 ease-in-out">
              <div className="flex flex-col items-center justify-center text-zinc-300 font-medium">
                {status === "uploading" && (
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </div>
                )}
                
                {status === "processing" && (
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                )}
                
                {status === "ready" && (
                  <div className="flex flex-col items-center text-emerald-400 space-y-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg">Ready!</span>
                    </div>
                  </div>
                )}
              </div>
              
              {status === "ready" && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                  <p className="text-emerald-400 font-medium">Your PDF is now queryable</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
