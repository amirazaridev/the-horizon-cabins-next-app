import { type ReactNode } from "react";
import Button from "../Button";

type Props = { fullWidth?: boolean };

export default function LoginButton({ fullWidth }: Props): ReactNode {
  return (
    <Button size="md" fullWidth={fullWidth} href="/login">
      ورود | ثبت‌نام
    </Button>
  );
}
