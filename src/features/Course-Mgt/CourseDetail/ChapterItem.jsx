import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
const ChapterItem = ({ chapter, isOpen, onToggle }) => {

  const noOfTopics = chapter.topics.reduce((acc, topic) => acc + 1, 0);
  console.log(`number of topics in chapter${chapter.chapterNumber} is: `,noOfTopics);

  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">

        {isOpen ? <ChevronDown /> : <ChevronRight />}
        <div>
          
        <div className="flex w-full">
        <div>
        <Badge variant="outline" className="bg-blue-500 text-white">
          Chapter {chapter.chapterNumber}
        </Badge>
        </div>
        <div>
        <h2 className="font-semibold ml-2">{chapter.chapterTitle}</h2>
        </div>
        </div>         
        
       
      

      <div className="flex items-center mt-2">
<FileText className='w-3 h-4 text-[#6A7282]' /><span className="text-sm text-[#6A7282] ml-1">{noOfTopics}topics</span> 
    </div>

    </div>

    </div>
    </div>
  );


}

export default ChapterItem;