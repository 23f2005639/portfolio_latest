import type { SVGProps } from "react";

// Small inline icons sized to the text (1em). Thin square-ended strokes to sit next to Arial.
type Props = SVGProps<SVGSVGElement>;

const Stroke = ({ children, ...props }: Props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="square" aria-hidden="true" {...props}>
    {children}
  </svg>
);

export const ArrowUpRight = (props: Props) => <Stroke {...props}><path d="M7 17 17 7M8 7h9v9" /></Stroke>;

export const ArrowDown = (props: Props) => <Stroke {...props}><path d="M12 4v16M5 13l7 7 7-7" /></Stroke>;

export const FileText = (props: Props) => (
  <Stroke {...props}><path d="M14 3H6v18h12V7zM14 3v4h4M9 12h6M9 16h6" /></Stroke>
);

export const GitHub = (props: Props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export const LinkedIn = (props: Props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

export const Kaggle = (props: Props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M6 2.5h3.2v9.1l5.6-5.9h3.9l-6.2 6.3 6.6 9.5h-3.8l-4.9-7.1-1.2 1.2v5.9H6Z" />
  </svg>
);

// the hugging face: a smiling face with two hands
export const HuggingFace = (props: Props) => (
  <Stroke {...props}><circle cx="12" cy="11" r="8" /><path d="M9 9.5v.5M15 9.5v.5M8.8 13c1.4 1.9 5 1.9 6.4 0M3.5 18.5 7 16M20.5 18.5 17 16" /></Stroke>
);

export const Mail = (props: Props) => <Stroke {...props}><path d="M3 5.5h18v13H3zM3.5 6l8.5 7 8.5-7" /></Stroke>;
