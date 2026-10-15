import Image from "next/image";

export default function SterlingTrustLogo({ className = "" }) {
  return (
    <>
      <Image
        src="/logo-white.png"
        alt="Sterling Trust logo"
        width={64}
        height={64}
        className={`hidden md:block ${className}`}
      />
      <Image
        src="/logo-blue.png"
        alt="Sterling Trust logo"
        width={64}
        height={64}
        className={`block md:hidden ${className}`}
      />
    </>
  );
}