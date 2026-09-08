import { useState } from "react";
import { X } from "lucide-react";
import { TopicOption } from "./TopicOption";

const DEFAULT_TOPICS = [
  { id: "1", label: "Higher-Order Components" },
  { id: "2", label: "Render Props pattern" },
  { id: "3", label: "Custom Hooks deep dive" },
  { id: "4", label: "Context API & performance" },
  { id: "5", label: "Compound components" },
   { id: "5", label: "Compound components" },
    { id: "5", label: "Compound components" },
     { id: "5", label: "Compound components" },
      { id: "5", label: "Compound components" },
];

export const PlanClassModal = ({
  isOpen = true,
  onClose,
  onSave,
  classNameTitle = "React Advanced Patterns",
  dateTimeText = "Mon, 01 Sep 2026 • 09:00 AM",
  topics = DEFAULT_TOPICS,
}) => {
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  if (!isOpen) return null;

  const handleToggle = (id) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedTopicIds);
    }
    onClose();
  };

  const selectedCount = selectedTopicIds.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-xs">
      {/* Modal Container */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Plan Class
          </h2>
          <div className="mt-1">
            <p className="text-sm font-medium text-slate-500">{classNameTitle}</p>
            <p className="mt-0.5 text-xs font-medium tracking-wide text-slate-400">
              {dateTimeText}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-2">
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select topics to cover
          </label>
          <div className="max-h-[320px] space-y-2.5 overflow-y-auto pr-1">
            {topics.map((topic) => (
              <TopicOption
                key={topic.id}
                id={topic.id}
                label={topic.label}
                isSelected={selectedTopicIds.includes(topic.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between p-6 pt-4">
          <span className="text-sm font-medium text-slate-400">
            {selectedCount === 0
              ? "No topics selected yet"
              : `${selectedCount} topic${selectedCount > 1 ? "s" : ""} selected`}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanClassModal;
