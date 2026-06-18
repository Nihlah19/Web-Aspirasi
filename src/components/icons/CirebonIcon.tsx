interface CirebonIconProps {
  className?: string;
  size?: number;
}

export function CirebonIcon({ className = "", size = 24 }: CirebonIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Mega Mendung cloud motif (Cirebon batik) */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 30c0-7 6-12 13-12 4 0 7 1 9 3 2-2 5-3 9-3 7 0 13 5 13 12 0 6-5 11-11 11H12z" />
        <path d="M16 44c0-5 4-9 10-9 3 0 6 1 8 2 2-1 5-2 8-2 6 0 10 4 10 9 0 5-4 8-9 8H16z" />
      </g>

      {/* Sun emblem behind clouds */}
      <circle cx="48" cy="20" r="6" fill="currentColor" opacity="0.9" />

      {/* Ground / base line */}
      <line
        x1="10"
        y1="54"
        x2="54"
        y2="54"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
