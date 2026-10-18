# Ishaan Dhawan — Portfolio

A terminal-driven personal portfolio. The whole site can be browsed either as a normal
page or through an in-page shell (`` ` `` to dock it, `⌘K` / `Ctrl+K` for full screen).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion · lucide-react.
Fully static — `next build` prerenders everything.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start
```

## Where the content lives

All copy is data, not markup. Edit these and the page + terminal both update:

| File | What it holds |
| --- | --- |
| `lib/data/profile.ts` | name, headline, links, summary, availability, education |
| `lib/data/experience.ts` | roles, dates, bullet points, per-role stack |
| `lib/data/projects.ts` | every project: problem, what I built, architecture, contribution, metrics, tech, repo/demo links |
| `lib/data/stack.ts` | skill groups + what I'm levelling up on |
| `lib/data/architecture.ts` | flow diagrams (currently only used by the `arch` terminal command) |
| `lib/terminal/commands.ts` | the shell: add a command by adding an object to `commands` |

### Placeholders to fill in

- `lib/data/projects.ts` — repos are `null` with a `// [ADD GITHUB LINK]` comment where a
  public repository could be linked. Closed-source work is marked `closedSource: true`.
- `NEXT_PUBLIC_SITE_URL` — set it at build time once the domain is live; it drives
  canonical URLs, `sitemap.xml`, `robots.txt` and the OG image. Default is a placeholder
  in `app/layout.tsx`, `app/sitemap.ts` and `app/robots.ts`.
- `public/resume.pdf` — replace when the resume is updated.

## The terminal

See [TERMINAL.md](TERMINAL.md) for the full command reference.

`lib/terminal/commands.ts` is the registry. Each command gets `(args, ctx)`, where `ctx`
can scroll the page, open a project modal, open URLs and toggle effects — so a command can
drive the GUI and vice versa (the GUI dispatches `portfolio:run` events).

Supports tab completion, ghost-text suggestions, `↑`/`↓` history, `Ctrl+L` clear and `Esc`.

## Deploy

Any static-friendly host. On Vercel: import the repo, set `NEXT_PUBLIC_SITE_URL`, done.

## Deploying to Netlify (free tier)

The free plan covers this site comfortably (100 GB bandwidth and 300 build minutes a month).

1. Push the repo to GitHub.
2. Netlify → **Add new site → Import an existing project** → pick the repo.
3. Leave the build settings alone — `netlify.toml` already sets the command, the publish
   directory and the `@netlify/plugin-nextjs` runtime, which Netlify installs for you.
4. After the first deploy, set `NEXT_PUBLIC_SITE_URL` to the live URL under
   **Site settings → Environment variables**, then redeploy so canonical URLs,
   `sitemap.xml` and `robots.txt` point at the real domain.

Every push to the default branch redeploys; pull requests get preview URLs.

A custom domain (e.g. `ishaandhawan.dev`) is free to attach on Netlify, with free HTTPS —
you only pay the registrar for the domain itself.
