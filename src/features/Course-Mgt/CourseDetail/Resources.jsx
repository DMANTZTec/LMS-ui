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
            <div className="mt-3 flex gap-3 justify-evenly bg-slate-200 rounded-xl  overflow-x-auto no-scrollbar whitespace-nowrap">
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
                      <div className="w-full flex gap-3 items-center justify-center">
                        <div className="bg-white rounded shrink-0">
                            <FileText className="text-green-600 w-5 h-5" />
                        </div>
                        <div className='bg-white rounded flex-1 min-w-0 overflow-x-auto no-scrollbar'>
                            <h4 className="font-medium text-gray-900 whitespace-nowrap">{document.refValue.fileUrl}</h4>

                        </div>
                    
                    {/* OpenCode generated code */}
                    <div className="bg-white rounded shrink-0 cursor-pointer" onClick={() => window.open(document.refValue.fileUrl, '_blank', 'noopener,noreferrer')}><ExternalLink className="text-gray-400 w-5 h-5" /></div>
                
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
                      <div className="w-full flex gap-3 items-center justify-center">
                        <div className='bg-white rounded shrink-0'>
                            <Video className="text-green-600 w-5 h-5" />
                        </div>
                        <div className='bg-white rounded flex-1 min-w-0 overflow-x-auto no-scrollbar'>
                            <h4 className="font-medium text-gray-900 whitespace-nowrap">{video.refValue.fileUrl}</h4>

                        </div>
                    
                    {/* OpenCode generated code */}
                    <div className="bg-white rounded shrink-0 cursor-pointer" onClick={() => window.open(video.refValue.fileUrl, '_blank', 'noopener,noreferrer')}><ExternalLink className="text-gray-400 w-5 h-5" /></div>
            
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
                      <div className="w-full flex gap-3 items-center justify-center">
                        <div className="bg-white rounded shrink-0">
                            <Link className="text-green-600 w-5 h-5" />
                        </div>
                        <div className='bg-white rounded flex-1 min-w-0 overflow-x-auto no-scrollbar'>
                            <h4 className="font-medium text-gray-900 whitespace-nowrap">{url.refValue.url}</h4>

                        </div>
                    
                    {/* OpenCode generated code */}
                    <div className="bg-white rounded shrink-0 cursor-pointer" onClick={() => window.open(url.refValue.url, '_blank', 'noopener,noreferrer')}><ExternalLink className="text-gray-400 w-5 h-5" /></div>
                
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