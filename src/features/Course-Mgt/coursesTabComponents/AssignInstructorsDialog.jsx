import React, { useEffect, useState } from "react";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2,Search,UserPlus,} from "lucide-react";
import toast from "react-hot-toast";
import { staffcourseApi } from "@/api/staff-course-controller";

const AssignInstructorDialog = ({course, onAssignSuccess,}) => {
  const [open, setOpen] = useState(false);

  const [allInstructors, setAllInstructors] =useState([]);

  const [assignedInstructors,setAssignedInstructors,] = useState([]);

  const [selectedInstructors,setSelectedInstructors,] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [allRes, assignedRes] =
        await Promise.all([
          staffcourseApi.getAllInstructors(),
          staffcourseApi.getInstructorsByCourse(
            course.courseId
          ),
        ]);

      const instructors =
        allRes?.data || [];

      const assigned =
        assignedRes?.data || [];

      setAllInstructors(instructors);

      const assignedIds =
        assigned.map(
          (instructor) =>
            instructor.staffId
        );

      setAssignedInstructors(
        assignedIds
      );

      setSelectedInstructors(
        assignedIds
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load instructors"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInstructor = (
    staffId
  ) => {
    setSelectedInstructors((prev) =>
      prev.includes(staffId)
        ? prev.filter(
            (id) => id !== staffId
          )
        : [...prev, staffId]
    );
  };

  const handleSave = async () => {
    const toastId = toast.loading(
      "Updating instructors..."
    );

    try {
      setSaving(true);

      const newlySelected =
        selectedInstructors.filter(
          (id) =>
            !assignedInstructors.includes(
              id
            )
        );

      const removedInstructors =
        assignedInstructors.filter(
          (id) =>
            !selectedInstructors.includes(
              id
            )
        );

      // Assign New Instructors
      if (
        newlySelected.length > 0
      ) {
        await staffcourseApi.assignInstructorsToCourse(
          course.courseId,
          {
            staffIds:
              newlySelected,
          }
        );
      }

      // Remove Unselected Instructors
      if (
        removedInstructors.length >
        0
      ) {
        await Promise.all(
          removedInstructors.map(
            (staffId) =>
              staffcourseApi.removeInstructorFromCourse(
                course.courseId,
                staffId
              )
          )
        );
      }

      if (
        newlySelected.length ===
          0 &&
        removedInstructors.length ===
          0
      ) {
        toast(
          "No changes made",
          {
            id: toastId,
          }
        );
        return;
      }

      setAssignedInstructors(
        selectedInstructors
      );

      toast.success(
        "Instructor assignments updated successfully",
        {
          id: toastId,
        }
      );

      onAssignSuccess?.();

      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update instructors",
        {
          id: toastId,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredInstructors =
    allInstructors.filter(
      (staff) =>
        `${staff.firstNm || ""} ${
          staff.lastNm || ""
        }`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          Assign
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Assign Instructors
          </DialogTitle>
        </DialogHeader>

        {/* Course Details */}
        <div className="rounded-md border bg-slate-50 p-3">
          <p className="text-xs text-gray-500">
            Course
          </p>

          <p className="font-semibold">
            {course.courseTitle}
          </p>

          <p className="text-xs text-gray-500">
            {course.courseId}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Search instructor..."
            className="pl-9"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        {/* Instructor List */}
        <div className="h-[350px] overflow-y-auto rounded-md border">
          {loading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredInstructors.length >
            0 ? (
            filteredInstructors.map(
              (staff) => (
                <label
                  key={
                    staff.staffId
                  }
                  className="flex cursor-pointer items-center gap-3 border-b p-3 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedInstructors.includes(
                      staff.staffId
                    )}
                    onChange={() =>
                      handleToggleInstructor(
                        staff.staffId
                      )
                    }
                  />

                  <UserPlus
                    size={18}
                    className="text-cyan-600"
                  />

                  <div>
                    <div className="font-medium">
                      {
                        staff.firstNm
                      }{" "}
                      {
                        staff.lastNm
                      }
                    </div>

                    <div className="text-xs text-gray-500">
                      {
                        staff.staffId
                      }
                    </div>

                    {staff.designation && (
                      <div className="text-xs text-gray-400">
                        {
                          staff.designation
                        }
                      </div>
                    )}
                  </div>
                </label>
              )
            )
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No instructors found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Selected:{" "}
            {
              selectedInstructors.length
            }
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignInstructorDialog;