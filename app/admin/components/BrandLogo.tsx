
import Image from "next/image";
import Link from "next/link";

export default function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="PhoneBhai Home"
      className="inline-flex items-center shrink-0"
    >
      <Image
        src="/logo.png"
        alt="PhoneBhai"
        width={320}
        height={100}
        priority
        className="
          h-16 w-auto
          md:h-18
          lg:h-16
          xl:h-[100px]
          object-contain
          bg-transparent
        "
      />
    </Link>
  );
}
