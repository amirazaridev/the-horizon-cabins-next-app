"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/libs/api/apiFetch";
import { ApiResponse } from "@/types/api-response";
import { EmptyObject } from "react-hook-form";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function createCabinAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const res = await apiFetch("cabins", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    console.log(formData, json);

    if (!res.ok) throw new Error(json.message);

    revalidateTag("cabins-data", "max");

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
    const res = await apiFetch(`cabins/${id}`, {
      method: "PATCH",
      body: formData,
    });
    const json = await res.json();
    console.log(formData, json);

    if (!res.ok) throw new Error(json.message);

    revalidateTag("cabins-data", "max");

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

export async function deleteCabinAction(id: number): Promise<ActionResult> {
  try {
    const res = await apiFetch(`cabins/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message);
    }

    revalidateTag("cabins-data", "max");
    revalidatePath("/dashboard/cabins");
    return { success: true, message: "سوییت با موفقیت حذف شد." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "حذف سوییت ناموفق بود. دوباره تلاش کنید.",
    };
  }
}
