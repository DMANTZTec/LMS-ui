import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Image as ImageIcon, BookOpen } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCloudinaryUpload } from "@/components/useCloudinaryUpload";
import { api } from "@/api/CourseMgtController";


const MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 1000 * 1024 * 1024; // 100MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_VIDEO_TYPES = ["image/jpeg", "image/jpg", "image/png","video/mp4", "video/quicktime"]; 

const schema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  coursetitle: z.string().min(1, "Course title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  language: z.string().min(1, "Language is required"),
  skills: z.string().min(1, "Skills are required"),
  subject: z.string().min(1, "Subject is required"),
  provider: z.string().min(1, "Provider is required"),
  level: z.string().min(1, "Level is required"),
  courseImage: z
    .any()
    .refine((files) => files?.length === 1, "Course image is required.")
    .refine((files) => files?.[0]?.size <= MAX_IMAGE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ),
  courseVideo: z
    .any()
    .refine((files) => files?.length === 1, "Course video is required.")
    .refine((files) => files?.[0]?.size <= MAX_VIDEO_SIZE, `Max file size is 100MB.`)
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      "Only  .mp4 and .mov formats are supported."
    ),
});

const AddCourse = () => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState({ imgName: "", vidName: "" });
  const { uploadFile } = useCloudinaryUpload();

  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const fetchCourseId = async () => {
    try {
      const res = await api.viewAllCourses();
      const data = res.data;
      let nextId = "BD001";
      if (data.length > 0) {
        const lastId = data[data.length - 1].courseId;
        const num = parseInt(lastId.replace(/\D/g, ""), 10);
        nextId = `BD${String(num + 1).padStart(3, "0")}`;
      }
      setValue("courseId", nextId);
    } catch (err) {
      console.error("Failed to fetch course ID:", err);
      setValue("courseId", "BD001");
    }
  };

  useEffect(() => {
    fetchCourseId();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      // 1. Upload files to Cloudinary in parallel


      const [imageUrl, videoUrl] = await Promise.all([
        uploadFile(data.courseImage[0], "image"),
        uploadFile(data.courseVideo[0], "image"),
      ]);


      // 2. Prepare JSON payload with the returned Cloudinary URLs
      const payload = {
        courseTitle: data.coursetitle,
        description: data.description,
        language: data.language,
        skills:data.skills.split(",").map((s) => s.trim()),
        subjectId: Number(data.subject),
        providerId: Number(data.provider),
        level: data.level.toUpperCase(),
        courseImage: imageUrl, // Backend should now expect URL strings
        introVideo: videoUrl,
      };

      console.log("Payload:", payload);

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const staffId = savedUser?.staffId || "SF00001";

      const response = await api.createCourse(staffId,payload);
     // console.log("Response:", response.data);
      alert("Course created ✅");
      reset();
      setPreviews({ imgName: "", vidName: "" });
      fetchCourseId();
    } catch (err) {
      alert(err.message || "An error occurred during submission.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50/50 p-4 font-sans">
      <Card className="w-full max-w-[850px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <CardHeader className="flex flex-row items-start justify-between p-8 pb-4">
          <div className="flex gap-4 items-start">
            <BookOpen className="w-8 h-8 text-blue-600 mt-1" strokeWidth={1.5} />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 leading-tight">Add New Course</h2>
              <p className="text-[15px] text-gray-500 mt-1">Fill in the details to add a new course to the catalog</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/Staff-dashboard")}
            className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </CardHeader>

        <CardContent className="p-8 pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Course ID */}
            <div className="space-y-2">
              <label htmlFor="courseId" className="text-[15px] font-medium text-gray-900">Course ID *</label>
              <input
                id="courseId"
                {...register("courseId")}
                readOnly
                className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-700 transition-all placeholder:text-gray-400 cursor-not-allowed"
                placeholder="e.g., CS101"
              />
              {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId.message}</p>}
            </div>

            {/* Row 2: Course Title */}
            <div className="space-y-2">
              <label htmlFor="coursetitle" className="text-[15px] font-medium text-gray-900">Course Title *</label>
              <input
                id="coursetitle"
                {...register("coursetitle")}
                className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                placeholder="e.g., Introduction to Computer Science"
              />
              {errors.coursetitle && <p className="text-red-500 text-xs mt-1">{errors.coursetitle.message}</p>}
            </div>

            {/* Row 3: Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-[15px] font-medium text-gray-900">Description *</label>
              <textarea
                id="description"
                {...register("description")}
                className="w-full h-[100px] p-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none placeholder:text-gray-400"
                placeholder="Provide a detailed description of the course..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Row 4: Language & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="language" className="text-[15px] font-medium text-gray-900">Language *</label>
                <select
                  id="language"
                  defaultValue=""
                  {...register("language")}
                  className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:calc(100%-12px)_center] bg-no-repeat"
                >
                  <option value="" disabled>Select language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
                {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="skills" className="text-[15px] font-medium text-gray-900">Skills *</label>
                <input
                  id="skills"
                  {...register("skills")}
                  className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g., Python, Machine Learning"
                />
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
              </div>
            </div>

            {/* Row 5: Subject, Provider, Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-[15px] font-medium text-gray-900">Subject *</label>
                <select
                  id="subject"
                  defaultValue=""
                  {...register("subject")}
                  className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:calc(100%-12px)_center] bg-no-repeat"
                >
                  <option value="" disabled>Select subject</option>
                  <option value="1">Computer Science</option>
                  <option value="2">Data Science</option>
                </select>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="provider" className="text-[15px] font-medium text-gray-900">Provider *</label>
                <select
                  id="provider"
                  defaultValue=""
                  {...register("provider")}
                  className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:calc(100%-12px)_center] bg-no-repeat"
                >
                  <option value="" disabled>Select provider</option>
                  <option value="1">Internal</option>
                  <option value="2">External</option>
                </select>
                {errors.provider && <p className="text-red-500 text-xs mt-1">{errors.provider.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="level" className="text-[15px] font-medium text-gray-900">Level *</label>
                <select
                  id="level"
                  defaultValue=""
                  {...register("level")}
                  className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:calc(100%-12px)_center] bg-no-repeat"
                >
                  <option value="" disabled>Select level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
              </div>
            </div>

            {/* Row 6: File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-[15px] font-medium text-gray-900">Course Image *</label>
                <div className="relative h-[160px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer bg-white group">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    {...register("courseImage", {
                      onChange: (e) => setPreviews((prev) => ({ ...prev, imgName: e.target.files[0]?.name })),
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <ImageIcon className="w-10 h-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                  <p className="text-[15px] text-slate-700 mb-1">
                    {previews.imgName ? <span className="text-blue-600 line-clamp-1 px-4 text-center">{previews.imgName}</span> : "Click to upload course image"}
                  </p>
                  <p className="text-[13px] text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                {errors.courseImage && <p className="text-red-500 text-xs mt-1">{errors.courseImage.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[15px] font-medium text-gray-900">Course Intro Video *</label>
                <div className="relative h-[160px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer bg-white group">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg ,video/mp4, video/quicktime"
                    {...register("courseVideo", {
                      onChange: (e) => setPreviews((prev) => ({ ...prev, vidName: e.target.files[0]?.name })),
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Upload className="w-10 h-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                  <p className="text-[15px] text-slate-700 mb-1">
                    {previews.vidName ? <span className="text-blue-600 line-clamp-1 px-4 text-center">{previews.vidName}</span> : "Click to upload intro video"}
                  </p>
                  <p className="text-[13px] text-gray-500">MP4, MOV up to 100MB</p>
                </div>
                {errors.courseVideo && <p className="text-red-500 text-xs mt-1">{errors.courseVideo.message}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-start gap-4 pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  reset();
                  setPreviews({ imgName: "", vidName: "" });
                  fetchCourseId();
                }}
                className="w-32 h-[44px] rounded-[8px] border-gray-200 font-medium text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-48 h-[44px] rounded-[8px] bg-[#0A0A0B] text-white font-medium hover:bg-black/90 transition-all disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? "Uploading & Adding..." : "Add Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCourse;