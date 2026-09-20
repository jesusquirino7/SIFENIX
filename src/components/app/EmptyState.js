export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <p className="text-base font-semibold text-neutral-700">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
