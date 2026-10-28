import type { SVGProps } from "react";

export type IconName =
  | "home" | "cube" | "room" | "bolt" | "build" | "sld" | "gauge" | "layers" | "alert" | "calc" | "award"
  | "globe" | "menu" | "close" | "check" | "x" | "info" | "play" | "pause" | "reset" | "eye" | "eyeOff"
  | "explode" | "shield" | "fire" | "lock" | "chevron" | "target" | "fan" | "list" | "search" | "hint"
  | "print" | "arrow" | "lightbulb" | "warning" | "hardhat";

const paths: Record<IconName, JSX.Element> = {
  home: <path d="M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10" />,
  cube: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M12 12 20 7.5M12 12 4 7.5M12 12v9" />
    </>
  ),
  room: (
    <>
      <path d="M3 20V8l9-5 9 5v12H3Z" />
      <rect x="7" y="12" width="6" height="5" rx=".5" />
      <path d="M16 12h2M16 15h2M9.5 12V10" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  build: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />
    </>
  ),
  sld: (
    <>
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M6 7.5V11h12V7.5M12 11v4M8 15h8M8 15v5M12 15v5M16 15v5" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-6" />
      <circle cx="12" cy="17" r="1.3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  alert: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M12 8v4M12 14.5v.01M8 21h8M12 17v4" />
    </>
  ),
  calc: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11v.01M8 15h2M12 15h2M8 18h2M12 18h2M16 15v3" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" />
      <path d="m10 9 1.5 1.5L14.5 7.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  x: <path d="M7 7l10 10M17 7 7 17" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.01" />
    </>
  ),
  play: <path d="M7 5v14l12-7L7 5Z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  reset: (
    <>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4v4h4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4.9-1.3" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  explode: (
    <>
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M4 4l3 3M20 4l-3 3M4 20l3-3M20 20l-3-3M4 4h3M4 4v3M20 4h-3M20 4v3M4 20h3M4 20v-3M20 20h-3M20 20v-3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  fire: <path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5.5 1-8.5Z" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  fan: (
    <>
      <circle cx="12" cy="12" r="1.8" />
      <path d="M12 10.2C11 6 13 3 15.5 4.5S14 9 12 10.2ZM13.8 12c4.2-1 7.2 1 5.7 3.5S15 14 13.8 12ZM12 13.8c1 4.2-1 7.2-3.5 5.7S10 15 12 13.8ZM10.2 12C6 13 3 11 4.5 8.5S9 10 10.2 12Z" />
    </>
  ),
  list: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  hint: (
    <>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="7" y="14" width="10" height="7" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  lightbulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />,
  warning: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17v.01" />
    </>
  ),
  hardhat: (
    <>
      <path d="M3 18h18M5 18v-3a7 7 0 0 1 14 0v3" />
      <path d="M10 8V5h4v3" />
    </>
  ),
};

export function Icon({ name, className = "h-5 w-5", ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
