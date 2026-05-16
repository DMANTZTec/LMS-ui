import { ChevronDown,Plus,Trash2,GripVertical, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTopic } from "./types";
import TopicCard from "./TopicCard";
import { cn } from "@/lib/utils";

const ChapterCard = ({chapter,index,errors,onChange,onDelete,onDeleteTopic,}) => {
  return (
    <div className="rounded-2xl border-2 border-l-4 border-[#9810FA]/40 hover:border-[#9810FA] bg-card p-4 shadow-sm transition-all">

      {/* HEADER */}

      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4" />

        <button
          onClick={() =>
            onChange({
              expanded:
                !chapter.expanded,
            })
          }
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <ChevronDown className={cn( "h-[20px] w-[20px] transition-transform",
              !chapter.expanded &&
                "-rotate-90"
            )}
          />
        </button>

        <h2 className="
          w-auto
          h-[24px]
          relative
          top-[-1.67px]
          text-[14px]
          sm:text-[15px]
          md:text-[16px]
          font-semibold
          leading-[24px]
          tracking-normal
          text-[#9810FA]
          opacity-100
        "
        >
          Chapter {index + 1}
        </h2>

        <div className="ml-auto">
          <Button
            variant="outline"
            size="icon"
            className="hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-[16px] w-[16px]" />
          </Button>
        </div>
      </div>

      {/* CONTENT */}

      {chapter.expanded && (
        <div className="mt-3 space-y-3">

          {/* TITLE */}

          <div>
            <Input
              className="w-full h-[36px] px-4 font-semibold rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
              placeholder={`Chapter ${index + 1} Title`}
              value={chapter.title}
              onChange={(e) =>
                onChange({
                  title:
                    e.target.value,
                })
              }
            />

            {errors?.[
              `chapters.${index}.title`
            ] && (
              <p className="mt-1 text-sm text-red-500">
                {
                  errors[
                    `chapters.${index}.title`
                  ]
                }
              </p>
            )}
          </div>

          {/* DESCRIPTION */}

          <div>
            <Textarea
              placeholder="Chapter description"
              className="w-full  px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
              value={
                chapter.description
              }
              onChange={(e) =>
                onChange({
                  description:
                    e.target.value,
                })
              }
            />

            {errors?.[
              `chapters.${index}.description`
            ] && (
              <p className="mt-1 text-sm text-red-500">
                {
                  errors[
                    `chapters.${index}.description`
                  ]
                }
              </p>
            )}
          </div>

          {/* TOPICS */}

          <div className="space-y-3">
            {chapter.topics.map(
              (topic, i) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  index={i}
                  chapterIndex={index}
                  errors={errors}
                  onChange={(
                    patch
                  ) =>
                    onChange({
                      topics:
                        chapter.topics.map((t) =>
                            t.id === topic.id ? {
                                  ...t,
                                  ...patch,
                                  isChanged: true,
                                }
                              : t
                        ),
                    })
                  }
                  onDelete={() =>
                    onDeleteTopic(
                      topic
                    )
                  }
                />
              )
            )}
          </div>

          {/* TOPIC ARRAY ERROR */}

          {errors?.[
            `chapters.${index}.topics`
          ] && (
            <p className="text-sm text-red-500">
              {
                errors[
                  `chapters.${index}.topics`
                ]
              }
            </p>
          )}

          {/* ADD TOPIC */}

          <Button
            variant="outline"
            onClick={() =>
              onChange({
                topics: [
                  ...chapter.topics,
                  createTopic(),
                ],
              })
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Topic
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChapterCard;