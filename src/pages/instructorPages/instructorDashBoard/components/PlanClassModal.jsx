import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/CourseMgtController";
import { instructorDashboardApi } from "@/api/instructor-dashboard-controller";
import { TopicOption } from "./TopicOption";
import toast from "react-hot-toast";

export const PlanClassModal = ({
  isOpen = true,
  onClose,
  scheduleId,
  courseId,
  classNameTitle,
  dateTimeText,
}) => {
  const queryClient = useQueryClient();
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  const staffId = JSON.parse(localStorage.getItem("staffId"));

  // Fetch available topics for course
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["topicsByCourse", courseId],
    queryFn: async () => {
      const res = await api.getTopicsByCourseId(courseId);
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(courseId) && isOpen,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch planned topics for this class/schedule
  const { data: plannedTopics = [] } = useQuery({
    queryKey: ["plannedTopics", scheduleId, staffId],
    queryFn: async () => {
      const res = await instructorDashboardApi.getPlannedTopics(
        scheduleId,
        staffId
      );
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(scheduleId) && Boolean(staffId) && isOpen,
  });

  // Sync state whenever plannedTopics updates from the GET API
  useEffect(() => {
    if (plannedTopics.length > 0) {
      setSelectedTopicIds(plannedTopics.map((pt) => pt.topicId));
    }
  }, [plannedTopics]);

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: (topicIds) =>
      instructorDashboardApi.planClassTopics(scheduleId, {
        staffId,
        topicIds,
      }),
    onSuccess: () => {
      toast.success("Class plan saved successfully");
      
      // Force Refetch/Get API on Success
      queryClient.invalidateQueries({
        queryKey: ["plannedTopics", scheduleId, staffId],
      });

      onClose();
    },
    onError: () => {
      toast.error("Failed to save class plan");
    },
  });

  if (!isOpen) return null;

  // Toggle selection locally without calling mutation on every click
  const handleToggle = (id) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    saveMutation.mutate(selectedTopicIds.map(Number));
  };

  const selectedCount = selectedTopicIds.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
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

        <div className="px-6 py-2">
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select topics to cover
          </label>
          <div className="max-h-[320px] space-y-2.5 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-slate-400">
                Loading topics...
              </div>
            ) : topics.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No topics available for this course
              </div>
            ) : (
              topics.map((topic) => (
                <TopicOption
                  key={topic.id}
                  id={topic.id}
                  label={topic.topicName}
                  isSelected={selectedTopicIds.includes(topic.id)}
                  onToggle={handleToggle}
                />
              ))
            )}
          </div>
        </div>

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
              disabled={saveMutation.isPending}
              className="rounded-xl bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanClassModal;