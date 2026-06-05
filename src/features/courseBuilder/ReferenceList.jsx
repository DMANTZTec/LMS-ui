import { Trash2, Plus, FileText, Video, Link as LinkIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uid } from "./types"; // Ensure this helper exists or use crypto.randomUUID()

const ReferenceList = ({ topic, onChange,onDeleteReference }) => {
  // --- DOCUMENTS VIEW ---
if (topic.activeTab === "documents") {
  return (
    <div className="space-y-2 p-2">
      {topic.documents?.map((doc, i) => (
        <div
          key={doc.id}
          className="flex items-start gap-2 rounded-lg border bg-background p-2"
        >
          <FileText className="mt-2 h-4 w-4 shrink-0 text-[#00A63E]" />

          <div className="flex-1 space-y-2">

            {/* DOCUMENT TITLE */}
            <Input
              placeholder={`Document ${i + 1} title`}
              value={doc.title || ""}
              onChange={(e) => {
                const documents = [...topic.documents];

                documents[i] = {
                  ...doc,
                  title: e.target.value,
                };

                onChange({ documents });
              }}
              className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
            />

            {/* FILE UPLOAD */}
            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-[8px] bg-[#F3F3F5] px-3 text-sm text-muted-foreground transition-colors hover:bg-muted">

              <Upload className="h-4 w-4" />

              {doc.fileUrl ? (
  <a
    href={doc.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="truncate text-blue-600 hover:underline"
  >
    {doc.title || "Open Document"}
  </a>
) : (
  <span className="truncate">
    {doc.fileName || "Upload Document"}
  </span>
)}

              <input
                type="file"
                className="hidden"
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
          </div>

          {/* DELETE */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 self-center"
            onClick={() => {
  if (doc.backendId) {
    onDeleteReference(
      "documents",
      doc
    );
  } else {
    onChange({
      documents:
        topic.documents.filter(
          (d) => d.id !== doc.id
        ),
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
              {
                id: uid(),
                title: "",
                fileName: "",
                file: null,
              },
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
 // --- VIDEOS VIEW ---
if (topic.activeTab === "videos") {
  return (
    <div className="space-y-2 p-2">
      {topic.videos?.map((video, i) => (
        <div
          key={video.id}
          className="flex items-start gap-2 rounded-lg border bg-background p-2"
        >
          <Video className="mt-2 h-4 w-4 text-red-500" />

          <div className="flex-1 space-y-2">

            {/* VIDEO TITLE */}
            <Input
              placeholder={`Video ${i + 1} title`}
              value={video.title || ""}
              onChange={(e) => {
                const videos = [...topic.videos];

                videos[i] = {
                  ...video,
                  title: e.target.value,
                };

                onChange({ videos });
              }}
              className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
            />

            {/* VIDEO FILE */}
            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-[8px] bg-[#F3F3F5] px-3 text-sm text-muted-foreground transition-colors hover:bg-muted">

              <Upload className="h-4 w-4" />

              {video.fileUrl ? (
  <a
    href={video.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="truncate text-blue-600 hover:underline"
  >
    {video.title || "Open Video"}
  </a>
) : (
  <span className="truncate">
    {video.fileName || "Upload Video"}
  </span>
)}

              <input
                type="file"
                accept="video/*"
                className="hidden"
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
          </div>

          {/* DELETE */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 self-center"
           onClick={() => {
  if (video.backendId) {
    onDeleteReference(
      "videos",
      video
    );
  } else {
    onChange({
      videos:
        topic.videos.filter(
          (v) => v.id !== video.id
        ),
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
              {
                id: uid(),
                title: "",
                fileName: "",
                file: null,
              },
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
    <div className="space-y-2 p-2">
      {topic.urls?.map((u, i) => (
        <div key={u.id} className="flex items-start gap-2 rounded-lg border bg-background p-2">
          <LinkIcon className="mt-2 h-4 w-4 text-emerald-500" />
          <div className="flex-1 space-y-2">

  <Input
    placeholder={`Link ${i + 1} title`}
    value={u.title || ""}
    onChange={(e) => {
      const urls = [...topic.urls];

      urls[i] = {
        ...u,
        title: e.target.value,
      };

      onChange({ urls });
    }}
    className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none"
  />

  {u.backendId ? (
    <a
      href={u.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-[32px] truncate rounded-[8px] bg-[#F3F3F5] px-4 py-2 text-sm text-blue-600 hover:underline"
    >
      {u.url}
    </a>
  ) : (
    <Input
      placeholder="https://..."
      value={u.url || ""}
      onChange={(e) => {
        const urls = [...topic.urls];

        urls[i] = {
          ...u,
          url: e.target.value,
        };

        onChange({ urls });
      }}
      className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none"
    />
  )}
</div>
          <Button
  variant="ghost"
  size="icon"
  className="h-8 w-8 hover:text-destructive"
  onClick={() => {
    if (u.backendId) {
      onDeleteReference(
        "urls",
        u
      );
    } else {
      onChange({
        urls: topic.urls.filter(
          (x) => x.id !== u.id
        ),
      });
    }
  }}
>
  <Trash2 className="h-3.5 w-3.5" />
</Button>
        </div>
      ))}
      <Button variant="outline" className="w-full border-dashed py-6" onClick={() =>
        onChange({ urls: [...(topic.urls || []), { id: uid(), title: "", url: "" }] })
      }>
        <Plus className="mr-2 h-4 w-4" /> Add URL
      </Button>
    </div>
  );
};

export default ReferenceList; 