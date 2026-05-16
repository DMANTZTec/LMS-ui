import React, { useState } from 'react';
import { FileText, Video, Link, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Resources = ({ topic, topicResource, openResource }) => {

    const openRes = (topicId, resource) => {
        openResource(topicId, resource);
    };

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



                <div className="bg-white mt-4 p-4 rounded flex justify-between">

                    <div className="flex gap-3">
                        <div>
                            <FileText className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{topic.resources.documents[0]?.refValue.url}</h4>

                        </div>
                    </div>
                    <div><ExternalLink className="text-gray-400 w-5 h-5" /></div>
                </div>
            </>
            }
            {topicResource === "videos" && <div className="bg-white mt-4 p-4 rounded flex justify-between">

                <div className="flex gap-3">
                    <div>
                        <Video className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">{topic.resources.videos[0]?.refValue.url}</h4>

                    </div>
                </div>
                <div><ExternalLink className="text-gray-400 w-5 h-5" /></div>
            </div>}
            {topicResource === "urls" && <div className="bg-white mt-4 p-4 rounded flex justify-between">

                <div className="flex gap-3">
                    <div>
                        <Link className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">{topic.resources.urls[0]?.refValue.url}</h4>

                    </div>
                </div>
                <div><ExternalLink className="text-gray-400 w-5 h-5" /></div>
            </div>}
        </>
    );
}

export default Resources;