"use client";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  /** Label for the "show everything" chip. */
  allLabel?: string;
}

export function CategoryFilter({
  categories,
  active,
  onChange,
  allLabel = "Todo",
}: CategoryFilterProps) {
  const options = [allLabel, ...categories];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              isActive
                ? "border-terracotta bg-terracotta text-stone-950"
                : "border-stone-700 text-stone-300 hover:border-stone-500 hover:text-bone"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
