"use server";

import { updateTag } from "next/cache";

export async function revalidateLastMinute(): Promise<void> {
  updateTag("last-minute-data");
}
