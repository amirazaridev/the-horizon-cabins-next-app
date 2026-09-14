"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/libs/api/apiFetch";
import { Cabin } from "@/features/cabins/lib/data-service";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function createCabinAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    // FormData مستقیم به Express forward می‌شه — File ها هم سالم می‌رن
    const res = await apiFetch("cabins", {
      method: "POST",
      body: formData,
    });
    console.log(formData, await res.json());

    revalidatePath("/dashboard/cabins");
    return { success: true, message: "سوییت با موفقیت ثبت شد." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ثبت سوییت ناموفق بود. دوباره تلاش کنید.",
    };
  }
}

export async function updateCabinAction(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await apiFetch(`/cabins/${id}`, {
      method: "PATCH",
      body: formData,
    });

    revalidatePath("/dashboard/cabins");
    return { success: true, message: "تغییرات با موفقیت ذخیره شد." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ذخیره تغییرات ناموفق بود. دوباره تلاش کنید.",
    };
  }
}
