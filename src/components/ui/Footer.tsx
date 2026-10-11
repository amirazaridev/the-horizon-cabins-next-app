import Link from "next/link";
import { Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import CopyrightText from "@/components/ui/CopyrightText";
import {
  FOOTER_CONTACT,
  FOOTER_QUICK_LINKS,
  FOOTER_SOCIALS,
  FOOTER_SUPPORT_LINKS,
  type FooterLink,
} from "@/constants/footer";


export default function Footer() {
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

          <FooterColumn title="دسترسی سریع" links={FOOTER_QUICK_LINKS} />

          <div>
            <FooterColumnTitle>پشتیبانی</FooterColumnTitle>
            <div className="grid gap-3 text-xs">
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <a
                href={`mailto:${FOOTER_CONTACT.email}`}
                className="flex items-center gap-2"
              >
                <Mail size={13} />
                {FOOTER_CONTACT.email}
              </a>
            </div>
          </div>

          <div>
            <FooterColumnTitle>ما را دنبال کنید</FooterColumnTitle>
            <div className="mt-6 flex gap-4">
              {FOOTER_SOCIALS.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="hover:bg-primary-400 bg-foreground/5 text-text/50 hover:text-background flex size-10 items-center justify-center rounded-full transition-all duration-300"
                >
                  <svg
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-border/7 mt-10 flex flex-col items-center justify-center gap-3 border-t pt-5 sm:flex-row">
          <CopyrightText className="text-[10px]" />
        </div>
      </Container>
    </footer>
  );
}

function FooterColumnTitle({ children }: { children: string }) {
  return <div className="text-text mb-4 text-sm font-bold">{children}</div>;
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <FooterColumnTitle>{title}</FooterColumnTitle>
      <div className="grid gap-3 text-xs">
        {links.map((link) => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
