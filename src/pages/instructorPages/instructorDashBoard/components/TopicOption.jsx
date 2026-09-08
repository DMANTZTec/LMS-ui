import { Check } from "lucide-react";

export const TopicOption = ({ id, label, isSelected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        isSelected
          ? "border-indigo-200 bg-indigo-50"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          isSelected
            ? "border-indigo-500 bg-indigo-500 text-white"
            : "border-slate-300 bg-white text-transparent group-hover:border-slate-400"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      <span
        className={`text-sm font-medium ${
          isSelected ? "text-indigo-700" : "text-slate-700"
        }`}
      >
        {label}
      </span>
    </button>
  );
};
