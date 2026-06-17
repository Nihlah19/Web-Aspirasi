interface CirebonIconProps {
  className?: string;
  size?: number;
}

export function CirebonIcon({ className = "", size = 500 }: CirebonIconProps) {
  return (
    <img src="/favicon.png" alt="Cirebon Icon" width={size} height={size} className={className} />
  );
}
