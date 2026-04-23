import { useState } from "react";

const CLOUD_NAME = "dwmj7vogf";

const PRESET_MAP = {
  image: "upload_img",
  video: "upload_video",
};

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file, type) => {
    try {
      setUploading(true);
      setError(null);

      const fileType =
        type || (file.type.startsWith("video") ? "video" : "image");

      const uploadPreset = PRESET_MAP[fileType];

      if (!uploadPreset) {
        throw new Error("Invalid file type");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const url = `https://api.cloudinary.com/v1_1/dwmj7vogf/image/upload`;

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Upload failed");
      }

      return data.secure_url;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};