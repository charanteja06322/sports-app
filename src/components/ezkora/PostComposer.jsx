import React, { useState } from "react";
import { IconX, IconImagePlus } from "./EzkoraIcons";
import { Button } from "./CommonUI";
import { useEzkoraStore, SPORTS } from "../../store/ezkoraStore";

export function PostComposer({ onClose }) {
  const activeSport = useEzkoraStore((s) => s.activeSport);
  const sportConfig = SPORTS.find((s) => s.name === activeSport) || SPORTS[0];
  const addPost = useEzkoraStore((s) => s.addPost);

  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    addPost({
      sport: activeSport,
      caption: caption.trim(),
      imagePath: preview || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        className="ezkora-fade max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: sportConfig.deep }}
            >
              Share with {activeSport}
            </p>
            <h2 className="display-font mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#253638]">
              What happened today?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="action-ring grid size-8 place-items-center rounded-full text-[#71807d] hover:bg-[#EAE4D7] hover:text-[#253638]"
          >
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <textarea
            required
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={`Share a real highlight, game result, or training log in ${activeSport.toLowerCase()}...`}
            className="w-full resize-none rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-4 text-[14px] leading-relaxed text-[#253638] outline-none focus:border-[#277863] focus:ring-2 focus:ring-[#277863]/10"
          />

          {preview && (
            <div className="relative overflow-hidden rounded-2xl border border-[#DDD6C8] max-h-56">
              <img
                src={preview}
                alt="Upload preview"
                className="w-full object-cover max-h-56"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setSelectedFileName("");
                }}
                className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
              >
                <IconX size={14} />
              </button>
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#DDD6C8] bg-[#FAF7F2]/60 p-3.5 text-xs font-bold text-[#71807d] hover:border-[#277863]/60 transition-colors">
            <IconImagePlus size={18} style={{ color: sportConfig.accent }} />
            <span>{selectedFileName ? selectedFileName : "Attach a match photo"}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          <div className="mt-6 flex justify-end gap-2.5 pt-2 border-t border-[#DDD6C8]">
            <Button variant="quiet" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!caption.trim()}
              style={{ backgroundColor: sportConfig.accent }}
              className="hover:brightness-105"
            >
              Publish to {activeSport}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
