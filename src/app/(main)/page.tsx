import { getCabins } from "@/features/cabins/lib/data-service";
import Landing from "@/features/landing";

export default async function Home() {
  const cabins =  (await getCabins()).slice(0,3);

  return <Landing cabins={cabins} />;
}
