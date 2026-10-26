const paths = {
  "arrow-up": "M5 19 19 5M5 5h14v14",
  "arrow-right": "M4 12h16m-7-7 7 7-7 7",
  "arrow-left": "M20 12H4m7-7-7 7 7 7",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m5 5 14 14M19 5 5 19",
  star: "M12 2v20M2 12h20M5 5l14 14M5 19 19 5",
  check: "m5 12 5 5L20 7",
  undo: "M4 9h10a5 5 0 0 1 0 10h-3M4 9l5-5M4 9l5 5",
  moon: "M20 15a8 8 0 0 1-11-11 8 8 0 1 0 11 11Z",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  search: "M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0m-2 5 6 6",
}
export function Icon({
  name,
  className = "",
}: {
  name: keyof typeof paths
  className?: string
}) {
  return (
    <svg
      className={`icon ${className}`}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}
