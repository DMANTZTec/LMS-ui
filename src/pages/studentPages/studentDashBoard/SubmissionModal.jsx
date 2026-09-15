import { useState } from "react";
import {
  Tag,
  Calendar,
  FileText,
  Paperclip,
  Upload,
  X,
  Loader2,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { stasksubapi } from "@/api/student-task-submission-controller";
import { decodeToken } from "@/utils/tokenUtility";

export default function SubmissionModal({ task, open, onClose, onSubmitSuccess }) {
  if (!task) return null;

  const [notes, setNotes] = useState(task.submissionNotes || "");
  const [files, setFiles] = useState([]);
  const [gitCommits, setGitCommits] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const student = task.student || {
    name: "Anya Patel",
    initials: "AP",
    course: task.tags?.[0] || "Advanced Web Development",
    topic: task.tags?.[1] || task.title || "React Hooks Assignment",
    submittedDate: "Today",
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const addGitCommit = () => {
    setGitCommits((prev) => [...prev, { githubUrl: "", commitMessage: "" }]);
  };

  const updateGitCommit = (indexToUpdate, field, value) => {
    setGitCommits((prev) =>
      prev.map((commit, index) =>
        index === indexToUpdate ? { ...commit, [field]: value } : commit
      )
    );
  };

  const removeGitCommit = (indexToRemove) => {
    setGitCommits((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");

    const studentId = decodeToken()?.userId;
    if (!studentId) {
      setError("Unable to identify the logged-in student.");
      return;
    }
    if (files.length === 0) {
      setError("Please attach at least one file before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      // Change this block inside handleSubmit in SubmissionModal.jsx:

const git = gitCommits
  .filter((commit) => commit.githubUrl.trim() !== "")
  .map((commit) => 
    // Serialize each object to a JSON string here
    JSON.stringify({
      githubUrl: commit.githubUrl.trim(),
      commitMessage: commit.commitMessage.trim(),
    })
  );

const res = await stasksubapi.submitTask(
  task.id,
  studentId,
  files,
  notes,
  git.length > 0 ? git : undefined
);

      if (onSubmitSuccess) {
        onSubmitSuccess({
          ...(res.data || {}),
          taskId: task.id,
          notes,
          attachments: files.map((f) => f.name),
          git,
        });
      }

      onClose();
    } catch (err) {
      console.error("Failed to submit task", err);
      setError(
        err?.response?.data?.message ||
          "Failed to submit your assignment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-2xl p-0 border border-border overflow-y-auto bg-background">
        <form onSubmit={handleSubmit}>
          <div className="p-4 pb-3 sm:p-5 sm:pb-4 md:p-6 md:pb-4">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 bg-blue-100 text-blue-600 font-semibold text-base">
                  <AvatarFallback>{student.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground">
                    {student.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {student.course}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  <span>TOPIC</span>
                </div>
                <p className="mt-2 text-xs font-bold text-foreground truncate">
                  {student.topic}
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>SUBMITTED</span>
                </div>
                <p className="mt-2 text-xs font-bold text-foreground">
                  {student.submittedDate}
                </p>
              </div>
            </div>

            {/* Task Title */}
            <div className="mt-5 sm:mt-6">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>TASK</span>
              </div>
              <h4 className="mt-1 text-sm sm:text-base font-bold text-foreground">
                {task.title}
              </h4>
            </div>

            {/* Student's Input Field for Submission Notes */}
            <div className="mt-4 sm:mt-5 space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Student's Submission Notes
              </label>
              <Textarea
                placeholder="Build a todo app using useState and useEffect hooks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                className="min-h-[90px] text-xs bg-muted/20 border-border/60 focus-visible:ring-blue-500 focus-visible:ring-1"
              />
            </div>

            {/* Attachments File Upload */}
            <div className="mt-4 sm:mt-5 space-y-2">
              <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Attachments
              </label>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-xs font-semibold text-foreground">
                  Click to upload notes or documents
                </span>
                <span className="text-[10px] text-muted-foreground">
                  PDF, ZIP, TSX, JS, TXT (Max 10MB)
                </span>
                <input
                  type="file"
                  multiple
                  disabled={submitting}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* File list preview */}
              {files.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2 text-xs font-medium"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFile(idx)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Git Commits Section */}
            <div className="mt-4 sm:mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Git Commits
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={submitting}
                  onClick={addGitCommit}
                  className="h-7 gap-1 px-2 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Commit
                </Button>
              </div>

              {gitCommits.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  Optionally add GitHub commit URLs to show your work.
                </p>
              ) : (
                <div className="space-y-2">
                  {gitCommits.map((commit, idx) => (
                    <div
                      key={idx}
                      className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://github.com/your-repo/commit/..."
                          value={commit.githubUrl}
                          onChange={(e) =>
                            updateGitCommit(idx, "githubUrl", e.target.value)
                          }
                          disabled={submitting}
                          className="h-8 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeGitCommit(idx)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <input
                        type="text"
                        placeholder="Commit message (e.g. 'feat: add form validation')"
                        value={commit.commitMessage}
                        onChange={(e) =>
                          updateGitCommit(idx, "commitMessage", e.target.value)
                        }
                        disabled={submitting}
                        className="h-8 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions: Submit Button */}
          <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/10 p-3 sm:p-4">
            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {submitting ? "Submitting..." : "Submit Assignment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
