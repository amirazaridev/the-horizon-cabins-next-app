import Filter from "@/components/ui/Filter";

function MainFilter() {
  return (
    <Filter
      filterOptions={[
        { value: "7", title: "7 روز" },
        { value: "30", title: "30 روز" },
        { value: "90", title: "90 روز" },
      ]}
    />
  );
}

export default MainFilter;
