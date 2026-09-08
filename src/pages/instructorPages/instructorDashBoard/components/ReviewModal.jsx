import { X, Tag, Calendar, FileText, Paperclip } from "lucide-react";

export const ReviewModal = ({
  isOpen,
  onClose,
  onStartReview,
  details,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative flex h-[568.8px] w-[512px] max-w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.status && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
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
            Close
          </button>
          <button
            type="button"
            onClick={onStartReview}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Start Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
