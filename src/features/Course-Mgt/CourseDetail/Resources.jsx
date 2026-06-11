import React, { useState } from 'react';
import { FileText, Video, Link, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Resources = ({ topic, topicResource, openResource }) => {

    const openRes = (topicId, resource) => {
        openResource(topicId, resource);
    };
console.log("value of topic is: ", topic);

    return (
        <>
            <h3 className="uppercase text-gray-500 mt-2 font-sm">Learning Reasources</h3>
            <div className="mt-3 flex flex-wrap gap-3 justify-evenly bg-slate-200 rounded-xl">
                {Object.keys(topic.resources).map(resource => (


                    <Badge key={resource} className={`w-[200px] text-black hover:bg-white ${topicResource === resource ? "bg-white" : "bg-slate-200"}`}
                        onClick={() => openRes(topic.topicId, resource)}>
                        {resource === "documents" && <><FileText />{resource}</>}
                        {resource === "videos" && <><Video />{resource}</>}
                        {resource === "urls" && <><Link />{resource}</>}

                    </Badge>
                ))}
            </div>


            {topicResource === "documents" && <>
                <div className="bg-white mt-4 p-4 rounded">

                        {topic.resources.documents.map((document,index) => (
                    <div key={document.id} className="flex items-center justify-between mb-3">
                      <div className="flex gap-3">
                        <div>
                            <FileText className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{document.refValue.fileUrl}</h4>

                        </div>
                    <div>
                    <div><ExternalLink className="text-gray-400 w-5 h-5" /></div>
                </div>
                </div>
                </div>
                    ))}
                        
                        </div>
            </>
            }
            {topicResource === "videos" && <>
                <div className="bg-white mt-4 p-4 rounded">

                        {topic.resources.videos.map((video,index) => (
                    <div key={video.id} className="flex items-center justify-between mb-3">
                      <div className="flex gap-3">
                        <div>
                            <Video className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{video.refValue.fileUrl}</h4>

                        </div>
                    <div>
                    <div><ExternalLink className="text-gray-400 w-5 h-5" /></div>
                </div>
                </div>
                </div>
                    ))}
                        
                        </div>
            </>
            }
            {topicResource === "urls" && <>
                <div className="bg-white mt-4 p-4 rounded">

                        {topic.resources.urls.map((url,index) => (
                    <div key={url.id} className="flex items-center justify-between mb-3">
                      <div className="flex gap-3">
                        <div>
                            <Link className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{url.refValue.url}</h4>

                        </div>
                    <div>
                    <div><ExternalLink className="text-gray-400 w-5 h-5" /></div>
                </div>
                </div>
                </div>
                    ))}
                        
                        </div>
            </>
            }
        </>
    );
}

export default Resources;