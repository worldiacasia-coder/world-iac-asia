import Image from "next/image";
import prisma from "@/lib/prisma";

type Props = {
  emptyMessage?: string;
};

export default async function PartnerMarquee({ emptyMessage }: Props) {
  const partners = await prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });

  if (partners.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div className="glass-section py-10">
        <p className="text-center text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const doubled = [...partners, ...partners];

  return (
    <div className="glass-section overflow-hidden py-10">
      <div className="flex animate-marquee gap-10 whitespace-nowrap">
        {doubled.map((partner, i) => (
          <div
            key={`${partner.id}-${i}`}
            className="glass flex shrink-0 items-center gap-4 rounded-2xl px-6 py-4"
          >
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              width={120}
              height={48}
              className="h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
            <span className="text-sm font-medium text-gray-500">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
