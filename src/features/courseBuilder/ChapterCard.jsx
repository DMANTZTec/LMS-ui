import { ChevronDown,Plus,Trash2,GripVertical, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTopic } from "./types";
import TopicCard from "./TopicCard";
import { cn } from "@/lib/utils";
import {List, arrayMove,} from "react-movable";

import toast from "react-hot-toast";

import { api } from "@/api/CourseMgtController";


const ChapterCard = ({chapter,index,errors,onChange,onDelete,onDeleteTopic,onDeleteReference,  dragHandleProps,}) => {

  return (
    <div className="rounded-2xl border-2 border-l-4 border-[#9810FA]/40 hover:border-[#9810FA] bg-card p-4 shadow-sm transition-all" >

      {/* HEADER */}

      <div className="flex items-center gap-2">
     <div className="flex items-center gap-2">
  {/* Hooking the specific drag trigger mouse handlers onto this wrap wrapper */}
  <div 
    {...(dragHandleProps ? {
      onMouseDown: dragHandleProps.onMouseDown,
      onTouchStart: dragHandleProps.onTouchStart
    } : {})}
    className={cn(
      "p-1 rounded cursor-grab active:cursor-grabbing hover:bg-muted", 
      !dragHandleProps && "opacity-30 cursor-not-allowed"
    )}
  >
    <GripVertical className="h-4 w-4 text-muted-foreground" />
  </div>
  
  {/* Rest of header buttons... */}
</div>

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

          <List
  values={chapter.topics}
  onChange={async ({
    oldIndex,
    newIndex,
  }) => {

    const reordered =
      arrayMove(
        chapter.topics,
        oldIndex,
        newIndex
      );

    onChange({
      topics: reordered,
    });

    try {

      const movedTopic =
        reordered[newIndex];

      await api.moveTopic(
        movedTopic.backendId,
        newIndex + 1
      );

      toast.success(
        "Topic moved successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to move topic"
      );
    }
  }}
  renderList={({
    children,
    props,
  }) => (
    <div
      {...props}
      className="space-y-3"   style={{
      position: "relative",
    }}
    >
      {children}
    </div>
  )}
  renderItem={({  
    value: topic,
    props,
    index: topicIndex,
    isDragged,
  }) => (
   <div
    {...props}
    style={{
      ...props.style,
      minHeight: isDragged
        ? props.style?.height || 120
        : undefined,
      zIndex: isDragged ? 9999 : 1,
    }}
  >
      <TopicCard
         topic={{
    ...topic,
    expanded: isDragged
      ? false
      : topic.expanded,
  }}
        index={topicIndex}
        chapterIndex={index}
        errors={errors}
       dragHandleProps={{
  onMouseDown:
    props.onMouseDown,
  onTouchStart:
    props.onTouchStart,
}}

        onChange={(patch) =>
          onChange({
            topics:
              chapter.topics.map(
                (t) =>
                  t.id === topic.id
                    ? {
                        ...t,
                        ...patch,
                        isChanged: true,
                      }
                    : t
              ),
          })
        }

        onDelete={() =>
          onDeleteTopic(topic)
        }

        onDeleteReference={(
          type,
          reference
        ) =>
          onDeleteReference(
            topic.id,
            type,
            reference
          )
        }
      />
    </div>
  )}
/>

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