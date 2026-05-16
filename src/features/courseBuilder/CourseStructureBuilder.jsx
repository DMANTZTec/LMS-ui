import { useState, useEffect,} from "react";
import { useParams} from "react-router-dom";
import {List,Plus,Save,Loader2, } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChapterCard from "./ChapterCard";
import {createChapter,} from "./types";
import {courseSchema,} from "./validation";
import { api } from "@/api/CourseMgtController";

const CourseStructureBuilder = () => {

  const { courseId } = useParams();
  const savedUser = JSON.parse( sessionStorage.getItem("otpStaff"));
  const staffId = savedUser?.staffId;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [course, setCourse] =useState({name: "", chapters: [], });
  


// ==========================================
// GET COURSE NAME BY COURSE ID
// ==========================================

const getCourseNameByCourseId =
  async (courseId) => {
    try {
      const response =await api.viewAllCourses();
      if (!response.data) {
        throw new Error(
          "Failed to fetch courses"
        );
      }
      const data =response.data;

      const matchedCourse =
        data.find((course) =>
            course.courseId ===courseId);
      setCourse((prev) => ({
        ...prev,
        name: matchedCourse?.courseTitle ||" ", 
      }));

    } catch (error) {
      console.error("GET COURSE NAME ERROR:",error);
      toast.error("Failed to load course name");
    }
  };

// CALL FUNCTION
useEffect(() => {
  if (courseId) {
    getCourseNameByCourseId(courseId);
  }
}, [courseId]);

  // ==========================================
  // FETCH CHAPTERS
  // ==========================================

  useEffect(() => {
    if (courseId) {
      fetchChapters();
    }
  }, [courseId]);

  const fetchChapters =
    async () => {
      try {
        setLoading(true);

        const chaptersData =await api.getChaptersByCourseId(courseId);
        const chaptersWithTopics = await Promise.all(
          chaptersData.data.map(async (chapter) => {
                const topics = await api.getTopicsByChapterId(chapter.id);

                return {
                  id: chapter.id,
                  backendId: chapter.id,

                  title: chapter.chapterNm || "",

                  description: chapter.chapterDesc || "",
                  expanded: false,
                  isChanged: false,

                  topics: topics.data.map((topic) => ({
                        id: topic.id,
                        backendId: topic.id,
                        title: topic.topicName || "",
                        description: topic.description || "",
                        duration: topic.expectedTimeMin?.toString() || "",
                        expanded: false,
                        activeTab: "documents",
                        documents:topic.documents || [],
                        videos:topic.videos || [],
                        urls: topic.urls || [],
                          isChanged: false,
                      })
                    ),
                };
              }
            )
          );


        setCourse((prev)=>({
          ...prev,

          chapters:
            chaptersWithTopics.length > 0 ? chaptersWithTopics : [ createChapter(), ], }));
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load course"
        );

        setCourse({
          name: "",
          chapters: [],
        });
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // UPDATE CHAPTER
  // ==========================================
const updateChapter = (
  id,
  patch
) => {
  const chapterIndex =
    course.chapters.findIndex(
      (c) => c.id === id
    );

  setCourse((prev) => ({
    ...prev,

    chapters:
      prev.chapters.map(
        (chapter) => {
          if (
            chapter.id !== id
          ) {
            return chapter;
          }

          return {
            ...chapter,
            ...patch,

            isChanged:
              patch.title !== undefined ||
              patch.description !== undefined
                ? true
                : chapter.isChanged,
          };
        }
      ),
  }));

  // ==========================================
  // CLEAR ACTIVE ERRORS
  // ==========================================

  setErrors((prev) => {
    const updatedErrors = {
      ...prev,
    };

    // CHAPTER ERRORS
    if (
      patch.title !== undefined
    ) {
      delete updatedErrors[
        `chapters.${chapterIndex}.title`
      ];
    }

    if (
      patch.description !== undefined
    ) {
      delete updatedErrors[
        `chapters.${chapterIndex}.description`
      ];
    }

    // TOPIC ERRORS
    if (patch.topics) {
      patch.topics.forEach(
        (topic, topicIndex) => {
          if (
            topic.title?.trim()
          ) {
            delete updatedErrors[
              `chapters.${chapterIndex}.topics.${topicIndex}.title`
            ];
          }

          if (
            topic.duration?.trim()
          ) {
            delete updatedErrors[
              `chapters.${chapterIndex}.topics.${topicIndex}.duration`
            ];
          }

          if (
            topic.description?.trim()
          ) {
            delete updatedErrors[
              `chapters.${chapterIndex}.topics.${topicIndex}.description`
            ];
          }
        }
      );
    }

    return updatedErrors;
  });
};

  // ==========================================
  // ADD CHAPTER
  // ==========================================

  const addChapter = () => {
    setCourse((prev) => ({
      ...prev,

      chapters: [
        ...prev.chapters,
        createChapter(),
      ],
    }));
  };

  // ==========================================
  // DELETE CHAPTER
  // ==========================================

  const deleteChapter =
    async (chapter) => {
      try {
        if (
          chapter.backendId
        ) {
          await api.deleteChapter(
            chapter.backendId,
            staffId
          );
        }

        setCourse((prev) => ({
          ...prev,

          chapters:
            prev.chapters.filter(
              (ch) =>
                ch.id !==
                chapter.id
            ),
        }));

        toast.success(
          "Chapter deleted"
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Delete failed"
        );
      }
    };

  // ==========================================
  // DELETE TOPIC
  // ==========================================

  const deleteTopic =
    async (
      chapterId,
      topic
    ) => {
      try {
        if (
          topic.backendId
        ) {
          await api.deleteTopic(
            topic.backendId
          );
        }

        setCourse((prev) => ({
          ...prev,

          chapters:
            prev.chapters.map( (chapter) =>
                chapter.id === chapterId ? {
                      ...chapter,
                      topics: chapter.topics.filter((t) =>
                            t.id !==topic.id
                        ),
                    } : chapter
            ),
        }));

        toast.success(
          "Topic deleted"
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to delete topic"
        );
      }
    };

  // ==========================================
  // SAVE
  // ==========================================

const handleSave = async () => {
  try {
    setLoading(true);
    setErrors({});

    // ==========================================
    // VALIDATION
    // ==========================================

    courseSchema.parse(course);

    const updatedChapters = [];

    // ==========================================
    // LOOP CHAPTERS
    // ==========================================

    for (const chapter of course.chapters) {
      let chapterId =
        chapter.backendId;

      const chapterPayload = { 
        courseId,
        chapterNm: chapter.title?.trim() || "",
        chapterDesc: chapter.description?.trim() || "",
      };

      // ======================================
      // CREATE CHAPTER
      // ======================================

     if (!chapter.backendId) {
  try {
    const response =
      await api.createChapter(
        staffId,
        chapterPayload
      );

    chapterId =
      response?.data?.id ||
      response?.id;

  } catch (error) {

    // ======================================
    // CHAPTER ALREADY EXISTS
    // ======================================

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data ||
      "";

    if (
      typeof errorMessage === "string" &&
      errorMessage.includes(
        "Chapter name already exists in this course"
      )
    ) {

      const existingChapters =
        await api.getChaptersByCourseId(
          courseId
        );

      const matchedChapter =
        existingChapters.data.find(
          (c) =>
            c.chapterNm?.trim()?.toLowerCase() ===
            chapter.title?.trim()?.toLowerCase()
        );

      if (matchedChapter) {

        // USE EXISTING CHAPTER ID
        chapterId =
          matchedChapter.id;

        // UPDATE CHAPTER
        await api.updateChapter(
          matchedChapter.id,
          staffId,
          chapterPayload
        );
      }
    } else {
      throw error;
    }
  }
}

      // ======================================
      // UPDATE ONLY CHANGED CHAPTER
      // ======================================

else if (
  chapter.isChanged &&
  (
    chapter.title?.trim() ||
    chapter.description?.trim()
  )
) {
        await api.updateChapter(
          chapter.backendId,
          staffId,
          chapterPayload
        );
      }

      const updatedTopics = [];

      // ======================================
      // LOOP TOPICS
      // ======================================

      for (const topic of chapter.topics) {
        let topicId = topic.backendId;

        const topicPayload = {
          chapterId,

          topicName:
            topic.title?.trim() ||
            "",

          description:
            topic.description?.trim() ||
            "",

          expectedTimeMin:
            Number( topic.duration) || 0,
          staffId,
        };

        // ==================================
        // CREATE TOPIC
        // ==================================

        if (!topic.backendId) {
          const response =
            await api.createTopic(
              topicPayload
            );

          topicId =
            response?.data?.id ||
            response?.id;
        }

        // ==================================
        // UPDATE ONLY CHANGED TOPIC
        // ==================================

        else if (
          topic.isChanged
        ) {
          await api.updateTopic(
            topic.backendId,
            topicPayload
          );
        }

        // ==================================
        // SAVE DOCUMENTS
        // ==================================

        if (
          topic.documents?.length
        ) {
          await Promise.all(
            topic.documents.map((doc) => api.addDocument(
                  topicId,
                  {
                    refValue: {
                      additionalProp1:
                        {
                          title: doc.title || "",
                          fileName: doc.fileName || "",
                          url: doc.url || "",
                        },
                      additionalProp2: {},
                      additionalProp3: {},
                    },
                    refBy: staffId,
                    refById: 1,
                  }
                )
            )
          );
        }

        // ==================================
        // SAVE VIDEOS
        // ==================================

        if (
          topic.videos?.length
        ) {
          await Promise.all(
            topic.videos.map(
              (video) =>
                api.addVideo(
                  topicId,
                  {
                    refValue: {
                      additionalProp1:
                        {
                          title: video.title || "",
                          url:video.url || "",
                        },
                      additionalProp2: {},
                      additionalProp3: {},
                    },
                    refBy: staffId,
                    refById: 1,
                  }
                )
            )
          );
        }

        // ==================================
        // SAVE URLS
        // ==================================

        if (
          topic.urls?.length
        ) {
          await Promise.all(
            topic.urls.map(
              (url) =>
                api.addUrl(
                  topicId,
                  {
                    refValue: {
                      additionalProp1:
                        {
                          title: url.title || "",
                          url: url.url || "",
                        },
                      additionalProp2: {},
                      additionalProp3: {},
                    },
                    refBy: staffId,
                    refById: 1,
                  }
                )
            )
          );
        }

        // ==================================
        // RESET TOPIC CHANGED FLAG
        // ==================================

        updatedTopics.push({
          ...topic,

          backendId:
            topicId,

          isChanged: false,
        });
      }

      // ======================================
      // RESET CHAPTER CHANGED FLAG
      // ======================================

      updatedChapters.push({
        ...chapter,

        backendId:
          chapterId,

        topics:
          updatedTopics,

        isChanged: false,
      });
    }

    // ==========================================
    // UPDATE STATE
    // ==========================================

    setCourse((prev) => ({
      ...prev,

      chapters:
        updatedChapters,
    }));

    toast.success(
      "Course saved successfully"
    );

    return true;

  } catch (error) {
    console.error(
      "SAVE ERROR:",
      error
    );

    // ==========================================
    // ZOD ERRORS
    // ==========================================

    if (error?.issues) {
      const fieldErrors = {};

      error.issues.forEach(
        (err) => {
          fieldErrors[
            err.path.join(".")
          ] = err.message;
        }
      );

      setErrors(fieldErrors);

      toast.error(
        "Please fill all required fields"
      );

      return false;
    }

    // ==========================================
    // API ERRORS
    // ==========================================

    if (error?.response) {
      console.log(
        "API ERROR:",
        error.response.data
      );
    }

    toast.error(
      "Save failed"
    );

    return false;

  } finally {
    setLoading(false);
  }
};
  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto mt-2 mb-2 max-w-[847px] rounded-3xl border bg-card p-6 shadow-sm">

      {/* HEADER */}

      <header className="flex items-start relative top-[2px] gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
          <List className="h-[32px] w-[32px] text-[#9810FA]" />
        </div>

        <div className="flex-1">
          <h1 className="w-full text-[22px] sm:text-[26px] md:text-[30px] leading-[30px] md:leading-[36px] font-medium text-[#0A0A0A] relative top-[2px]">
            Course Structure Builder
          </h1>

          <p className="w-full text-[14px] sm:text-[15px] md:text-[16px] leading-[20px] md:leading-[24px] font-normal text-[#717182] relative-top-[1.67px]">
            Design chapters,
            topics, documents,
            videos, and external
            references.
          </p>
        </div>
      </header>

      {/* COURSE NAME */}

      <section className="mt-6">
        <label className="w-full max-w-[91px] h-[14px] text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
          Course Name
        </label>

        <Input
          placeholder="Course Name"
          value={course.name}
          readOnly
          className="w-full h-[36px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 outline-none text-gray-700 transition-all placeholder:text-gray-400 cursor-not-allowed"
        />
      </section>

      {/* ACTIONS */}

      <div className="mt-8 flex flex-wrap items-center justify-between">
        <h2 className="h-[28px] text-[14px] font-semibold opacity-100">
          Course Chapters
        </h2>

        <Button
  variant="outline"
  onClick={async () => {
    const success =
      await handleSave();

    if (success) {
      addChapter();
    }
  }}
  className="gap-2 bg-black text-white"
>
  <Plus className="h-4 w-4" />

  Add Chapter
</Button>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-[#AD46FF]" />

            <span className="text-sm font-medium">
              Processing...
            </span>
          </div>
        </div>
      )}

      {/* CHAPTERS */}

      <div className="mt-6 space-y-4">
        {course.chapters.map(
          (
            chapter,
            index
          ) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              errors={errors}
              onChange={(
                patch
              ) =>
                updateChapter(
                  chapter.id,
                  patch
                )
              }
              onDelete={() =>
                deleteChapter(
                  chapter
                )
              }
              onDeleteTopic={(
                topic
              ) =>
                deleteTopic(
                  chapter.id,
                  topic
                )
              }
            />
          )
        )}
      </div>

      {/* FOOTER */}

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <Button
  variant="outline"
  onClick={async () => {
    const success =
      await handleSave();

    if (success) {
      addChapter();
    }
  }}
  className="gap-2 bg-black text-white"
>
  <Plus className="h-4 w-4" />

  Add Chapter
</Button>
        <Button
          onClick={
            handleSave
          }
          disabled={loading}
          className="gap-2 bg-[#9810FA] hover:bg-[#7d0ed1] active:scale-95"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          Save Course
        </Button>
      </div>
    </div>
  );
};

export default CourseStructureBuilder;