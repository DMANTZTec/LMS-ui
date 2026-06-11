// Field.jsx
// ─────────────────────────────────────────────────────────────────────────────
// YOUR reusable field wrapper — written once, used across every form in the app.
// No shadcn/ui Form dependency. You own 100% of this code.
//
// Props:
//   label      — field label text
//   error      — error message string (from react-hook-form formState.errors)
//   optional   — boolean, shows "(Optional)" badge next to label
//   children   — the actual <input>, <textarea>, <select> etc.
// ─────────────────────────────────────────────────────────────────────────────

const Field = ({ label, error, optional = false, children }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {optional && (
          <span className="text-xs font-normal text-gray-400">(Optional)</span>
        )}
      </div>

      {/* Input slot — renders whatever child you pass in */}
      {children}

      {/* Error message — accessible, shows only when error exists */}
      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="text-xs font-medium text-red-500 flex items-center gap-1"
        >
          <svg
            className="h-3 w-3 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
