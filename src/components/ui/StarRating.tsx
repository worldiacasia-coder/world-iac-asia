type Props = {
  stars: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function StarRating({ stars, readOnly = true, size = "md" }: Props) {
  const sizeClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-lg";

  return (
    <div
      className={`flex gap-0.5 ${sizeClass} ${readOnly ? "pointer-events-none select-none" : ""}`}
      aria-label={`${stars} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < stars ? "star-active" : "star-inactive"}>
          ★
        </span>
      ))}
    </div>
  );
}
