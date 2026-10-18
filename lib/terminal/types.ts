export type Tone = "out" | "dim" | "accent" | "ok" | "warn" | "err" | "head" | "in";

export type Line = {
  id: string;
  tone: Tone;
  text: string;
  /** Renders the line as a link. */
  href?: string;
  /** Renders the line as a clickable command suggestion. */
  run?: string;
  /** Skips the typewriter effect for this line. */
  instant?: boolean;
};

export type CommandContext = {
  goto: (sectionId: string) => boolean;
  /** The section currently in view. */
  current: () => string;
  openProject: (slug: string) => boolean;
  clear: () => void;
  close: () => void;
  maximize: () => void;
  setEffect: (effect: "none" | "matrix" | "scan") => void;
  openUrl: (url: string) => void;
  history: string[];
  sections: string[];
};

export type CommandResult = Omit<Line, "id">[];

export type Command = {
  name: string;
  args?: string;
  desc: string;
  group: "navigate" | "read" | "system" | "fun";
  hidden?: boolean;
  complete?: (ctx: CommandContext) => string[];
  run: (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult>;
};
