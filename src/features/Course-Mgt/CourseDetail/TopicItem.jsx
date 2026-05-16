import React from "react";
import { ChevronDown, ChevronRight, Clock, FileText } from "lucide-react";

const TopicItem = ({ topic, isOpenTopic, toggleTopic }) => {
  return (
    <div className="flex items-center gap-2 justify-between" onClick={toggleTopic}>
      <div className="flex gap-2">
        <div>
          {isOpenTopic ? <ChevronDown /> : <ChevronRight />}
        </div>
        <div>
          <h3 className="font-medium flex items-center gap-1 text-[#1d4ed8]">
            <FileText size={16} />
            {topic.topicTitle}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {topic.Description}
          </p>
        </div>
      </div>

      <span className="text-sm flex gap-1 text-gray-500">
        <Clock size={14} />
        {topic.duration}
      </span>
    </div>

    // resources


  );
}

export default TopicItem;