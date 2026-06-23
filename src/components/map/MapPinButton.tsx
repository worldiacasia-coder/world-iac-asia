"use client";

import Image from "next/image";
import type { MapPin } from "@/data/map-pins";

type Props = {
  pin: MapPin;
  isHovered: boolean;
  isActive: boolean;
  hasOrg: boolean;
  ariaLabel: string;
  onHover: (id: string | null) => void;
  onClick: () => void;
};

export default function MapPinButton({
  pin,
  isHovered,
  isActive,
  hasOrg,
  ariaLabel,
  onHover,
  onClick,
}: Props) {
  const size = pin.id === "vietnam" ? "5.5%" : "4.2%";

  return (
    <button
      type="button"
      style={{
        left: pin.left,
        top: pin.top,
        width: size,
      }}
      className={`pointer-events-auto absolute z-10 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 bg-white shadow-[0_3px_12px_rgba(0,0,0,0.35)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
        hasOrg ? "cursor-pointer" : "cursor-default"
      } ${
        isHovered || isActive
          ? "scale-110 border-brand-gold shadow-[0_0_0_4px_rgba(197,160,89,0.55),0_4px_16px_rgba(0,0,0,0.4)]"
          : hasOrg
            ? "border-white/80 hover:border-brand-gold hover:shadow-[0_0_0_3px_rgba(197,160,89,0.4)]"
            : "border-white/60"
      }`}
      onMouseEnter={() => onHover(pin.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(pin.id)}
      onBlur={() => onHover(null)}
      onClick={onClick}
      aria-label={ariaLabel}
      title={pin.label}
      data-pin-id={pin.id}
    >
      <Image
        src={pin.flagUrl}
        alt={pin.countryName}
        fill
        sizes="48px"
        className="object-cover"
      />
    </button>
  );
}
