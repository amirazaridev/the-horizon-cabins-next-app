"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "sm",
}: ModalProps) {
  const [visible, setVisible] = useState(false);

  // برای انیمیشن fade/scale، یک فریم بعد از mount شدن کلاس‌ها رو فعال می‌کنیم
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(isOpen));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-surface border-border relative w-full ${sizeClass[size]} rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-95 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="بستن"
          className="text-text-gray hover:text-text hover:bg-background-2 absolute end-4 top-4 rounded-full p-1.5 transition"
        >
          <X className="size-4" />
        </button>

        {title && <h3 className="text-text pe-8 text-lg font-bold">{title}</h3>}
        {description && (
          <p className="text-text-gray mt-2 pe-8 text-sm leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
