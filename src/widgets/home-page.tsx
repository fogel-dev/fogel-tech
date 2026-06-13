"use client";

import { animate, stagger } from "animejs";
import { ArrowDown, ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { usePreferences } from "@/features/preferences/preferences-provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { ProjectCard } from "@/widgets/project-card";
import { SectionHeading } from "@/widgets/section-heading";
import { SiteHeader } from "@/widgets/site-header";
import { DigitalCore } from "@/widgets/digital-core";

export function HomePage() {
  const { dictionary } = usePreferences();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    animate("[data-hero-reveal]", {
      y: ["110%", "0%"],
      opacity: [0, 1],
      delay: stagger(90, { start: 180 }),
      duration: 950,
      ease: "outExpo",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          if (element.matches("[data-reveal-group]")) {
            animate(element.querySelectorAll("[data-reveal]"), {
              y: [36, 0],
              opacity: [0, 1],
              delay: stagger(70),
              duration: 800,
              ease: "outExpo",
            });
          } else {
            animate(element, {
              y: [70, 0],
              opacity: [0, 1],
              duration: 950,
              ease: "outExpo",
            });
          }
          observer.unobserve(element);
        });
      },
      { threshold: 0.16 },
    );

    document
      .querySelectorAll("[data-reveal-group], .project-card")
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  async function copyEmail() {
    await navigator.clipboard.writeText(dictionary.contact.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const stackLoop = [
    ...dictionary.stack.technologies,
    ...dictionary.stack.technologies,
  ];

  return (
    <>
      <SiteHeader />
      <div className="site-noise" aria-hidden="true" />
      <DigitalCore />

      <main id="top" className="relative z-10">
        <section
          data-scene="hero"
          className="page-shell relative flex min-h-[100svh] items-end pb-10 pt-32 md:pb-14"
        >
          <div className="relative z-10 grid w-full gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,.95fr)] lg:items-end">
            <div>
              <div className="reveal-line mb-8">
                <p
                  data-hero-reveal
                  className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent opacity-0"
                >
                  {dictionary.hero.eyebrow}
                </p>
              </div>
              <h1 className="text-[clamp(3.5rem,10.4vw,10rem)] font-semibold leading-[0.83] tracking-[-0.075em]">
                <span className="reveal-line">
                  <span data-hero-reveal className="opacity-0">
                    {dictionary.hero.titleLead}
                  </span>
                </span>
                <span className="reveal-line pb-[0.12em] text-accent">
                  <span data-hero-reveal className="opacity-0">
                    {dictionary.hero.titleAccent}
                  </span>
                </span>
              </h1>
            </div>

            <div className="grid gap-8 lg:pb-3">
              <div className="reveal-line">
                <p
                  data-hero-reveal
                  className="max-w-xl text-lg leading-8 text-muted-foreground opacity-0 md:text-xl"
                >
                  {dictionary.hero.description}
                </p>
              </div>
              <div className="reveal-line">
                <div
                  data-hero-reveal
                  className="flex flex-wrap gap-3 opacity-0"
                >
                  <Button asChild size="lg">
                    <a href="#work">
                      {dictionary.hero.viewWork}
                      <ArrowDown className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="#contact">{dictionary.hero.contact}</a>
                  </Button>
                </div>
              </div>
              <div className="reveal-line">
                <div
                  data-hero-reveal
                  className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground opacity-0"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                  {dictionary.hero.availability}
                </div>
              </div>
            </div>
          </div>
          <a
            href="#position"
            className="absolute bottom-10 right-0 hidden items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground xl:flex"
          >
            {dictionary.hero.scroll}
            <span className="grid size-9 place-items-center rounded-full border border-border">
              <ArrowDown className="size-3" />
            </span>
          </a>
        </section>

        <section
          id="position"
          data-scene="position"
          className="page-shell section-pad min-h-[110vh]"
        >
          <div data-reveal-group className="grid gap-14 lg:grid-cols-12">
            <p
              data-reveal
              className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent opacity-0 lg:col-span-3"
            >
              {dictionary.statement.eyebrow}
            </p>
            <div className="lg:col-span-9">
              <p
                data-reveal
                className="text-balance text-[clamp(2.7rem,7vw,7rem)] font-semibold leading-[0.94] tracking-[-0.065em] opacity-0"
              >
                {dictionary.statement.lineOne}
                <span className="block text-muted-foreground">
                  {dictionary.statement.lineTwo}
                </span>
              </p>
              <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.4fr]">
                <div />
                <p
                  data-reveal
                  className="max-w-2xl text-lg leading-8 text-muted-foreground opacity-0"
                >
                  {dictionary.statement.description}
                </p>
              </div>
              <div className="mt-20 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
                {dictionary.statement.metrics.map((metric) => (
                  <div data-reveal className="opacity-0" key={metric.label}>
                    <p className="text-5xl font-semibold tracking-[-0.06em]">
                      {metric.value}
                    </p>
                    <p className="mt-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" data-scene="work" className="page-shell section-pad">
          <SectionHeading
            eyebrow={dictionary.projects.eyebrow}
            title={dictionary.projects.title}
          />
          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            {dictionary.projects.items.map((project, index) => (
              <div
                key={project.slug}
                className={index === 0 ? "lg:col-span-2" : ""}
              >
                <ProjectCard
                  project={project}
                  action={dictionary.projects.view}
                />
              </div>
            ))}
          </div>
        </section>

        <section
          id="approach"
          data-scene="approach"
          className="page-shell section-pad"
        >
          <SectionHeading
            eyebrow={dictionary.approach.eyebrow}
            title={dictionary.approach.title}
          />
          <div data-reveal-group className="mt-20 border-t border-border">
            {dictionary.approach.items.map((item) => (
              <article
                data-reveal
                key={item.number}
                className="group grid gap-6 border-b border-border py-10 opacity-0 md:grid-cols-[5rem_1fr_1.2fr]"
              >
                <span className="font-mono text-[0.65rem] text-accent">
                  / {item.number}
                </span>
                <h3 className="text-3xl font-semibold tracking-[-0.045em] transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                  {item.title}
                </h3>
                <p className="max-w-xl leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" data-scene="stack" className="section-pad overflow-hidden">
          <div className="page-shell grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow={dictionary.stack.eyebrow}
              title={dictionary.stack.title}
            />
            <p className="max-w-xl self-end text-lg leading-8 text-muted-foreground">
              {dictionary.stack.description}
            </p>
          </div>
          <div className="mt-20 border-y border-border bg-surface/40 py-8 backdrop-blur-sm">
            <div className="marquee">
              {stackLoop.map((technology, index) => (
                <div
                  key={`${technology}-${index}`}
                  className="flex items-center gap-8 pr-8"
                >
                  <span className="whitespace-nowrap text-[clamp(2.5rem,6vw,6rem)] font-semibold tracking-[-0.06em]">
                    {technology}
                  </span>
                  <span className="size-3 rotate-45 bg-accent" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          data-scene="contact"
          className="page-shell flex min-h-[95vh] flex-col justify-end pb-8 pt-36"
        >
          <div data-reveal-group>
            <Badge data-reveal className="mb-8 opacity-0">
              {dictionary.contact.eyebrow}
            </Badge>
            <h2
              data-reveal
              className="max-w-6xl text-balance text-[clamp(3.4rem,9vw,9rem)] font-semibold leading-[0.88] tracking-[-0.075em] opacity-0"
            >
              {dictionary.contact.title}
            </h2>
            <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-end">
              <p
                data-reveal
                className="max-w-xl text-lg leading-8 text-muted-foreground opacity-0"
              >
                {dictionary.contact.description}
              </p>
              <div data-reveal className="opacity-0 lg:text-right">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group inline-flex max-w-full items-center gap-3 border-b border-foreground pb-2 text-[clamp(1.5rem,4vw,3.5rem)] font-semibold tracking-[-0.05em]"
                >
                  <span className="truncate">{dictionary.contact.email}</span>
                  {copied ? (
                    <Check className="size-[0.7em] shrink-0 text-accent" />
                  ) : (
                    <Copy className="size-[0.55em] shrink-0 transition-transform group-hover:-translate-y-1" />
                  )}
                </button>
                <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {copied ? dictionary.contact.copied : dictionary.contact.copy}
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-24">
            <Separator />
            <div className="flex flex-col gap-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Egor Fogel</p>
              <p>{dictionary.footer}</p>
              <a
                href="#top"
                className="inline-flex items-center gap-2 text-foreground"
              >
                Back to top
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
