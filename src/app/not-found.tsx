import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-page px-4.5 py-9.5 md:px-8 md:py-16 lg:px-gutter lg:py-section">
        <p className="font-mono text-eyebrow-xs font-medium text-accent uppercase md:text-eyebrow">
          404
        </p>
        <h1 className="mt-5.5 text-display-sm font-extralight text-ink md:text-display-md">
          Nothing here.
        </h1>
        <p className="mt-6.5 max-w-lead text-body-xs font-light text-muted md:text-lead">
          That page does not exist. The work, the stack and the rest of it are
          back on the home page.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex min-h-11 items-center rounded-full bg-accent px-8.5 py-4 text-cta font-medium text-ground transition duration-200 hover:brightness-105"
        >
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
