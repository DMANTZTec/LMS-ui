import { Trash2, Plus, FileText, Video, Link as LinkIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uid } from "./types"; // Ensure this helper exists or use crypto.randomUUID()

const ReferenceList = ({ topic, onChange, onDeleteReference }) => {
  // --- DOCUMENTS VIEW ---
  if (topic.activeTab === "documents") {
    return (
      <div className="space-y-2 p-2 w-full max-w-full overflow-hidden">
        {topic.documents?.map((doc, i) => (
          <div
            key={doc.id}
            className="flex items-center gap-2 rounded-lg border bg-background p-2 min-h-[54px] w-full max-w-full overflow-hidden"
          >
            <FileText className="h-4 w-4 shrink-0 text-[#00A63E]" />

            
            <div className="flex-1 min-w-0 overflow-hidden space-y-2 p-0.5 -m-0.5">
              {doc.fileUrl ? (
                /* ALREADY UPLOADED */
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex w-full h-[32px] items-center px-4 rounded-[8px] bg-[#F3F3F5] text-sm font-normal hover:bg-[#EAEAEB] transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/20 text-blue-600 hover:underline outline-none"
                >
                  {doc.title || doc.fileName || `Document ${i + 1}`}
                </a>
              ) : (
              
                <>
                  {/* DOCUMENT TITLE */}
                  <Input
                    placeholder={`Document ${i + 1} title`}
                    value={doc.title || ""}
                    onChange={(e) => {
                      const documents = [...topic.documents];
                      documents[i] = { ...doc, title: e.target.value };
                      onChange({ documents });
                    }}
                    className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0 outline-none transition-all placeholder:text-gray-400"
                  />

                  {/* FILE UPLOAD BUTTON */}
                  <label 
                    htmlFor={`file-input-${doc.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-9 cursor-pointer items-center gap-2 rounded-[8px] bg-[#F3F3F5] px-3 text-sm text-muted-foreground transition-all hover:bg-muted w-full max-w-full overflow-hidden focus-within:ring-2 focus-within:ring-gray-500/20"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    
                    <span className="block flex-1 min-w-0 truncate text-left">
                      {doc.fileName || "Upload Document"}
                    </span>

                    <input
                      id={`file-input-${doc.id}`}
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const documents = [...topic.documents];
                        documents[i] = {
                          ...doc,
                          file: file,
                          fileName: file.name,
                        };
                        onChange({ documents });
                        console.log("UPLOADED FILE:", file);
                      }}
                    />
                  </label>
                </>
              )}
            </div>

            {/* DELETE */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 self-center hover:text-destructive"
              onClick={() => {
                if (doc.backendId) {
                  onDeleteReference("documents", doc);
                } else {
                  onChange({
                    documents: topic.documents.filter((d) => d.id !== doc.id),
                  });
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}

        {/* ADD DOCUMENT */}
        <Button
          variant="outline"
          className="w-full h-[32px] py-6"
          onClick={() =>
            onChange({
              documents: [
                ...(topic.documents || []),
                { id: uid(), title: "", fileName: "", file: null },
              ],
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </div>
    );
  }

  // --- VIDEOS VIEW ---
  if (topic.activeTab === "videos") {
    return (
      <div className="space-y-2 p-2 w-full max-w-full overflow-hidden">
        {topic.videos?.map((video, i) => (
          <div
            key={video.id}
            className="flex items-center gap-2 rounded-lg border bg-background p-2 min-h-[54px] w-full max-w-full overflow-hidden"
          >
            <Video className="h-4 w-4 shrink-0 text-red-500" />

            <div className="flex-1 min-w-0 overflow-hidden space-y-2 p-0.5 -m-0.5">
              {video.fileUrl ? (
                <a
                  href={video.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex w-full h-[32px] items-center px-4 rounded-[8px] bg-[#F3F3F5] text-sm font-normal hover:bg-[#EAEAEB] transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/20 text-blue-600 hover:underline outline-none"
                >
                  {video.title || video.fileName || `Video ${i + 1}`}
                </a>
              ) : (
                <>
                  <Input
                    placeholder={`Video ${i + 1} title`}
                    value={video.title || ""}
                    onChange={(e) => {
                      const videos = [...topic.videos];
                      videos[i] = { ...video, title: e.target.value };
                      onChange({ videos });
                    }}
                    className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0 outline-none transition-all placeholder:text-gray-400"
                  />

                  <label 
                    htmlFor={`video-input-${video.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-9 cursor-pointer items-center gap-2 rounded-[8px] bg-[#F3F3F5] px-3 text-sm text-muted-foreground transition-all hover:bg-muted w-full max-w-full overflow-hidden focus-within:ring-2 focus-within:ring-gray-500/20"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    <span className="block flex-1 min-w-0 truncate text-left">
                      {video.fileName || "Upload Video"}
                    </span>
                    <input
                      id={`video-input-${video.id}`}
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const videos = [...topic.videos];
                        videos[i] = {
                          ...video,
                          file: file,
                          fileName: file.name,
                        };
                        onChange({ videos });
                        console.log("VIDEO FILE:", file);
                      }}
                    />
                  </label>
                </>
              )}
            </div>

            {/* DELETE */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 self-center hover:text-destructive"
              onClick={() => {
                if (video.backendId) {
                  onDeleteReference("videos", video);
                } else {
                  onChange({
                    videos: topic.videos.filter((v) => v.id !== video.id),
                  });
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}

        {/* ADD VIDEO */}
        <Button
          variant="outline"
          className="w-full border py-6"
          onClick={() =>
            onChange({
              videos: [
                ...(topic.videos || []),
                { id: uid(), title: "", fileName: "", file: null },
              ],
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </div>
    );
  }

  // --- URLS VIEW (Default) ---
  return (
    <div className="space-y-2 p-2 w-full max-w-full overflow-hidden">
      {topic.urls?.map((u, i) => (
        <div key={u.id} className="flex items-start gap-2 rounded-lg border bg-background p-2 w-full max-w-full overflow-hidden">
          <LinkIcon className="mt-2 h-4 w-4 text-emerald-500 shrink-0" />
          <div className="flex-1 space-y-2 min-w-0 overflow-hidden p-0.5 -m-0.5">
            <Input
              placeholder={`Link ${i + 1} title`}
              value={u.title || ""}
              onChange={(e) => {
                const urls = [...topic.urls];
                urls[i] = { ...u, title: e.target.value };
                onChange({ urls });
              }}
              className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
            />

            {u.backendId ? (
              <div className="flex h-9 items-center rounded-[8px] bg-[#F3F3F5] px-4 text-sm w-full overflow-hidden focus-within:ring-2 focus-within:ring-gray-500/20">
                <a
                  href={u.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="truncate text-blue-600 hover:underline block w-full outline-none"
                >
                  {u.url}
                </a>
              </div>
            ) : (
              <Input
                placeholder="https://..."
                value={u.url || ""}
                onChange={(e) => {
                  const urls = [...topic.urls];
                  urls[i] = { ...u, url: e.target.value };
                  onChange({ urls });
                }}
                className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 hover:text-destructive"
            onClick={() => {
              if (u.backendId) {
                onDeleteReference("urls", u);
              } else {
                onChange({
                  urls: topic.urls.filter((x) => x.id !== u.id),
                });
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        className="w-full border-dashed py-6"
        onClick={() =>
          onChange({ urls: [...(topic.urls || []), { id: uid(), title: "", url: "" }] })
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add URL
      </Button>
    </div>
  );
};

export default ReferenceList;