import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAtom } from "jotai";
import { api } from '@/api/CourseMgtController';
import { openChaptersAtom } from "@/store/atoms/courseAtoms";
import { openTopicsAtom } from "@/store/atoms/courseAtoms";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, List, ChevronDown, ChevronRight, Clock, FileText, Link, Video, ExternalLink, ChevronLeft } from "lucide-react";
import { useParams } from "react-router-dom";

import ChapterItem from "./ChapterItem";
import TopicItem from "./TopicItem";
import Resource from "./Resources";


const CourseDetails = () => {
  const [openChapters, setOpenChapters] = useAtom(openChaptersAtom);
  const [openTopics, setOpenTopics] = useAtom(openTopicsAtom);


  const [topicResources, setTopicResources] = useState({});

  const [course, setCourse] = useState([]);
  
  const { courseId } = useParams();

const navigate = useNavigate();

  const toggleChapter = (id) => {
    if (openChapters.includes(id)) {
      setOpenChapters(openChapters.filter((c) => c !== id));
    } else {
      setOpenChapters([...openChapters, id]);
    }
  };

  const toggleTopic = (id) => {
    if (openTopics.includes(id)) {
      setOpenTopics(openTopics.filter((t) => t !== id));
    } else {
      setOpenTopics([...openTopics, id]);
    }
  };

  const openResource = (topicId, resourceType) => {
    setTopicResources((prev) => ({
      ...prev,
      [topicId]: resourceType
    }));
  };

  const fetchCourse = async () => {
    const courseRes = await api.getCourseDetails(courseId);
    setCourse(courseRes.data);
    console.log("courseId,courseRes.data,course is: ", courseId, courseRes.data, course);
  }

  useEffect(() => {
    fetchCourse();
    console.log("value of course is: ", course);

  }, [courseId]);
  const noOfChapters = course.chapters?.length;
  const noOfTopics = course.chapters?.reduce((acc, chapter) => acc + (chapter.topics.length || 0), 0);



  return (
<div className="p-6 max-w-5xl mx-auto mt-8">
  
  <span onClick={() => navigate(-1)} className="flex gap-1 items-center cursor-pointer text-blue-500 ">
    <ChevronLeft className="w-4 h-4" />back
    </span>
    
    <div className="p-6 max-w-5xl mx-auto border mt-10 rounded-xl">
      {/* Header */}
      {/* <Card className="mb-6">
        <CardContent className="p-6"> */}
        <div className="mb-6">
          <div className="flex">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center mb-3">
              <BookOpen size={20} className="text-violet-600" />
            </div>
            <div className="ml-[16px]">
              <h1 className="text-2xl font-bold">{course.courseTitle}</h1>
              <p className="text-gray-500 mt-2">{course.description}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Badge variant="secondary" className="bg-gray-50 text-gray-800 border border-gray-300 border-[0.67px] rounded-[8px] shadow-sm">
              <List className="w-4 h-4 text-gray-600"  />{noOfChapters} Chapters
              </Badge>
            <Badge variant="secondary" className="bg-gray-50 text-gray-800 border border-gray-300 border-[0.67px] rounded-[8px] shadow-sm">
              <FileText className="w-4 h-4 text-gray-600" />{noOfTopics} Topics
              </Badge>
          </div>
</div>
        {/* </CardContent>
      </Card> */}

      {/* Chapters */}

      {course.chapters?.map((chapter) => {


        const isOpen = openChapters.includes(chapter.chapterId);
        return (
          <Card key={chapter.chapterId} className="mb-4 border border-[#AD46FF] border-l-[4px]">
            <CardContent className="p-4">

              {/* Chapter Header */}

              <ChapterItem chapter={chapter}
                isOpen={isOpen}
                onToggle={() => toggleChapter(chapter.chapterId)} />

              {/* Topics */}
              {isOpen && (
                <div className="mt-4 space-y-3">
                  {chapter.topics.map((topic, index) => {
                    const isOpenTopic = openTopics.includes(topic.topicId);
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg border bg-gray-50 ml-8"
                      >

                        <TopicItem topic={topic} isOpenTopic={isOpenTopic} toggleTopic={() => toggleTopic(topic.topicId)}

                        />


                        {/* Resources */}


                        {
                          isOpenTopic && (topic.resources) && (

                            <>


                              <Resource topic={topic} topicResource={topicResources[topic.topicId]}
                                openResource={openResource} />





                            </>

                          )
                        }



                      </div>



                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div >




</div>
  );
}

export default CourseDetails;

