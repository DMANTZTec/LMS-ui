import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/api/CourseMgtController';
import Header from '../main/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Clock, Loader2, AlertCircle } from 'lucide-react';
import { isAuthenticated, getUserRole } from '@/utils/tokenUtility';

const levelColors = {
  BEGINNER: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INTERMEDIATE: "bg-amber-100 text-amber-700 border-amber-200",
  ADVANCED: "bg-red-100 text-red-700 border-red-200",
};

const subjectColors = {
  "Computer Science": "bg-teal-50 text-teal-700 border-teal-200",
  Backend: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubject = searchParams.get('subject');

  // Auth Checks
  const authed = Boolean(isAuthenticated());
  const role = getUserRole();
  const dashboardPath = role === 'STUDENT' ? '/student-dashboard' : '/Staff-dashboard';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const result = await api.viewAllCourses();
        setCourses(result?.data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleClearFilter = () => {
    searchParams.delete('subject');
    setSearchParams(searchParams);
  };

  const handleEnroll = () => {
    if (authed) {
      if (role === 'STUDENT') {
        // Show self-enrollment alert modal for students
        setShowModal(true);
      } else {
        // Redirect staff/admin back to their dashboard
        navigate(dashboardPath);
      }
    } else {
      // Unauthenticated users navigate to register
      navigate('/student-register');
    }
  };

  // Filter courses based on URL search query
  const filteredCourses = selectedSubject
    ? courses.filter((course) => {
        const query = selectedSubject.toLowerCase();
        return course.subjectNm?.toLowerCase().includes(query);
      })
    : courses;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f4f7fb] font-sans">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
            {authed ? (
              <Button
                onClick={() => navigate(dashboardPath)}
                variant="outline"
                className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 flex items-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 flex items-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Main Page
              </Button>
            )}

            {!loading && !error && (
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
                {selectedSubject && (
                  <span className="ml-1 text-teal-700 font-semibold">
                    for "{selectedSubject}"
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 my-8 text-sm">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <p className="text-gray-500 font-medium text-base mb-2">
                No courses found for "{selectedSubject}".
              </p>
              <Button
                variant="link"
                onClick={handleClearFilter}
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Clear filter to view all courses
              </Button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-white rounded-2xl overflow-hidden border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col p-0"
                >
                  <CardHeader className="p-0 relative h-44 bg-teal-100 overflow-hidden">
                    <img
                      src={course.courseImage}
                      alt={course.courseTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    <Badge
                      variant="secondary"
                      className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        levelColors[course.level] ?? "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {course.level
                        ? course.level.charAt(0) + course.level.slice(1).toLowerCase()
                        : "General"}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-5 flex flex-col flex-1">
                    <Badge
                      variant="outline"
                      className={`inline-block self-start text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 border ${
                        subjectColors[course.subjectNm] ?? "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {course.subjectNm}
                    </Badge>

                    <h2 className="text-gray-900 font-bold text-lg leading-snug mb-2 hover:text-teal-700 transition-colors">
                      {course.courseTitle}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {course.skills
                        ?.filter((skill) => skill && skill.trim() !== "")
                        .map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </CardContent>

                  <CardFooter className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.language}</span>
                    </div>
                    <Button
                      onClick={handleEnroll}
                      size="sm"
                      className="bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-full px-4 text-xs font-semibold transition-colors"
                    >
                      Enroll Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Small Popup Modal for Self-Enrollment Notice */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm rounded-2xl p-6 text-center">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-gray-900">
              Notice
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-1">
              Self enrollment service is not available right now. Please contact your administrator.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-center">
            <Button
              onClick={() => setShowModal(false)}
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-full px-6 text-xs font-semibold"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}