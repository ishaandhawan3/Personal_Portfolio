# The terminal — what it can do

A quick reference for the shell built into the site. Nothing here is a real system: every
command reads from `lib/data/*` and can drive the page (scroll to a section, open a project).

## Opening it

| Key / action | Result |
| --- | --- |
| `` ` `` (backtick) | toggle the small docked terminal, bottom-right |
| `⌘K` / `Ctrl+K` | toggle it full screen |
| "open terminal" button | bottom-right when it's closed |
| "terminal" button in the nav | full screen |
| `Esc` | full screen → docked → closed |

On a phone the dock spans the full width and the chip row above the prompt runs the common
commands by tap, so nothing needs typing.

## Typing in it

| Key | Result |
| --- | --- |
| `Tab` | complete the command, or its argument (project slugs, section names, skill groups) |
| `→` | accept the grey ghost-text suggestion at the end of the line |
| `↑` / `↓` | walk back and forward through this session's history |
| `Ctrl+L` | clear the screen |
| `Enter` | run |

Grey lines in the output are often clickable — they run the command they name.

## Commands

### Navigate — these move the page

| Command | What it does |
| --- | --- |
| `ls` | list the page sections |
| `ls projects` | list every project with its year and kind |
| `cd <section>` | scroll to `about`, `experience`, `projects`, `stack` or `contact` |
| `cd ..` | step up one section |
| `cd -` | go back to where you were |
| `cd ~` | back to the top |
| `open <project>` | open a project's full case study modal |
| `tree` | the whole site at a glance |
| `github` · `linkedin` · `email` | open the matching link |

`open` and `cat` match on partial names — `open dionce` is enough.

### Read — these print into the terminal

| Command | What it does |
| --- | --- |
| `whoami` | role, location, current job, focus, degree |
| `about` | the longer intro (also scrolls to About) |
| `experience` | full work history; `experience 1` for just the current role |
| `skills` | the stack, grouped |
| `skills <group>` | one group in full — `genai`, `ml`, `backend`, `data`, `infra`, `realtime`, `tools` |
| `cat <project>` | the whole case study as text: problem, what I built, architecture, contribution, metrics, caveats, tech |
| `arch` | list the architecture diagrams |
| `arch <id>` | print one — `voice`, `rag` or `idp` |
| `contact` | email, LinkedIn, GitHub, location |
| `resume` | open `resume.pdf` |

`arch` is terminal-only now that the Architecture section is off the page — the diagrams
still live in `lib/data/architecture.ts`.

### System

| Command | What it does |
| --- | --- |
| `help` | list every documented command |
| `man <command>` | one command's signature and description |
| `history` | everything typed this session |
| `clear` | clear the screen |
| `neofetch` | the ASCII profile card |
| `pwd` · `date` · `uname` · `echo` | what you'd expect |
| `exit` | close the terminal |

### Undocumented

`help` hides a few: `sudo`, `matrix` (and `matrix off`), `vim`, `coffee`, and `rm -rf /`.
Unknown commands suggest a near match rather than just failing.

## Adding a command

Append an object to `commands` in [lib/terminal/commands.ts](lib/terminal/commands.ts):

```ts
{
  name: "blog",
  desc: "recent writing",
  group: "read",             // navigate · read · system · fun
  hidden: false,             // true keeps it out of `help`
  complete: () => ["latest"], // optional Tab completions for the argument
  run: (args, ctx) => [
    { tone: "accent", text: "Writing" },
    { tone: "out", text: "…" },
  ],
}
```

`tone` picks the colour: `out`, `dim`, `accent`, `ok`, `warn`, `err`, `head`. A line can
also carry `href` to render as a link, or `run` to render as a clickable command.
`ctx` gives you `goto`, `current`, `openProject`, `openUrl`, `clear`, `close` and `history`.
