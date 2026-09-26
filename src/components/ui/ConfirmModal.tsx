"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تایید",
  cancelText = "انصراف",
  variant = "danger",
}: ConfirmModalProps) {
  const [isPending, setIsPending] = useState(false);

  // تا وقتی عملیات در حال انجامه، مودال نه با Escape/بک‌دراپ و نه با ضربدر بسته نمی‌شه
  function handleClose() {
    if (isPending) return;
    onClose();
  }

  async function handleConfirm() {
    setIsPending(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // خطا قبلاً توسط خود onConfirm (مثلاً toast.error) به کاربر نمایش داده شده؛
      // فقط مودال رو باز نگه می‌داریم تا کاربر بتونه دوباره تلاش کنه
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={`grid size-12 place-items-center rounded-full ${
            variant === "danger"
              ? "bg-danger/10 text-danger"
              : "bg-primary-400/10 text-primary-500"
          }`}
        >
          <AlertTriangle className="size-6" />
        </div>

        <h3 className="text-text mt-4 text-lg font-bold">{title}</h3>
        {description && (
          <p className="text-text-gray mt-2 text-sm leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="outline"
            size="md"
            shape="xl"
            type="button"
            onClick={handleClose}
            disabled={isPending}
          >
            {cancelText}
          </Button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
              variant === "danger"
                ? "bg-danger hover:bg-danger-strong"
                : "bg-primary-500 hover:bg-primary-600"
            }`}
          >
            {isPending ? "در حال پردازش..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
