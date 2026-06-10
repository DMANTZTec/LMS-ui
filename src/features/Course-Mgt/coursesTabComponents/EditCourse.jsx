import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Image as ImageIcon, BookOpen, Loader2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/api/CourseMgtController";
// Assuming providerApi comes from your project imports structure:
import { providerApi } from "@/api/provider-controller.api";
import toast from "react-hot-toast";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

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
    .optional()
    .refine((files) => !files || files.length === 0 || files.length === 1, "Invalid file count.")
    .refine((files) => !files || !files[0] || files[0] instanceof File === false || files[0].size <= MAX_IMAGE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => !files || !files[0] || files[0] instanceof File === false || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ),
  courseVideo: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files.length === 1, "Invalid file count.")
    .refine((files) => !files || !files[0] || files[0] instanceof File === false || files[0].size <= MAX_VIDEO_SIZE, `Max file size is 100MB.`)
    .refine(
      (files) => !files || !files[0] || files[0] instanceof File === false || ACCEPTED_VIDEO_TYPES.includes(files[0].type),
      "Only .mp4 and .mov formats are supported."
    ),
});

const EditCourse = ({ course, onUpdateSuccess }) => {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [providers, setProviders] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(false);

  const [previews, setPreviews] = useState({ 
    imgUrl: "", 
    imgName: "", 
    vidUrl: "", 
    vidName: "" 
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Fetch Dropdown Selections on component initialization
  const fetchProviders = async () => {
    setProvidersLoading(true);
    try {
      const result = await providerApi.getAllProviders();
      if (result && result.data) {
        setProviders(result.data);
      }
    } catch (error) {
      console.error("Failed to load providers:", error);
    } finally {
      setProvidersLoading(false);
    }
  };

  const fetchSubjects = async () => {
    setSubjectsLoading(true);
    try {
      const result = await api.viewAllSubjects();
      if (result && result.data) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProviders();
      fetchSubjects();
    }
  }, [open]);

  // Pre-populate fields and normalize metadata formats
  useEffect(() => {
    if (course) {
      let subjectValue = "";
      if (course.subjectId) {
        subjectValue = String(course.subjectId);
      } else if (course.subject) {
        subjectValue = typeof course.subject === "object" && course.subject.id ? String(course.subject.id) : String(course.subject);
      }

      let providerValue = "";
      if (course.providerId) {
        providerValue = String(course.providerId);
      } else if (course.provider) {
        providerValue = typeof course.provider === "object" && course.provider.id ? String(course.provider.id) : String(course.provider);
      }

      reset({
        courseId: course.courseId || "",
        coursetitle: course.coursetitle || course.courseTitle || "",
        description: course.description || "",
        language: course.language || "",
        skills: Array.isArray(course.skills) ? course.skills.join(", ") : course.skills || "",
        subject: subjectValue, 
        provider: providerValue,
        level: course.level || "",
      });

      const existingImgName = course.courseImage && typeof course.courseImage === 'string' 
        ? course.courseImage.split('/').pop() 
        : "Existing Image Asset";
        
      const existingVidName = course.introVideo && typeof course.introVideo === 'string' 
        ? course.introVideo.split('/').pop() 
        : "Existing Video Asset";

      setPreviews({
        imgUrl: course.courseImage || "",
        imgName: course.courseImage ? existingImgName : "",
        vidUrl: course.introVideo || "",
        vidName: course.introVideo ? existingVidName : "",
      });
    }
  }, [course, reset]);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (type === "image") {
      setPreviews((prev) => ({
        ...prev,
        imgUrl: objectUrl,
        imgName: file.name
      }));
    } else if (type === "video") {
      setPreviews((prev) => ({
        ...prev,
        vidUrl: objectUrl,
        vidName: file.name
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (previews.imgUrl && previews.imgUrl.startsWith("blob:")) URL.revokeObjectURL(previews.imgUrl);
      if (previews.vidUrl && previews.vidUrl.startsWith("blob:")) URL.revokeObjectURL(previews.vidUrl);
    };
  }, [previews.imgUrl, previews.vidUrl]);

  const onSubmit = async (data) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const staffId = savedUser?.staffId || "SF00001";
      const targetCourseId = Number(course.id || course.courseId);

      const updateCourseRequest = {
        courseTitle: data.coursetitle,
        description: data.description,
        language: data.language,
        skills: data.skills.split(",").map((s) => s.trim()),
        subjectId: Number(data.subject),   
        providerId: Number(data.provider),  
        level: data.level.toUpperCase(),
      };

      await api.updateCourse(targetCourseId, staffId, updateCourseRequest);

      const checkImageUpdate = data.courseImage?.[0];
      if (checkImageUpdate && checkImageUpdate instanceof File) {
        await api.updateCourseImage(targetCourseId, staffId, checkImageUpdate);
      }

      const checkVideoUpdate = data.courseVideo?.[0];
      if (checkVideoUpdate && checkVideoUpdate instanceof File) {
        await api.updateCourseIntroVideo(targetCourseId, staffId, checkVideoUpdate);
      }

      toast.success("Course updated successfully ✅");
      setOpen(false); 
      onUpdateSuccess?.(); 
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Failed to update course"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1 h-auto rounded-full hover:bg-gray-100">
          <Pencil className="w-5 h-5 text-green-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[850px] p-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-sans gap-0">
        
        {/* Header Section */}
        <div className="flex flex-row items-start justify-between p-8 pb-4">
          <div className="flex gap-4 items-start">
            <BookOpen className="w-8 h-8 text-blue-600 mt-1" strokeWidth={1.5} />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 leading-tight">Edit Course Details</h2>
              <p className="text-[15px] text-gray-500 mt-1">Modify the catalog fields and resource criteria below</p>
            </div>
          </div>
          {/* <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button> */}
        </div>

        {/* Content Area Form */}
        <div className="p-8 pt-2 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Course ID */}
            <div className="space-y-2">
              <label htmlFor="courseId" className="text-[15px] font-medium text-gray-900">Course ID *</label>
              <input
                id="courseId"
                {...register("courseId")}
                readOnly
                className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-700 transition-all placeholder:text-gray-400 cursor-not-allowed"
              />
              {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId.message}</p>}
            </div>

            {/* Course Title */}
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

            {/* Description */}
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

            {/* Language & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="language" className="text-[15px] font-medium text-gray-900">Language *</label>
                <select
                  id="language"
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

            {/* Subject, Provider, Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Dynamic Subject Selection */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-[15px] font-medium text-gray-900">Subject *</label>
                <select
                  id="subject"
                  {...register("subject")}
                  className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:calc(100%-12px)_center] bg-no-repeat"
                >
                  <option value="" disabled>
                    {subjectsLoading ? "Loading subjects..." : "Select subject"}
                  </option>
                  {subjects.map((subj) => (
                    <option key={subj.id || subj.subjectId} value={String(subj.id || subj.subjectId)}>
                      {subj.subjectNm || subj.name || `Subject ${subj.id}`}
                    </option>
                  ))}
                </select>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              {/* Dynamic Provider Selection */}
              <div className="space-y-2">
                <label htmlFor="provider" className="text-[15px] font-medium text-gray-900">Provider *</label>
                <select
                  id="provider"
                  {...register("provider")}
                  className="w-full h-[46px] px-4 rounded-[8px] bg-[#F5F5F7] border-none focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:calc(100%-12px)_center] bg-no-repeat"
                >
                  <option value="" disabled>
                    {providersLoading ? "Loading providers..." : "Select provider"}
                  </option>
                  {providers.map((prov) => (
                    <option key={prov.id || prov.providerId} value={String(prov.id || prov.providerId)}>
                      {prov.providerName || prov.name || `Provider ${prov.id}`}
                    </option>
                  ))}
                </select>
                {errors.provider && <p className="text-red-500 text-xs mt-1">{errors.provider.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="level" className="text-[15px] font-medium text-gray-900">Level *</label>
                <select
                  id="level"
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

            {/* File Uploads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Course Image Area */}
              <div className="space-y-2">
                <label className="text-[15px] font-medium text-gray-900">Course Image</label>
                <div className="relative min-h-[160px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all cursor-pointer bg-white group">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    {...register("courseImage")}
                    onChange={(e) => {
                      register("courseImage").onChange(e);
                      handleFileChange(e, "image");
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {previews.imgUrl ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <img 
                        src={previews.imgUrl} 
                        alt="Course thumbnail" 
                        className="h-20 w-auto object-cover rounded-md shadow-sm border border-gray-100"
                      />
                      <span className="text-blue-600 text-sm font-medium line-clamp-1 text-center px-2">
                        {/* {previews.imgName} */}
                      </span>
                      <p className="text-xs text-gray-400">Click or drag to change image</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                      <p className="text-[15px] text-slate-700 mb-1">Click to replace image</p>
                      <p className="text-[13px] text-gray-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                {errors.courseImage && <p className="text-red-500 text-xs mt-1">{errors.courseImage.message}</p>}
              </div>

              {/* Course Intro Video Area */}
              <div className="space-y-2">
                <label className="text-[15px] font-medium text-gray-900">Course Intro Video</label>
                <div className="relative min-h-[160px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all cursor-pointer bg-white group">
                  <input
                    type="file"
                    accept="video/mp4, video/quicktime"
                    {...register("courseVideo")}
                    onChange={(e) => {
                      register("courseVideo").onChange(e);
                      handleFileChange(e, "video");
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {previews.vidUrl ? (
                    <div className="flex flex-col items-center gap-2 w-full z-20">
                      <video 
                        src={previews.vidUrl} 
                        controls 
                        className="h-24 w-full rounded-md max-w-xs bg-black"
                      />
                      <span className="text-blue-600 text-sm font-medium line-clamp-1 text-center px-2">
                        {/* {previews.vidName} */}
                      </span>
                      <p className="text-xs text-gray-400">Click or drag boundary area to change video</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                      <p className="text-[15px] text-slate-700 mb-1">Click to replace video</p>
                      <p className="text-[13px] text-gray-500">MP4, MOV up to 100MB</p>
                    </>
                  )}
                </div>
                {errors.courseVideo && <p className="text-red-500 text-xs mt-1">{errors.courseVideo.message}</p>}
              </div>

            </div>

            {/* Form Actions */}
            <div className="flex justify-start gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                className="w-32 h-[44px] rounded-[8px] border-gray-200 font-medium text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-48 h-[44px] rounded-[8px] bg-[#0A0A0B] text-white font-medium hover:bg-black/90 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Saving Changes..." : "Update Course"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourse;