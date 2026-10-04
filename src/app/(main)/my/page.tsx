import { redirect } from "next/navigation";

/** `/my` خودش صفحه ندارد؛ به «رزروهای من» می‌رود. */
export default function MyIndexPage() {
  redirect("/my/bookings");
}
