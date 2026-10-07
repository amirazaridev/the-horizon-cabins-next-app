import { redirect } from "next/navigation";

/** `/account` خودش صفحه ندارد؛ به «رزروهای من» می‌رود. */
export default function GuestAccountIndexPage() {
  redirect("/account/bookings");
}
