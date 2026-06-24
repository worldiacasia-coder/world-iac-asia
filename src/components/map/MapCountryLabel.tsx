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

function parsePercent(value: string): number {
  return Number.parseFloat(value) / 100;
}

export default function MapCountryLabel({
  pin,
  isHovered,
  isActive,
  hasOrg,
  ariaLabel,
  onHover,
  onClick,
}: Props) {
  const target = pin.lineTarget;
  if (!target) return null;

  const flagX = parsePercent(pin.left) * 100;
  const flagY = parsePercent(pin.top) * 100;
  const islandX = parsePercent(target.left) * 100;
  const islandY = parsePercent(target.top) * 100;

  const dx = islandX - flagX;
  const dy = islandY - flagY;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const labelEdge = 2.3;
  const lineStartX = flagX + ux * labelEdge;
  const lineStartY = flagY + uy * labelEdge;
  const lineEndX = islandX - ux * 0.35;
  const lineEndY = islandY - uy * 0.35;

  const highlighted = isHovered || isActive;
  const lineColor = highlighted ? "#1e4f8f" : "#1a1a1a";

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 z-[4] h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1={lineStartX}
          y1={lineStartY}
          x2={lineEndX}
          y2={lineEndY}
          stroke={lineColor}
          strokeWidth="0.12"
          strokeLinecap="round"
        />
      </svg>

      <div
        className="pointer-events-none absolute z-[6]"
        style={{
          left: pin.left,
          top: pin.top,
          width: "8.2%",
          transform: "translate(-5%, -52%)",
        }}
      >
        <div className="flex items-center gap-[5%]">
          <button
            type="button"
            className={`pointer-events-auto relative aspect-square w-[47%] shrink-0 overflow-hidden rounded-full border-2 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.28)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1 ${
              hasOrg ? "cursor-pointer" : "cursor-default"
            } ${
              highlighted
                ? "scale-110 border-brand-gold shadow-[0_0_0_3px_rgba(197,160,89,0.5)]"
                : "border-white/90 hover:border-brand-gold"
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
            <Image src={pin.flagUrl} alt={pin.countryName} fill sizes="48px" className="object-cover" />
          </button>

          <div
            className="relative aspect-square w-[47%] shrink-0 overflow-hidden rounded-full border border-white/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            aria-hidden="true"
          >
            <Image
              src="/images/world-iac-asia-logo.png"
              alt=""
              fill
              sizes="48px"
              className="object-contain p-[12%]"
            />
          </div>
        </div>

        <p
          className="mt-[0.12rem] whitespace-nowrap text-center font-sans font-bold leading-tight text-[#1e4f8f]"
          style={{ fontSize: "clamp(6.5px, 0.95vw, 10.5px)" }}
          aria-hidden="true"
        >
          {pin.label}
        </p>
      </div>
    </>
  );
}
