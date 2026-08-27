import { cn } from "@/lib/utils";

export type UtilityLink = {
  label: string;
  href: string;
  /** Dropped on phones, where the row would wrap awkwardly. */
  phoneHidden?: boolean;
};

/**
 * The small monospaced link row under the hero and in the contact block. Each
 * target keeps a full 44px tap height even though the type is tiny.
 */
export function UtilityLinks({
  links,
  center = false,
  className,
}: {
  links: readonly UtilityLink[];
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap font-mono text-eyebrow-sm font-medium text-muted uppercase md:flex-nowrap md:gap-1.5 md:text-eyebrow",
        center ? "justify-center gap-4" : "gap-3.5",
        className,
      )}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          {...(link.href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
          className={cn(
            "inline-flex min-h-11 items-center px-3 transition-colors duration-200 hover:text-ink",
            link.phoneHidden && "hidden md:inline-flex",
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
