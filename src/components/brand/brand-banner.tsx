import Image from "next/image";
import Link from "next/link";

export default function BrandBanner() {
  return (
    <div className="w-full flex justify-center py-4">
      <Link href="/" aria-label="Mana Home">
        <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} priority />
      </Link>
    </div>
  );
}


