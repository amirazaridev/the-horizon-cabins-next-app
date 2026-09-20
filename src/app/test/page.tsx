import Tabs from "@/components/ui/Tabs";
import { type ReactNode } from "react";

export default function page(): ReactNode {
  return (
    <div className="w-100">
      <Tabs
        defaultValue="info"
        items={[
          { id: "info", label: "مشخصات", content: <p>محتوای مشخصات</p> },
          { id: "comments", label: "نظرات", content: <p>محتوای نظرات</p> },
          { id: "rules", label: "قوانین", disabled: true, content: <p>...</p> },
        ]}
      />
    </div>
  );
}
