import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/api/CourseMgtController';
import Header from '../main/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  Loader2,
  AlertCircle,
  BookOpen,
  List,
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  Globe,
  Layers,
} from 'lucide-react';
import { isAuthenticated, getUserRole } from '@/utils/tokenUtility';

const levelColors = {
  BEGINNER: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INTERMEDIATE: "bg-amber-100 text-amber-700 border-amber-200",
  ADVANCED: "bg-red-100 text-red-700 border-red-200",
};

export default function ViewCourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);

  const authed = Boolean(isAuthenticated());
  const role = getUserRole();
  const dashboardPath = role === 'STUDENT' ? '/student-dashboard' : '/Staff-dashboard';

  useEffect(() => {
    let cancelled = false;

    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError("Course not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const coursesRes = await api.viewAllCourses();
        const matchedCourse = (coursesRes?.data || []).find(
          (c) => c.courseId === courseId
        );

        if (!matchedCourse) {
          throw new Error("Course not found");
        }

        if (cancelled) return;
        setCourse(matchedCourse);

        const chaptersRes = await api.getChaptersByCourseId(courseId);
        const chaptersData = chaptersRes?.data || [];

        const chaptersWithTopics = await Promise.all(
          chaptersData.map(async (chapter) => {
            try {
              const topicsRes = await api.getTopicsByChapterId(chapter.id);
              return { ...chapter, topics: topicsRes?.data || [] };
            } catch (err) {
              console.error(
                `Failed to fetch topics for chapter ${chapter.id}:`,
                err
              );
              return { ...chapter, topics: [] };
            }
          })
        );

        chaptersWithTopics.sort(
          (a, b) => (a.chapterNum ?? 0) - (b.chapterNum ?? 0)
        );

        if (cancelled) return;
        setChapters(chaptersWithTopics);
        setExpandedChapters([]);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
        if (!cancelled) {
          setError("Failed to load course details. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCourseDetails();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const allExpanded =
    chapters.length > 0 &&
    chapters.every((chapter) => expandedChapters.includes(chapter.id));

  const toggleAllChapters = () => {
    setExpandedChapters(
      allExpanded ? [] : chapters.map((chapter) => chapter.id)
    );
  };

  const handleEnroll = () => {
    if (authed) {
      navigate(dashboardPath);
    } else {
      navigate('/student-register');
    }
  };

  const totalTopics = chapters.reduce(
    (acc, chapter) => acc + (chapter.topics?.length || 0),
    0
  );

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f4f7fb] font-sans">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Button
            onClick={() => navigate('/view-courses')}
            variant="outline"
            className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Button>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">
                Loading course details...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 my-8 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && course && (
            <>
              {/* Banner */}
              <div className="relative h-56 md:h-72 w-full overflow-hidden rounded-2xl bg-slate-900 mt-5 shadow-sm">
                {course.courseImage ? (
                  <img
                    src={course.courseImage}
                    alt={course.courseTitle}
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-800 via-teal-950 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono tracking-wider text-slate-300 border border-white/5">
                      {course.courseId}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        levelColors[course.level] ??
                        "bg-white/10 text-slate-200 border-white/10"
                      }`}
                    >
                      {course.level
                        ? course.level.charAt(0) +
                          course.level.slice(1).toLowerCase()
                        : "General"}
                    </Badge>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {course.courseTitle}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-teal-400" />
                      {course.subjectNm || "General"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-teal-400" />
                      {course.language || "English"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <List className="w-4 h-4 text-teal-400" />
                      {chapters.length} Chapters
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-400" />
                      {totalTopics} Topics
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
                {/* Curriculum */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-white rounded-2xl border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                        Course Description
                      </h2>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {course.description ||
                          "No description provided for this course."}
                      </p>
                    </CardContent>
                  </Card>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-teal-600" />
                        Course Curriculum
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                          {chapters.length} chapter
                          {chapters.length !== 1 ? "s" : ""} · {totalTopics}{" "}
                          topic
                          {totalTopics !== 1 ? "s" : ""}
                        </span>
                        {chapters.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleAllChapters}
                            className="h-7 gap-1.5 border-gray-300 bg-white text-xs text-gray-600 hover:bg-gray-50"
                          >
                            {allExpanded ? (
                              <>
                                <ChevronsUp className="w-3.5 h-3.5" />
                                Collapse All
                              </>
                            ) : (
                              <>
                                <ChevronsDown className="w-3.5 h-3.5" />
                                Expand All
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {chapters.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 font-medium">
                          No chapters available for this course yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chapters.map((chapter) => {
                          const isOpen = expandedChapters.includes(chapter.id);
                          const topics = chapter.topics || [];

                          return (
                            <div
                              key={chapter.id}
                              className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-teal-500 shadow-sm overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => toggleChapter(chapter.id)}
                                className="w-full flex items-start justify-between gap-3 p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="mt-0.5 text-gray-400 shrink-0">
                                    {isOpen ? (
                                      <ChevronDown className="w-5 h-5" />
                                    ) : (
                                      <ChevronRight className="w-5 h-5" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge className="bg-teal-600 text-white hover:bg-teal-600 text-xs">
                                        Chapter {chapter.chapterNum}
                                      </Badge>
                                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                        {chapter.chapterNm}
                                      </h3>
                                    </div>
                                    {/* Chapter Description */}
                                    {/* {chapter.chapterDesc && (
                                      <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                                        {chapter.chapterDesc}
                                      </p>
                                    )} */}
                                  </div>
                                </div>
                                <span className="shrink-0 flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                  <FileText className="w-3.5 h-3.5" />
                                  {topics.length} topic
                                  {topics.length !== 1 ? "s" : ""}
                                </span>
                              </button>

                              {isOpen && (
                                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                                  {topics.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic ml-8 mt-1">
                                      No topics added to this chapter.
                                    </p>
                                  ) : (
                                    <div className="ml-8 mt-1 space-y-2">
                                      {topics
                                        .slice()
                                        .sort(
                                          (a, b) =>
                                            (a.topicNumber ?? 0) -
                                            (b.topicNumber ?? 0)
                                        )
                                        .map((topic) => (
                                          <div
                                            key={topic.id}
                                            className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4"
                                          >
                                            <div className="flex items-start justify-between gap-3">
                                              <h4 className="text-sm font-medium text-teal-700 flex items-center gap-1.5">
                                                <FileText className="w-4 h-4 shrink-0" />
                                                {topic.topicNumber
                                                  ? `${topic.topicNumber}. `
                                                  : ""}
                                                {topic.topicName}
                                              </h4>
                                              {/* TOpic Time */}
                                              {/* {topic.expectedTimeMin ? (
                                                <span className="shrink-0 flex items-center gap-1 text-[11px] text-gray-500">
                                                  <Clock className="w-3.5 h-3.5" />
                                                  {topic.expectedTimeMin} min
                                                </span>
                                              ) : null} */}
                                            </div>
                                            {/* Topic Description */}
                                            {/* {topic.description && (
                                              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                                                {topic.description}
                                              </p>
                                            )} */}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {course.introVideo && (
                    <Card className="bg-white rounded-2xl border-gray-100 shadow-sm">
                      <CardContent className="p-5">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                          Introduction Video
                        </h2>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-slate-950">
                          <video
                            controls
                            className="w-full h-full object-contain"
                            poster={course.courseImage}
                          >
                            <source src={course.introVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {course.skills?.filter((skill) => skill && skill.trim() !== "")
                    .length > 0 && (
                    <Card className="bg-white rounded-2xl border-gray-100 shadow-sm">
                      <CardContent className="p-5">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                          Skills You Will Learn
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                          {course.skills
                            .filter((skill) => skill && skill.trim() !== "")
                            .map((skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-600 font-medium capitalize"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-gradient-to-b from-teal-50/60 to-white rounded-2xl border-teal-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 to-emerald-500" />
                    <CardContent className="p-5">
                      <h2 className="font-bold text-gray-900 text-sm mb-1">
                        Ready to start learning?
                      </h2>
                      <p className="text-xs text-gray-500 mb-4">
                        Enroll in this course to access all chapters and topics.
                      </p>
                      <Button
                        onClick={handleEnroll}
                        className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-full text-xs font-semibold py-4 h-auto"
                      >
                        Enroll Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-2xl border-gray-100 shadow-sm">
                    <CardContent className="p-5">
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Course Information
                      </h2>
                      <div className="divide-y divide-gray-100 text-xs">
                        <div className="flex justify-between py-2.5">
                          <span className="text-gray-500">Course ID</span>
                          <span className="font-mono text-gray-800 font-semibold">
                            {course.courseId || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <span className="text-gray-500">Subject</span>
                          <span className="text-gray-800 font-semibold">
                            {course.subjectNm || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <span className="text-gray-500">Level</span>
                          <span className="text-gray-800 font-medium">
                            {course.level
                              ? course.level.charAt(0) +
                                course.level.slice(1).toLowerCase()
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <span className="text-gray-500">Language</span>
                          <span className="text-gray-800 font-medium">
                            {course.language || "—"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {!loading && !error && !course && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <p className="text-sm text-gray-500 font-medium">
                Course not found.
              </p>
              <Button
                variant="link"
                onClick={() => navigate('/view-courses')}
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Back to all courses
              </Button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
