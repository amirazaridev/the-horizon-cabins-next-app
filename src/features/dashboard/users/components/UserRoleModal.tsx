"use client";

import { useState, type ReactNode } from "react";
import { Crown, ShieldCheck, User, type LucideIcon } from "lucide-react";

import Modal from "@/components/ui/Modal";
import type { UserRole } from "@/features/auth/constants/auth-cookie";
import { setUserRoleAction } from "../actions/user.actions";
import {
  USER_ROLE_LABELS,
  type AdminUser,
  type UserActionFeedback,
} from "../types/user.types";

const ROLE_OPTIONS: readonly { value: UserRole; hint: string; icon: LucideIcon }[] = [
  {
    value: "guest",
    hint: "دسترسی به پروفایل و رزروهای خود",
    icon: User,
  },
  {
    value: "admin",
    hint: "دسترسی به پنل مدیریت، رزروها و اقامتگاه‌ها",
    icon: ShieldCheck,
  },
  {
    value: "owner",
    hint: "دسترسی کامل شامل مدیریت مدیران و تنظیمات",
    icon: Crown,
  },
];

interface UserRoleModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onFeedback: (feedback: UserActionFeedback) => void;
}

/**
 * مودال «تغییر نقش» — فقط برای مالک نمایش داده می‌شود (کنترل دسترسی نهایی
 * سمت بک‌اند با `restrictTo("owner")` است).
 */
export default function UserRoleModal({
  user,
  isOpen,
  onClose,
  onFeedback,
}: UserRoleModalProps): ReactNode {
  const [selected, setSelected] = useState<UserRole>(user.role);
  const [isPending, setIsPending] = useState(false);

  const hasChange = selected !== user.role;

  /**
   * بستن مودال.
   *
   * ⚠️ انتخاب را همین‌جا (در event handler، نه effect) به نقش فعلی برمی‌گردانیم
   * تا باز شدن بعدی با مقدار درست شروع شود؛ این الگو از `setState` در effect
   * پرهیز می‌کند.
   */
  function handleClose() {
    if (isPending) return;
    setSelected(user.role);
    onClose();
  }

  async function handleSubmit() {
    if (!hasChange) return;
    setIsPending(true);
    try {
      const result = await setUserRoleAction(user.id, selected);
      onFeedback(result);
      if (result.success) onClose();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title="تغییر نقش کاربر"
      description={user.guest?.fullName ?? user.email}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="نقش کاربر">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isPending}
                onClick={() => setSelected(option.value)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-start transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected
                    ? "border-primary-400/60 bg-primary-400/10"
                    : "border-border hover:border-border-strong hover:bg-foreground/5"
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                    isSelected ? "bg-primary-400/15 text-primary-500" : "bg-foreground/5 text-text-gray"
                  }`}
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-text text-sm font-bold">
                    {USER_ROLE_LABELS[option.value]}
                  </span>
                  <span className="text-text-gray truncate text-xs">{option.hint}</span>
                </span>

                <span
                  className={`size-4 shrink-0 rounded-full border-2 transition-colors ${
                    isSelected ? "border-primary-400 bg-primary-400" : "border-border-strong"
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasChange || isPending}
          className="bg-primary-400 focus-visible:ring-primary-400/60 cursor-pointer rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "در حال اعمال..." : "ثبت نقش جدید"}
        </button>
      </div>
    </Modal>
  );
}
