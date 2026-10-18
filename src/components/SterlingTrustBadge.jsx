import Image from "next/image";

// Renders the wordmark as solid white (no card/box) so it reads cleanly on
// navy or photo backgrounds without needing a separate white-logo asset.
export default function SterlingTrustBadge({ className = "h-7", wrapperClassName = "" }) {
  return (
    <span className={`inline-flex items-center shrink-0 ${wrapperClassName}`}>
      <Image
        src="/sterling-trust-wordmark.png"
        alt="Sterling Trust"
        width={160}
        height={53}
        className={`w-auto brightness-0 invert ${className}`}
      />
    </span>
  );
}
