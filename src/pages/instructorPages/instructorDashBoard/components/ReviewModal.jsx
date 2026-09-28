import { useState } from "react";
import {
  X,
  Tag,
  Calendar,
  FileText,
  Paperclip,
  GitBranch,
  Star,
} from "lucide-react";

const CRITERIA = [
  { key: "completion", label: "Task Completion" },
  { key: "technical", label: "Technical Correctness" },
  { key: "quality", label: "Code Quality" },
  { key: "solving", label: "Problem Solving" },
  { key: "understanding", label: "Understanding" },
];

function Stars({ value, size = "h-6 w-6" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.min(1, Math.max(0, value - (n - 1)));
        return (
          <span key={n} className={`relative inline-block ${size}`}>
            <Star className={`absolute inset-0 ${size} text-slate-200`} />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className={`${size} fill-amber-400 text-amber-400`} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export const ReviewModal = ({
  isOpen,
  onClose,
  onStartReview,
  submitting,
  details,
}) => {
  const [criteria, setCriteria] = useState({});
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const completed = details.status === "Completed";

  const enteredCriteria = CRITERIA.filter(
    ({ key }) => typeof criteria[key] === "number" && criteria[key] > 0
  );
  const overall = enteredCriteria.length
    ? Math.round(
        (enteredCriteria.reduce((sum, { key }) => sum + criteria[key], 0) /
          enteredCriteria.length) *
          10
      ) / 10
    : 0;

  const handleCompleteReview = () => {
    onStartReview?.({
      rating: overall,
      feedback,
      criteria: enteredCriteria.map(({ key, label }) => ({
        criterion: label,
        rating: criteria[key],
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative flex h-[648px] w-[612px] max-w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100/60 px-6 pb-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
              {details.studentInitials}
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight text-slate-800">
                {details.studentName}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {details.courseTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {(details.topic || details.submittedDate) && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.topic && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Topic</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-slate-700">
                    {details.topic}
                  </p>
                </div>
              )}

              {details.submittedDate && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Submitted</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    {details.submittedDate}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <FileText className="h-3.5 w-3.5" />
              <span>Task</span>
            </div>
            <h4 className="text-base font-bold text-slate-800">
              {details.taskTitle}
            </h4>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Student's Submission Notes
            </label>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs font-medium leading-relaxed text-slate-600">
              {details.submissionNotes}
            </div>
          </div>

          {details.attachments.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Attachments
              </label>
              <div className="space-y-2">
                {details.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={file?.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs font-medium transition-colors hover:bg-slate-50"
                  >
                    <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate font-semibold text-blue-600 underline-offset-2 hover:underline">
                      {file?.fileName}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {details.git?.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <GitBranch className="h-3.5 w-3.5" />
                Git Commits
              </label>
              <div className="space-y-2">
                {details.git.map((commit, idx) => (
                  <a
                    key={idx}
                    href={commit?.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <p className="truncate text-xs font-semibold text-blue-600 underline underline-offset-2">{commit?.githubUrl}</p>
                    {commit?.commitMessage && (
                      <p className="mt-1 text-xs text-slate-500">
                        {commit.commitMessage}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!completed && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Evaluation Criteria{" "}
                  <span className="font-normal normal-case text-slate-400">
                    (optional)
                  </span>
                </label>
                <div className="space-y-2">
                  {CRITERIA.map(({ key, label }) => {
                    const value = criteria[key];
                    const isSet = typeof value === "number" && value > 0;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5"
                      >
                        <span className="w-40 shrink-0 text-xs font-semibold text-slate-600">
                          {label}
                        </span>
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <input
                            type="range"
                            min={1}
                            max={5}
                            step={0.1}
                            value={isSet ? value : 1}
                            onChange={(e) =>
                              setCriteria({
                                ...criteria,
                                [key]: Number(e.target.value),
                              })
                            }
                            className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                            aria-label={label}
                          />
                        </div>
                        <div className="flex w-28 shrink-0 items-center justify-end gap-1.5">
                          <span className="text-xs font-semibold tabular-nums text-slate-700">
                            {isSet ? `${value.toFixed(1)} / 5.0` : "– / 5.0"}
                          </span>
                          {isSet && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = { ...criteria };
                                delete next[key];
                                setCriteria(next);
                              }}
                              className="rounded p-0.5 text-slate-300 transition-colors hover:text-slate-500"
                              aria-label={`Clear ${label}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Star className="h-3.5 w-3.5" />
                  <span>Student Performance</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Stars value={overall} />
                    <span className="text-xs font-semibold text-slate-600">
                      {overall ? `${overall.toFixed(1)} / 5.0` : "Select"}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Overall Rating
                  </span>
                </div>
                <p className="mt-2 text-[11px] font-medium text-slate-400">
                  Averages the criteria above. Use a criterion to set a value
                  between 1.0 and 5.0 in 0.1 steps.
                </p>
              </div>
            </div>
          )}

          {!completed && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Feedback Message
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="Write your feedback for the student..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium leading-relaxed text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          {completed && details.rating > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Student Performance
              </label>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3">
                  <Stars value={details.rating} size="h-5 w-5" />
                  <span className="text-xs font-semibold tabular-nums text-slate-700">
                    {details.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  Overall Rating
                </span>
              </div>
              {details.criteria?.length > 0 && (
                <div className="space-y-1.5">
                  {details.criteria.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs"
                    >
                      <span className="font-semibold text-slate-600">
                        {c.criterion}
                      </span>
                      <span className="font-semibold tabular-nums text-slate-700">
                        {Number(c.rating).toFixed(1)} / 5.0
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {completed && details.reviewFeedback && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Feedback Message
              </label>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs font-medium leading-relaxed text-slate-600">
                {details.reviewFeedback}
              </div>
            </div>
          )}

          {details.status && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  completed
                    ? "border border-emerald-200/60 bg-emerald-50 text-emerald-700"
                    : "border border-amber-200/60 bg-amber-50 text-amber-700"
                }`}
              >
                {details.status}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100/60 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100/80 px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200/70"
          >
            {completed ? "Close" : "Cancel"}
          </button>
          {!completed && (
            <button
              type="button"
              onClick={handleCompleteReview}
              disabled={!overall || submitting}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Completing..." : "Complete Review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;