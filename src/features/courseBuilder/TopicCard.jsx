import {ChevronDown,FileText, GripVertical, Trash2, Video, Link as LinkIcon,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import ReferenceList from "./ReferenceList";

const tabs = [
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
  },
  {
    id: "videos",
    label: "Videos",
    icon: Video,
  },
  {
    id: "urls",
    label: "URLs",
    icon: LinkIcon,
  },
];

const TopicCard = ({ topic, index,chapterIndex,errors,onChange,onDelete,}) => {
  return (
    <div className="w-full space-y-3 p-3 relative rounded-[10px] border border-[#BEDBFF] bg-[#EFF6FF] opacity-100">

      {/* HEADER */}

      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

        <button
          onClick={() =>
            onChange({
              expanded: !topic.expanded,
            })
          }
          className={cn(
            "transition-transform duration-200",
            !topic.expanded &&
              "-rotate-90"
          )}
        >
          <ChevronDown className="h-[16px] w-[16px]" />
        </button>

        <FileText className="h-4 w-4 shrink-0 text-[#155DFC]" />

        <span className="font-medium text-sm">
          Topic {index + 1}
        </span>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-destructive bg-white"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CONTENT */}

      {topic.expanded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-1">

          {/* INPUTS */}

          <div className="flex gap-2">
            <div className="flex-[7]">
              <Input
                className="w-full h-[36px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                placeholder={`Topic ${index + 1} Title`}
                value={topic.title}
                onChange={(e) =>
                  onChange({
                    title: e.target.value,
                  })
                }
              />

              {errors?.[
                `chapters.${chapterIndex}.topics.${index}.title`
              ] && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors[
                      `chapters.${chapterIndex}.topics.${index}.title`
                    ]
                  }
                </p>
              )}
            </div>

            <div className="flex-[3]">
              <Input
                className="w-full h-[36px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                placeholder="30 mins"
                value={
                  topic.duration || ""
                }
                onChange={(e) =>
                  onChange({
                    duration:
                      e.target.value,
                  })
                }
              />

              {errors?.[
                `chapters.${chapterIndex}.topics.${index}.duration`
              ] && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors[
                      `chapters.${chapterIndex}.topics.${index}.duration`
                    ]
                  }
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <Textarea
              className="w-full h-[64px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
              placeholder="Topic Description"
              value={
                topic.description
              }
              onChange={(e) =>
                onChange({
                  description:
                    e.target.value,
                })
              }
            />

            {errors?.[
              `chapters.${chapterIndex}.topics.${index}.description`
            ] && (
              <p className="mt-1 text-sm text-red-500">
                {
                  errors[
                    `chapters.${chapterIndex}.topics.${index}.description`
                  ]
                }
              </p>
            )}
          </div>

          {/* TABS */}

          <div className="space-y-3">
            <div className="flex flex-col gap-2">

              <span className="w-auto min-w-[65px] h-[16px] text-[11px] sm:text-[12px] font-medium leading-[16px] tracking-normal text-[#4A5565] opacity-100">
                References
              </span>

              <div className="flex w-full gap-1 rounded-full bg-muted/50 p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  const isActive = topic.activeTab ===  tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onChange({ activeTab: tab.id,
                        })
                      }
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-full py-1.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-white shadow-sm text-foreground"
                          : "text-muted-foreground hover:bg-[#F3F3F5]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />

                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* REFERENCES */}

            <div className="rounded-lg border border-[#B9F8CF] p-1">
              <ReferenceList
                topic={topic}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCard;