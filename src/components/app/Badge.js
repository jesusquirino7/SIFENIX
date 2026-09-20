const COLORS = {
  gray: "bg-neutral-100 text-neutral-700",
  red: "bg-red-50 text-[var(--brand-red)]",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
};

export default function Badge({ children, color = "gray" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        COLORS[color] || COLORS.gray
      }`}
    >
      {children}
    </span>
  );
}
