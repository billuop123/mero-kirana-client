"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { QrCode, X, Copy, Check } from "lucide-react";

export default function BillQRCode({ billId }: { billId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/b/${billId}`);
  }, [billId]);

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <QrCode size={14} />
        Share
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-sm font-semibold text-gray-900">Scan to view bill</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <QRCode value={url} size={180} />
            </div>

            <p className="text-xs text-gray-400 text-center">
              Customer scans this to view their receipt on their phone
            </p>

            <button
              onClick={copy}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
