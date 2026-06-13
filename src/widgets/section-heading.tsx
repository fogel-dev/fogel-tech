import { cn } from "@/shared/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5", className)}>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </p>
      <h2 className="max-w-4xl text-balance text-[clamp(2.5rem,7vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
        {title}
      </h2>
    </div>
  );
}
