import Image from "next/image";
import { headerFlags } from "@/data/header-flags";

type Props = {
  className?: string;
};

export default function HeaderFlagStrip({ className = "" }: Props) {
  return (
    <div
      className={`flex w-full max-w-5xl items-center justify-evenly gap-2 px-2 sm:gap-3 ${className}`}
      aria-hidden="true"
    >
      {headerFlags.map((flag) => (
        <span
          key={flag.id}
          className="relative block h-5 w-8 shrink-0 overflow-hidden rounded-sm border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_2px_6px_rgba(15,23,42,0.05)] sm:h-6 sm:w-10"
        >
          <Image
            src={flag.flagUrl}
            alt={flag.name}
            fill
            sizes="40px"
            className="object-cover"
            unoptimized={flag.flagUrl.endsWith(".svg")}
          />
        </span>
      ))}
    </div>
  );
}
