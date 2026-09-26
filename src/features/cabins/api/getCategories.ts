import { ApiResponse } from "@/types/api-response";

export interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string;
  displayOrder: number;
  meta: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.API_URL}categories`, {
    cache: "force-cache",
    next: { revalidate: 60, tags: ["categories-data"] },
  });

  const json: ApiResponse<"categories", Category[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch categories");
  }

  return json.data.categories;
}
