import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { HomeSectionLink } from "@/components/ui/home-section-link";
import { Grid12 } from "@/components/ui/section";
import { findProject, PROJECTS } from "@/lib/content";
import { ordinal } from "@/lib/utils";

const CTA =
  "inline-flex min-h-11 items-center rounded-full px-6.5 py-3.5 text-cta-sm";

const COLUMN_HEADING =
  "font-mono text-eyebrow-xs font-medium text-muted uppercase md:text-eyebrow";

const COLUMN_BODY =
  "mt-4.5 text-body-xs font-light text-ink text-pretty md:text-body-sm";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.lead,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.name,
      description: project.lead,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((entry) => entry.slug === project.slug);

  return (
    <main className="relative min-h-screen">
      <div aria-hidden="true" className="case-glow absolute inset-0" />

      <div className="relative mx-auto max-w-page px-4.5 py-9.5 md:px-8 md:py-16 lg:px-gutter lg:pt-13 lg:pb-section">
        <div className="flex items-center justify-between font-mono text-eyebrow-xs font-medium text-muted uppercase md:text-eyebrow">
          <HomeSectionLink
            section="work"
            className="inline-flex min-h-11 items-center px-1 transition-colors duration-200 hover:text-ink"
          >
            ← Back to work
          </HomeSectionLink>
          <span className="text-accent">{`Case study ${ordinal(index)}`}</span>
        </div>

        <Grid12 className="mt-18 gap-y-7.5">
          <div className="lg:col-span-8 lg:col-start-1">
            <p className="font-mono text-eyebrow-xs font-medium text-accent uppercase md:text-eyebrow">
              {project.kind}
            </p>
            <h1 className="mt-5.5 text-case-sm font-light text-ink md:text-case-md lg:text-case">
              {project.name}
            </h1>
            <p className="mt-6.5 max-w-lead text-body-xs font-light text-ink text-pretty md:text-lead-sm">
              {project.lead}
            </p>

            <div className="mt-9 flex flex-col gap-3 xs:flex-row">
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className={`${CTA} justify-center bg-accent font-medium text-ground transition duration-200 hover:brightness-105`}
              >
                View on GitHub
              </a>
              <CopyLinkButton
                className={`${CTA} cursor-pointer justify-center border border-line font-normal text-ink transition-colors duration-200 hover:border-accent hover:bg-elevated`}
              />
            </div>
          </div>

          <aside className="rounded-card border border-line bg-surface px-5.5 py-6 md:px-8 md:py-7.5 lg:col-span-4 lg:col-start-9">
            <h2 className={COLUMN_HEADING}>Stack</h2>
            <ul className="mt-5 flex flex-wrap gap-2.25">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-elevated px-4 font-mono text-pill font-medium text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div aria-hidden="true" className="my-6.5 h-px bg-line" />

            <h2 className={COLUMN_HEADING}>Focus</h2>
            <p className="mt-4 text-body-xs font-light text-ink md:text-copy-lg">
              {project.focus}
            </p>
          </aside>
        </Grid12>

        <div aria-hidden="true" className="mt-9.5 h-px bg-line md:mt-14 lg:mt-21" />

        <Grid12 className="gap-y-7.5 pt-7.5 md:pt-10 lg:pt-13">
          <section className="lg:col-span-4 lg:col-start-1">
            <h2 className={COLUMN_HEADING}>Objective</h2>
            <p className={COLUMN_BODY}>{project.objective}</p>
          </section>
          <section className="lg:col-span-4 lg:col-start-5">
            <h2 className={COLUMN_HEADING}>Solution</h2>
            <p className={COLUMN_BODY}>{project.solution}</p>
          </section>
          <section className="lg:col-span-4 lg:col-start-9">
            <h2 className={COLUMN_HEADING}>My contribution</h2>
            <p className={COLUMN_BODY}>{project.contribution}</p>
          </section>
        </Grid12>
      </div>
    </main>
  );
}
