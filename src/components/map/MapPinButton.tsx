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
  const size = pin.id === "vietnam" ? "5.2%" : "4.8%";

  return (
    <button
      type="button"
      style={{
        left: pin.left,
        top: pin.top,
        width: size,
      }}
      className={`pointer-events-auto absolute z-10 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
        hasOrg ? "cursor-pointer" : "cursor-default"
      } ${
        isHovered || isActive
          ? "scale-125 shadow-[0_0_0_5px_white,0_0_0_7px_rgba(197,160,89,0.8),0_4px_12px_rgba(0,0,0,0.4)]"
          : hasOrg
            ? "shadow-[0_0_0_4px_white,0_0_0_5px_rgba(180,180,180,0.5),0_2px_8px_rgba(0,0,0,0.3)] hover:scale-110 hover:shadow-[0_0_0_5px_white,0_0_0_7px_rgba(197,160,89,0.6)]"
            : "shadow-[0_0_0_4px_white,0_0_0_5px_rgba(180,180,180,0.4)] opacity-80"
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
