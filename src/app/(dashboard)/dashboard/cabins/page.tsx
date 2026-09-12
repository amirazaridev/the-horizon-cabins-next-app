import AddCabin from "@/features/dashboard/cabins/AddCabin";
import CabinListOperations from "@/features/dashboard/cabins/CabinListOperations";
import CabinListDashboard from "@/features/dashboard/cabins/CabinListDashboard";

function CabinPage() {
  return (
    <div>
      <div className="space-y-2 md:space-y-8">
        <div className="flex justify-between ">
          <h2 className="font-semibold text-3xl">سوئیت ها</h2>
          <AddCabin />
        </div>
        <CabinListOperations />
      </div>
      <CabinListDashboard />
    </div>
  );
}

export default CabinPage;
