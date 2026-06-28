"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import StarRating from "@/components/ui/StarRating";
import type { JudgeLevel } from "@/lib/judge-level";
import { JudgeLevelAvatarBadge, JudgeLevelLabel } from "@/components/judges/JudgeLevelBadge";
import type { JudgeRecord } from "@/components/admin/AdminJudgeManager";

function reorderById<T extends { id: string }>(list: T[], fromId: string, toId: string): T[] {
  const fromIdx = list.findIndex((item) => item.id === fromId);
  const toIdx = list.findIndex((item) => item.id === toId);
  if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return list;
  const next = [...list];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
}

type Props = {
  items: JudgeRecord[];
  level: JudgeLevel;
  reordering: boolean;
  onEdit: (judge: JudgeRecord) => void;
  onRemove: (id: string, name: string) => void;
  onReorder: (orderedIds: string[]) => void;
};

export default function JudgeOrderList({
  items,
  level,
  reordering,
  onEdit,
  onRemove,
  onReorder,
}: Props) {
  const t = useTranslations("judges");
  const tCommon = useTranslations("common");
  const [localItems, setLocalItems] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;

    const next = reorderById(localItems, draggingId, targetId);
    setLocalItems(next);
    setDraggingId(null);
    setDropTargetId(null);
    onReorder(next.map((j) => j.id));
  }

  return (
    <div className="space-y-3">
      {localItems.map((judge) => {
        const isDragging = draggingId === judge.id;
        const isDropTarget = dropTargetId === judge.id && draggingId && draggingId !== judge.id;

        return (
          <div
            key={judge.id}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDropTargetId(judge.id);
            }}
            onDragLeave={() => {
              if (dropTargetId === judge.id) setDropTargetId(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(judge.id);
            }}
            className={`flex items-center gap-4 rounded-xl border bg-white/90 p-4 transition-all ${
              isDropTarget
                ? "border-brand-gold/60 bg-brand-gold-light/40 shadow-md"
                : "border-white/70"
            } ${isDragging ? "opacity-40" : ""} ${reordering ? "pointer-events-none opacity-70" : ""}`}
          >
            <button
              type="button"
              draggable={!reordering && localItems.length > 1}
              onDragStart={() => setDraggingId(judge.id)}
              onDragEnd={() => {
                setDraggingId(null);
                setDropTargetId(null);
              }}
              aria-label={t("dragHandle")}
              className="flex shrink-0 cursor-grab flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-2 py-3 text-gray-400 transition-colors hover:border-brand-gold/50 hover:text-brand-gold active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
              disabled={reordering || localItems.length <= 1}
            >
              <span className="text-base leading-none" aria-hidden>
                ⠿
              </span>
            </button>

            <div className="relative shrink-0">
              <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-brand-gold/25">
                <Image
                  src={judge.avatarUrl}
                  alt={judge.name}
                  fill
                  className="object-cover object-top"
                  sizes="56px"
                  unoptimized
                />
              </div>
              <div className="absolute -right-0.5 -top-0.5">
                <JudgeLevelAvatarBadge level={level} size="sm" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-gray-900">{judge.name}</p>
                <JudgeLevelLabel level={level} />
                <span className="text-xs text-gray-400">#{judge.sortOrder + 1}</span>
              </div>
              <p className="text-sm text-brand-gold">{judge.title}</p>
              <p className="text-xs text-gray-500">{judge.country}</p>
            </div>

            <StarRating stars={judge.stars} size="sm" readOnly />

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onEdit(judge)}
                className="text-xs font-medium text-brand-gold hover:text-brand-gold-hover"
              >
                {tCommon("edit")}
              </button>
              <button
                type="button"
                onClick={() => onRemove(judge.id, judge.name)}
                className="text-xs font-medium text-red-500 hover:text-red-700"
              >
                {tCommon("delete")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
