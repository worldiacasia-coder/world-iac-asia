import Image from "next/image";
import { headerFlags } from "@/data/header-flags";

type Props = {
  title: string;
  subtitle: string;
};

/** Vị trí cờ trên elip 16:5 — tỉ lệ % từ tâm khung */
function flagPosition(index: number, total: number) {
  const angleDeg = (index / total) * 360 - 90;
  const rad = (angleDeg * Math.PI) / 180;
  const rx = 40;
  const ry = 34;
  return {
    left: `${50 + rx * Math.cos(rad)}%`,
    top: `${50 + ry * Math.sin(rad)}%`,
    rotate: `${angleDeg + 90}deg`,
  };
}

export default function MapNetworkHero({ title, subtitle }: Props) {
  return (
    <div className="relative aspect-[16/5] w-full min-h-[200px] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/50 sm:min-h-[240px] md:min-h-[300px] lg:min-h-[340px]">
      {/* Logo IAC giữa — nền chìm */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-[58%] max-h-[220px] w-[28%] max-w-[320px] opacity-[0.13]">
          <Image
            src="/images/world-iac-asia-logo.png"
            alt=""
            fill
            priority
            className="object-contain"
            sizes="320px"
            aria-hidden
          />
        </div>
      </div>

      {/* Vòng cờ quốc gia xung quanh */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {headerFlags.map((flag, index) => {
          const pos = flagPosition(index, headerFlags.length);
          return (
            <div
              key={flag.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
            >
              <div
                className="relative h-7 w-10 overflow-hidden rounded-sm opacity-35 shadow-sm ring-1 ring-black/5 sm:h-9 sm:w-12 md:h-10 md:w-14 lg:h-11 lg:w-16"
                style={{ transform: `rotate(${pos.rotate})` }}
              >
                <Image
                  src={flag.flagUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lớp mờ để chữ nổi rõ trên nền chìm */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />

      {/* Nội dung chính */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-10 text-center md:px-10">
        <p className="section-label">WORLD IAC ASIA</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-gray-900 md:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-0.5 w-12 bg-brand-gold" />
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
