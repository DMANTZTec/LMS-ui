import React, { useState }from 'react';
import ContactUsMain from '@/pages/public/contactUs/contactUsMain';
import { GraduationCap, Phone, MessageCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from "react-router-dom";

import { FacebookIcon, YoutubeIcon } from './SocialIcons';
import instituteVideo from "@/assets/videos/institute-intro.mp4";



const ActionSidebar = () => {
      const navigate = useNavigate();
    
    const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
    

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
                <Button onClick={() => navigate("/view-courses")} className="w-full h-12 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white text-base font-semibold rounded-lg gap-2">
                    <GraduationCap className="size-5" />
                    View Courses
                </Button>
                <Button className="w-full h-12 bg-[#445AC8] hover:bg-[#445AC8]/90 text-white text-base font-semibold rounded-lg gap-2" 
                onClick={() => setIsContactUsModalOpen(true)}>
                    <Phone className="size-5" />
                    Contact Us
                </Button>

                <div className="border-t border-gray-200 pt-4 flex flex-col items-center gap-3">
                    <p className="text-[#4A5565] text-sm font-semibold">Connect with Us</p>
                    <div className="flex items-center justify-center gap-4">
                        <a  href="https://wa.me/919550107676?text=Hello%20I%20would%20like%20to%20know%20about%20your%20courses."  target="_blank"  rel="noopener noreferrer" aria-label="WhatsApp" className="bg-[#00C950] rounded-full p-3 flex items-center justify-center">
                            <MessageCircle className="size-6 text-white" />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook"  className="bg-[#155DFC] rounded-full p-3 flex items-center justify-center">
                            <FacebookIcon className="size-6 text-white" />
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" aria-label="YouTube" className="bg-[#E7000B] rounded-full p-3 flex items-center justify-center">
                            <YoutubeIcon className="size-6 text-white" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center gap-2">
                <h3 className="text-lg font-bold text-[#101828]">About Our Institute</h3>
                <p className="text-sm text-[#4A5565]">Watch our introduction video</p>
               <div className="w-full aspect-video rounded-lg mt-2 overflow-hidden">
                <video
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                muted
                loop
                playsInline
                controls>
                <source src={instituteVideo} type="video/mp4" />
                </video>
            </div>
            </div>

            <ContactUsMain
         open={isContactUsModalOpen}
         onOpenChange={setIsContactUsModalOpen} />

        </div>
    );
};

export default ActionSidebar;
