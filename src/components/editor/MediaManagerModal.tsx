"use client";

import React, { useState, useEffect, useRef } from "react";
import { mediaService, MediaAsset } from "@/services/mediaService";
import { Image as ImageIcon, Upload, Trash2, X, Check, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaManagerModal({ isOpen, onClose, onSelect }: MediaManagerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    const list = await mediaService.getAll();
    setAssets(list);
  };

  useEffect(() => {
    if (isOpen) loadMedia();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const newAsset: MediaAsset = {
        id: `media_${Date.now()}`,
        name: file.name,
        url: base64,
        mimeType: file.type,
        size: file.size,
        alt: file.name.split(".")[0],
        createdAt: new Date().toISOString(),
      };
      await mediaService.save(newAsset);
      await loadMedia();
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await mediaService.delete(id);
    await loadMedia();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans">
      <div className="w-full max-w-3xl rounded-xl border border-cyan-500/30 bg-[#07070c] shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/50">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm font-bold">
            <HardDrive className="h-4 w-4" />
            <span>INDEXED_DB_MEDIA_VAULT</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action toolbar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {assets.length} ASSETS STORED IN BROWSER MEMORY (NO 5MB LIMIT)
          </span>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-semibold text-xs h-8"
          >
            <Upload className="h-3.5 w-3.5 mr-1" /> {isUploading ? "UPLOADING..." : "UPLOAD FILE"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {assets.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-mono text-xs">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-slate-700" />
              NO_MEDIA_UPLOADED // CLICK UPLOAD TO ADD IMAGES
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {assets.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative aspect-video rounded-lg border border-slate-800 bg-black/60 overflow-hidden cursor-pointer hover:border-cyan-400 transition-all"
                >
                  <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">SELECT</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="absolute top-1 right-1 p-1 rounded bg-black/80 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 truncate">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
