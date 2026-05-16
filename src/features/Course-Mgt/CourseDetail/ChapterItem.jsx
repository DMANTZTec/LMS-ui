import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
const ChapterItem = ({ chapter, isOpen, onToggle }) => {
  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        {isOpen ? <ChevronDown /> : <ChevronRight />}
        <Badge variant="outline" className="bg-blue-500 text-white">
          Chapter {chapter.chapterNumber}
        </Badge>
        <h2 className="font-semibold">{chapter.chapterTitle}</h2>
      </div>
    </div>
  );


}

export default ChapterItem;