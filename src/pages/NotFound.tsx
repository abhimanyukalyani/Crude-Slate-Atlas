import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[52vh] max-w-[1180px] flex-col justify-center px-6 py-16">
      <div className="eyebrow">404</div>
      <h1 className="mt-3 max-w-[18ch] text-[clamp(28px,4vw,44px)] font-bold leading-tight tracking-[-0.025em]">
        That barrel has nowhere to land.
      </h1>
      <p className="prose-editorial mt-4">
        The page you asked for is not in the atlas. Try the full dataset, or start again from the
        top.
      </p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Link
          to="/atlas"
          className="rounded-lg bg-accent px-4 py-2.5 text-[14px] font-semibold text-on-accent no-underline"
        >
          Open the atlas
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-rule px-4 py-2.5 text-[14px] font-semibold text-ink no-underline hover:border-accent-line"
        >
          Back to the front
        </Link>
      </div>
    </div>
  )
}
