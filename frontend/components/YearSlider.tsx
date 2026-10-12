"use client";

interface YearSliderProps {
  annees: number[];
  anneeCourante: number;
  onYearChange: (annee: number) => void;
}

export function YearSlider({ annees, anneeCourante, onYearChange }: YearSliderProps) {
  if (annees.length === 0) return null;

  const min = Math.min(...annees);
  const max = Math.max(...annees);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 min-w-[3rem]">{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={anneeCourante}
        onChange={(e) => onYearChange(Number(e.target.value))}
        aria-label="Année"
        className="flex-1 accent-primary-600"
      />
      <span className="text-sm text-gray-600 min-w-[3rem]">{max}</span>
      <span className="text-sm font-semibold text-primary-700 min-w-[4rem] text-right">
        {anneeCourante}
      </span>
    </div>
  );
}
