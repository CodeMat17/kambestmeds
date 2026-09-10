import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

/**
 * Shared page rhythm. Every marketing section goes through these so vertical
 * spacing, max-width and heading treatment stay identical site-wide.
 */

export function Section({
  className,
  width = "default",
  tone = "paper",
  children,
  ...props
}: React.ComponentProps<"section"> & {
  width?: "default" | "wide" | "narrow" | "full";
  tone?: "paper" | "deep" | "ink" | "none";
}) {
  const tones = {
    paper: "",
    deep: "bg-paper-deep",
    ink: "bg-primary text-primary-foreground",
    none: "",
  };

  return (
    <section
      className={cn(
        "relative py-20 sm:py-28 lg:py-32",
        tones[tone],
        className,
      )}
      {...props}
    >
      {width === "full" ? children : <Container width={width}>{children}</Container>}
    </section>
  );
}

export function Container({
  className,
  width = "default",
  ...props
}: React.ComponentProps<"div"> & {
  width?: "default" | "wide" | "narrow";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-[88rem]",
  };
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-8", widths[width], className)}
      {...props}
    />
  );
}

/**
 * The masthead every interior page opens with. A hairline-bounded band on the
 * deeper paper tone, so interior pages announce themselves without needing a
 * hero photograph of their own.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-rule bg-paper-deep",
        className,
      )}
    >
      <div aria-hidden className="grain absolute inset-0 text-foreground" />
      <Container className="relative py-16 sm:py-24 lg:py-28">
        <Reveal className="max-w-3xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className={cn("text-title text-balance", eyebrow && "mt-5")}>
            {title}
          </h1>
          {lede && (
            <p className="mt-6 max-w-xl text-lede text-pretty text-muted-foreground">
              {lede}
            </p>
          )}
          {children && <div className="mt-9">{children}</div>}
        </Reveal>
      </Container>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
        !centered && action && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "flex flex-col items-center")}>
        {eyebrow && (
          <span className={cn("eyebrow", centered && "eyebrow-center")}>
            {eyebrow}
          </span>
        )}
        <h2 className={cn("text-title text-balance", eyebrow && "mt-5")}>
          {title}
        </h2>
        {lede && (
          <p className="mt-5 text-lede text-pretty text-muted-foreground">
            {lede}
          </p>
        )}
      </div>
      {action && <div className={cn(centered && "mt-2")}>{action}</div>}
    </Reveal>
  );
}
