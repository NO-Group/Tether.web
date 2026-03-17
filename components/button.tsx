// components/button.tsx
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/35";

const variants = {
  primary: "border-white bg-white text-black hover:bg-black hover:text-white",
  secondary: "border-white/15 bg-transparent text-white hover:border-white hover:bg-white hover:text-black"
};

const sizes = {
  sm: "h-10 px-4",
  md: "h-11 px-5",
  lg: "h-12 px-6"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild && href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    );
  }

  if (asChild) {
    return <span className={classes}>{props.children}</span>;
  }

  return <button className={classes} {...props} />;
}
