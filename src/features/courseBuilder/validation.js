import { z } from "zod";

export const topicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Topic title is required"),

  duration: z
    .string()
    .trim()
    .min(1, "Duration is required"),

  description: z
    .string()
    .trim()
    .min(1, "Topic description is required"),
});

export const chapterSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Chapter title is required"),

  description: z
    .string()
    .trim()
    .min(1, "Chapter description is required"),

  topics: z
    .array(topicSchema)
});

export const courseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Course name required"),

  chapters: z
    .array(chapterSchema)
    .min(1, "Add at least one chapter"),
});