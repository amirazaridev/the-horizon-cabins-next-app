import Link from "next/link";
import { Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";

export default function HorizonFooter() {
  return (
    <footer className="bg-background-2 text-text-gray border-border border-t px-4 py-10 shadow-lg md:px-6 md:py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <div className="text-text">
              <Logo />
            </div>
            <p className="mt-5 max-w-sm text-xs leading-7">
              اقامتگاه‌های خاص ایران را پیدا کنید و فاصله کوتاهی از شلوغی شهر به
              یک تجربه ماندگار تبدیل کنید.
            </p>
          </div>
          <div>
            <div className="text-text mb-4 text-sm font-bold">دسترسی سریع</div>
            <div className="grid gap-3 text-xs">
              <Link href="#destinations">مقاصد</Link>
              <Link href="#stays">اقامتگاه‌ها</Link>
              <Link href="#experiences">تجربه‌ها</Link>
              <Link href="/cabins">رزرو</Link>
            </div>
          </div>
          <div>
            <div className="text-text mb-4 text-sm font-bold">پشتیبانی</div>
            <div className="grid gap-3 text-xs">
              <Link href="/cabins">قوانین و شرایط</Link>
              <Link href="/cabins">سوالات متداول</Link>
              <a
                href="mailto:info@thehorizon.com"
                className="flex items-center gap-2"
              >
                <Mail size={13} />
                info@thehorizon.com
              </a>
            </div>
          </div>
          <div>
            <div className="text-text mb-4 text-sm font-bold">
              ما را دنبال کنید
            </div>
            <div className="mt-6 flex gap-4">
              {["facebook", "instagram", "twitter", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="hover:bg-primary-400 bg-foreground/5 text-foreground/50 hover:text-background flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
            <div className="border-border bg-border/50 mt-5 h-9 rounded-full border px-3 text-[10px] leading-9">
              ایمیل خود را وارد کنید برای خبرهای جدید
            </div>
          </div>
        </div>
        <div className="border-border/7 mt-10 flex flex-col items-center justify-center gap-3 border-t pt-5 text-[10px] sm:flex-row">
          <span>© ۲۰۰۵ هورایزن. تمامی حقوق محفوظ است.</span>
        </div>
      </Container>
    </footer>
  );
}
