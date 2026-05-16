import { Trash2, Plus, FileText, Video, Link as LinkIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uid } from "./types"; // Ensure this helper exists or use crypto.randomUUID()

const ReferenceList = ({ topic, onChange }) => {
  // --- DOCUMENTS VIEW ---
  if (topic.activeTab === "documents") {
    return (
      <div className="space-y-2 p-2">
        {topic.documents?.map((doc, i) => (
          <div key={doc.id} className="flex items-start gap-2 rounded-lg border bg-background p-2">
            <FileText className="mt-2 h-4 w-4 shrink-0 text-[#00A63E]" />
            <div className="flex-1 space-y-2">
              <Input
              
                placeholder={`Document ${i + 1} title`}
                value={doc.title}
                onChange={(e) => {
                  const documents = [...topic.documents];
                  documents[i] = { ...doc, title: e.target.value };
                  onChange({ documents });
                }}
                className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
              />
              <label className="flex h-9 bg-[#F3F3F5] cursor-pointer items-center gap-2 rounded-[8px] px-3 text-sm text-muted-foreground hover:bg-muted transition-colors">
                <Upload className="h-4 w-4" />
                <span className="truncate">{doc.fileName || "Upload Document"}</span>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const documents = [...topic.documents];
                    documents[i] = { ...doc, fileName: file.name };
                    onChange({ documents });
                    
                  }}
                  className="hidden w-full h-[32px] border-none placeholder:text-gray-400"
                />
              </label>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 self-center" onClick={() =>
              onChange({ documents: topic.documents.filter((d) => d.id !== doc.id) })
            }>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full h-[32px]  py-6" onClick={() =>
          onChange({ documents: [...(topic.documents || []), { id: uid(), title: "", fileName: "" }] })
        }
        >
          <Plus className="mr-2 h-4 w-4" /> Add Document
        </Button>
      </div>
    );
  }

  // --- VIDEOS VIEW ---
  if (topic.activeTab === "videos") {
    return (
      <div className="space-y-2 p-2">
        {topic.videos?.map((v, i) => (
          <div key={v.id} className="flex items-start gap-2 rounded-lg border bg-background p-2">
            <Video className="mt-2 h-4 w-4 text-red-500" />
            <div className="flex-1 space-y-2">
              <Input
                placeholder={`Video ${i + 1} title`}
                value={v.title}
                onChange={(e) => {
                  const videos = [...topic.videos];
                  videos[i] = { ...v, title: e.target.value };
                  onChange({ videos });
                }}
                className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
              />
              <Input
                placeholder="Video URL"
                
                value={v.url}
                onChange={(e) => {
                  const videos = [...topic.videos];
                  videos[i] = { ...v, url: e.target.value };
                  onChange({ videos });
                }}
                className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                
              />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 self-center" onClick={() =>
              onChange({ videos: topic.videos.filter((x) => x.id !== v.id) })
            }>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full border py-6" onClick={() =>
          onChange({ videos: [...(topic.videos || []), { id: uid(), title: "", url: "" }] })
        }>
          <Plus className="mr-2 h-4 w-4" /> Add Video
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
              value={u.title}
              onChange={(e) => {
                const urls = [...topic.urls];
                urls[i] = { ...u, title: e.target.value };
                onChange({ urls });
              }}
              className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
            />
            <Input
              placeholder="https://..."
              value={u.url}
              onChange={(e) => {
                const urls = [...topic.urls];
                urls[i] = { ...u, url: e.target.value };
                onChange({ urls });
              }}
              className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() =>
            onChange({ urls: topic.urls.filter((x) => x.id !== u.id) })
          }>
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