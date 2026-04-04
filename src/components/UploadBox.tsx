import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "../utils/translations";

interface UploadBoxProps {
  onFileSelect: (file: File | null) => void;
  lang: Language;
}

export default function UploadBox({ onFileSelect, lang }: UploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang].ui;

  const handleFile = (file: File) => {
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type === "application/pdf") {
          setIsPdf(true);
          setPreview("pdf-placeholder"); // Just a flag
        } else {
          setIsPdf(false);
          setPreview(reader.result as string);
        }
        onFileSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreview(null);
    setIsPdf(false);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onSelect}
              accept="image/*,application/pdf"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-slate-900 font-medium">{t.uploadTitle}</p>
              <p className="text-slate-500 text-sm mt-1">{t.uploadSubtitle}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white group h-64"
          >
            {isPdf ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-4">
                <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-slate-900 font-bold tracking-tight">PDF Document</p>
              </div>
            ) : (
              <img
                src={preview}
                alt="Medical document preview"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                <span className="font-medium text-sm">{t.documentReady}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
