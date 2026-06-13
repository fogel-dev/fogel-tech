"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";

import type { Project } from "@/content/home";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

export function ProjectCard({
  project,
  action,
}: {
  project: Project;
  action: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  function handlePointerMove(event: MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${-y * 3.5}deg`);
    card.style.setProperty("--tilt-y", `${x * 4.5}deg`);
    card.style.setProperty("--pointer-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--pointer-y", `${(y + 0.5) * 100}%`);
  }

  function resetTilt() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <a
      ref={cardRef}
      href={project.href}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetTilt}
      className="project-card group block [perspective:1200px]"
    >
      <Card className="relative overflow-hidden transition-transform duration-500 [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]">
        <div
          className={cn(
            "project-visual relative aspect-[16/10] overflow-hidden border-b border-border",
            `project-visual--${project.visual}`,
          )}
        >
          <div className="project-grid absolute inset-0" />
          <div className="project-orbit absolute left-1/2 top-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-current/30" />
          <div className="project-core absolute left-1/2 top-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-current/60 bg-current/10" />
          <span className="absolute left-5 top-5 font-mono text-[0.65rem] tracking-[0.2em]">
            CASE / {project.index}
          </span>
          <span className="absolute bottom-5 right-5 font-mono text-[0.65rem] tracking-[0.2em]">
            {project.year}
          </span>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:p-8">
          <div>
            <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">
              {project.role}
            </p>
            <h3 className="text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
              {project.title}
            </h3>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <Badge variant="outline" key={technology}>
                  {technology}
                </Badge>
              ))}
            </div>
          </div>
          <span className="flex items-center gap-2 self-end text-sm font-medium">
            {action}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </Card>
    </a>
  );
}
