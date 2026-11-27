import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "lime" | "dark" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps | "href"> & {
    href: string;
  };

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  lime: "bg-neon-lime text-carbon-black border-neon-lime hover:bg-carbon-black hover:text-neon-lime hover:border-carbon-black",
  dark: "bg-carbon-black text-off-white border-carbon-black hover:bg-neon-lime hover:text-carbon-black hover:border-neon-lime",
  outline:
    "bg-transparent text-current border-current hover:bg-carbon-black hover:text-off-white hover:border-carbon-black",
  ghost: "bg-transparent text-current border-transparent hover:text-neon-lime",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.8125rem]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const EXTERNAL_PROTOCOL = /^(https?:)?\/\//i;
const NON_ROUTER_PROTOCOL = /^(mailto:|tel:)/i;

export function Button(props: ButtonProps) {
  const {
    variant = "lime",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border",
    "font-display font-bold uppercase tracking-[0.04em]",
    "transition-[background-color,color,border-color,transform] duration-500 ease-(--ease-cinematic)",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest;

    if (EXTERNAL_PROTOCOL.test(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    if (NON_ROUTER_PROTOCOL.test(href)) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<
    ButtonAsButtonProps,
    keyof ButtonBaseProps
  >;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
