import Link from "next/link";
import { cn } from "@/lib/design-system/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" };

export function Button({ className, variant = "secondary", ...props }: ButtonProps) {
  return <button className={cn("btn", variant === "primary" && "primary", variant === "ghost" && "ghost", className)} type="button" {...props} />;
}

export function ButtonLink({ href, children, variant = "secondary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" }) {
  return <Link className={cn("btn", variant === "primary" && "primary", variant === "ghost" && "ghost")} href={href}>{children}</Link>;
}
