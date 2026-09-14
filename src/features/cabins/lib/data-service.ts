import { ApiResponse } from "@/types/api-response";

const API_URL = process.env.API_URL;
export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  images?: string[];
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  city?: { id: number; name: string };
  createdAt: Date;
  updatedAt: Date;
};

export async function getCabins(): Promise<Cabin[]> {
  const res = await fetch(`${API_URL}cabins`, {
    cache: "force-cache",
    next: { revalidate: 1, tags: ["cabins-data"] },
  });
  const json: ApiResponse<"cabins", Cabin[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch cabins");
  }

  return json.data.cabins;
}

export async function getCabin(id: number): Promise<Cabin | undefined> {
  const cabins = await getCabins();
  return cabins.find((cabin) => cabin.id === id);
}

export function filterCabins(cabins: Cabin[], filter: string): Cabin[] {
  if (filter === "all") return cabins;
  if (filter === "small") return cabins.filter((c) => c.maxCapacity <= 3);
  if (filter === "medium")
    return cabins.filter((c) => c.maxCapacity > 3 && c.maxCapacity < 8);
  if (filter === "large") return cabins.filter((c) => c.maxCapacity >= 8);
  return cabins;
}
