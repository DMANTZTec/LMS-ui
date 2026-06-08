import React, { useEffect, useState } from "react";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {PlusCircle, Loader2, Search,} from "lucide-react";

import { api } from "@/api/CourseMgtController";

const AddCoursesDialog = ({program, onAddSuccess,}) => {
  const [open, setOpen] =useState(false);
  const [courses, setCourses] =useState([]);
  const [selectedCourses,setSelectedCourses] =useState([]);
  const [search,setSearch] =useState("");
  const [loadingCourses,setLoadingCourses] =useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      fetchCourses();
    }
  }, [open]);

  const fetchCourses =
    async () => {
      try {
        setLoadingCourses(true);

        // Replace with your API
        const res =
          await api.viewAllCourses();

        setCourses(
          res.data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCourses(false);
      }
    };

  const handleCourseSelect =
    (courseId) => {
      setSelectedCourses(
        (prev) =>
          prev.includes(courseId)
            ? prev.filter(
                (id) =>
                  id !== courseId
              )
            : [
                ...prev,
                courseId,
              ]
      );
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        selectedCourses.length === 0
      )
        return;

      try {
        setIsSubmitting(true);
        setErrorMessage("");
        const payload = {
          programId:
        program.programId,
          courseIds:
            selectedCourses,
        };

        await api.addCourses(
          payload
        );

        setOpen(false);
        setSelectedCourses([]);
        setSearch("");

        onAddSuccess?.();
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error?.response?.data
            ?.message ||
            "Failed to add courses"
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const filteredCourses =
    courses.filter((course) =>
      course.courseTitle
        ?.toLowerCase()
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
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <PlusCircle
            size={14}
            className="mr-1"
          />
          Add Courses
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle>
            Add Courses To Program
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Program Details */}

          <div className="rounded-md border bg-gray-50 p-3">
            <div className="text-xs text-gray-500">
              Program
            </div>

            <div className="font-semibold">
              { 
                program.programTitle
              }
            </div>

            <div className="text-xs text-gray-500">
              {
                program.programId
              }
            </div>
          </div>

          {/* Search */}

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />

            <Input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search courses..."
              className="pl-9"
            />
          </div>

          {/* Course List */}

          <div className="h-[350px] overflow-y-auto rounded-md border">
            {loadingCourses ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              filteredCourses.map(
                (course) => (
                  <label
                    key={
                      course.courseId
                    }
                    className="flex cursor-pointer items-center gap-3 border-b p-3 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(
                        course.courseId
                      )}
                      onChange={() =>
                        handleCourseSelect(
                          course.courseId
                        )
                      }
                    />

                    <div>
                      <div className="font-medium">
                        {
                          course.courseTitle
                        }
                      </div>

                      <div className="text-xs text-gray-500">
                        {
                          course.courseId
                        }
                      </div>
                    </div>
                  </label>
                )
              )
            )}
          </div>

          {/* Error */}

          {errorMessage && (
            <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-500">
              {errorMessage}
            </div>
          )}

          {/* Footer */}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Selected Courses :
              {" "}
              {
                selectedCourses.length
              }
            </span>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  selectedCourses.length ===
                    0
                }
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Add Courses
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoursesDialog;