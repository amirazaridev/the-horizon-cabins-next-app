import { getCabins } from "@/features/cabins/api";
import Landing from "@/features/landing";

export default async function Home() {
  const cabins =  (await getCabins()).slice(0,3);

  return <Landing cabins={cabins} />;
}
