"use client";

import { animate, stagger } from "animejs";
import { ArrowDown, ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { usePreferences } from "@/features/preferences/preferences-provider";
import { Separator } from "@/shared/ui/separator";
import { DigitalCore } from "@/widgets/digital-core";
import { SiteHeader } from "@/widgets/site-header";

export function HomePage() {
  const { dictionary } = usePreferences();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    animate("[data-hero-line]", {
      y: ["115%", "0%"],
      rotate: [2, 0],
      delay: stagger(110, { start: 120 }),
      duration: 1250,
      ease: "outExpo",
    });
    animate("[data-hero-meta]", {
      opacity: [0, 1],
      y: [18, 0],
      delay: stagger(90, { start: 720 }),
      duration: 900,
      ease: "outExpo",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          animate(element.querySelectorAll("[data-reveal]"), {
            y: [55, 0],
            opacity: [0, 1],
            delay: stagger(75),
            duration: 1050,
            ease: "outExpo",
          });
          observer.unobserve(element);
        });
      },
      { threshold: 0.15 },
    );

    document
      .querySelectorAll("[data-reveal-group]")
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
        <section className="hero page-shell" data-scene="hero">
          <div className="hero__topline" data-hero-meta>
            <span>EGOR FOGEL®</span>
            <span>{dictionary.hero.eyebrow}</span>
            <span>55.0084° N / 82.9357° E</span>
          </div>

          <div className="hero__title" aria-label="Senior Frontend Engineer">
            <div className="hero__line">
              <span data-hero-line>FRONTEND</span>
            </div>
            <div className="hero__line hero__line--offset">
              <span data-hero-line>ENGINEER</span>
            </div>
          </div>

          <div className="hero__bottom">
            <p data-hero-meta className="hero__index">
              00—06
              <span>{dictionary.hero.availability}</span>
            </p>
            <p data-hero-meta className="hero__description">
              {dictionary.hero.description}
            </p>
            <div data-hero-meta className="hero__actions">
              <a href="#work" className="text-link">
                {dictionary.hero.viewWork}
                <ArrowDown />
              </a>
              <a href="#contact" className="text-link text-link--muted">
                {dictionary.hero.contact}
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section
          id="position"
          className="manifest page-shell"
          data-scene="position"
          data-reveal-group
        >
          <div className="section-label" data-reveal>
            <span>01</span>
            <span>{dictionary.statement.eyebrow.replace(/^01\s*\/\s*/, "")}</span>
          </div>
          <p className="manifest__copy" data-reveal>
            <span>{dictionary.statement.lineOne}</span>
            <strong>{dictionary.statement.lineTwo}</strong>
          </p>
          <div className="manifest__footer">
            <p data-reveal>{dictionary.statement.description}</p>
            <div className="manifest__metrics" data-reveal>
              {dictionary.statement.metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="work" data-scene="work">
          <header className="work__header page-shell" data-reveal-group>
            <div className="section-label" data-reveal>
              <span>02</span>
              <span>{dictionary.projects.eyebrow.replace(/^02\s*\/\s*/, "")}</span>
            </div>
            <h2 data-reveal>{dictionary.projects.title}</h2>
          </header>

          <div className="cases">
            {dictionary.projects.items.map((project, index) => (
              <article
                className={`case case--${project.visual}`}
                key={project.slug}
                data-reveal-group
              >
                <div className="case__visual" aria-hidden="true">
                  <div className="case__grid" />
                  <div className="case__signal">
                    {Array.from({ length: 7 }, (_, line) => (
                      <span key={line} style={{ "--line": line } as React.CSSProperties} />
                    ))}
                  </div>
                  <div className="case__target">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="case__visual-code">SYS.0{index + 1}</span>
                </div>
                <div className="case__content page-shell">
                  <div className="case__number" data-reveal>
                    / {project.index}
                  </div>
                  <div className="case__main">
                    <p data-reveal>{project.role}</p>
                    <h3 data-reveal>{project.title}</h3>
                    <p data-reveal className="case__description">
                      {project.description}
                    </p>
                  </div>
                  <div className="case__meta" data-reveal>
                    <span>{project.year}</span>
                    <span>{project.technologies.join(" / ")}</span>
                    <a href={project.href}>
                      {dictionary.projects.view}
                      <ArrowUpRight />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="approach"
          className="approach page-shell"
          data-scene="approach"
          data-reveal-group
        >
          <div className="section-label" data-reveal>
            <span>03</span>
            <span>{dictionary.approach.eyebrow.replace(/^03\s*\/\s*/, "")}</span>
          </div>
          <h2 data-reveal>{dictionary.approach.title}</h2>
          <div className="approach__list">
            {dictionary.approach.items.map((item) => (
              <article key={item.number} data-reveal>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ArrowUpRight />
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="stack" data-scene="stack">
          <div className="stack__intro page-shell" data-reveal-group>
            <div className="section-label" data-reveal>
              <span>04</span>
              <span>{dictionary.stack.eyebrow.replace(/^04\s*\/\s*/, "")}</span>
            </div>
            <h2 data-reveal>{dictionary.stack.title}</h2>
            <p data-reveal>{dictionary.stack.description}</p>
          </div>
          <div className="stack__marquee" aria-label={dictionary.stack.technologies.join(", ")}>
            <div>
              {stackLoop.map((technology, index) => (
                <span key={`${technology}-${index}`}>
                  {technology}
                  <i>✳</i>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="contact page-shell"
          data-scene="contact"
          data-reveal-group
        >
          <div className="section-label" data-reveal>
            <span>05</span>
            <span>{dictionary.contact.eyebrow.replace(/^05\s*\/\s*/, "")}</span>
          </div>
          <h2 data-reveal>{dictionary.contact.title}</h2>
          <div className="contact__bottom">
            <p data-reveal>{dictionary.contact.description}</p>
            <button type="button" onClick={copyEmail} data-reveal>
              <span>{dictionary.contact.email}</span>
              {copied ? <Check /> : <Copy />}
              <small>
                {copied ? dictionary.contact.copied : dictionary.contact.copy}
              </small>
            </button>
          </div>

          <footer>
            <Separator />
            <div>
              <span>© {new Date().getFullYear()} EGOR FOGEL</span>
              <span>{dictionary.footer}</span>
              <a href="#top">
                TOP <ArrowUpRight />
              </a>
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
