import React, { useState } from 'react';
import ContactUsMain from '@/pages/public/contactUs/contactUsMain';
import { GraduationCap, Phone, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from "react-router-dom";

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon missing issue in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

import { FacebookIcon, YoutubeIcon } from './SocialIcons';
import instituteVideo from "@/assets/videos/institute-intro.mp4";

const ActionSidebar = () => {
    const googleMapsUrl = "https://maps.app.goo.gl/Dj9hYQEXuJyGjLsp7";
    const navigate = useNavigate();
    const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);

    // Nalgonda IT Tower Coordinates
    const nalgondaITPos = [17.0834404, 79.2576912];

    return (
        <div className="flex flex-col gap-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
                <Button 
                    onClick={() => navigate("/view-courses")} 
                    className="w-full h-12 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white text-base font-semibold rounded-lg gap-2"
                >
                    <GraduationCap className="size-5" />
                    View Courses
                </Button>
                
                <Button 
                    className="w-full h-12 bg-[#445AC8] hover:bg-[#445AC8]/90 text-white text-base font-semibold rounded-lg gap-2" 
                    onClick={() => setIsContactUsModalOpen(true)}
                >
                    <Phone className="size-5" />
                    Contact Us
                </Button>

                <div className="border-t border-gray-200 pt-4 flex flex-col items-center gap-3">
                    <p className="text-[#4A5565] text-sm font-semibold">Connect with Us</p>
                    <div className="flex items-center justify-center gap-4">
                        <a 
                            href="https://wa.me/919550107676?text=Hello%20I%20would%20like%20to%20know%20about%20your%20courses." 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="WhatsApp" 
                            className="bg-[#00C950] rounded-full p-3 flex items-center justify-center"
                        >
                            <MessageCircle className="size-6 text-white" />
                        </a>
                        <a 
                            href="https://www.facebook.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Facebook" 
                            className="bg-[#155DFC] rounded-full p-3 flex items-center justify-center"
                        >
                            <FacebookIcon className="size-6 text-white" />
                        </a>
                        <a 
                            href="https://www.youtube.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="YouTube" 
                            className="bg-[#E7000B] rounded-full p-3 flex items-center justify-center"
                        >
                            <YoutubeIcon className="size-6 text-white" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Video Section */}
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
                        controls
                    >
                        <source src={instituteVideo} type="video/mp4" />
                    </video>
                </div>
            </div>

            {/* NEW: Map Section */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center gap-2">
  <h3 className="text-lg font-bold text-[#101828]">Our Location</h3>
  <p className="text-sm text-[#4A5565]">Visit us at Nalgonda IT Tower</p>

  <div className="w-full h-56 rounded-lg mt-2 overflow-hidden border border-gray-100">
   <MapContainer
  center={nalgondaITPos}
  zoom={14}
  scrollWheelZoom={false}
  attributionControl={false}
  className="w-full h-full"
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <Marker position={nalgondaITPos}>
    <Popup>
      <strong>DMANTZ Technologies Pvt Ltd</strong>
      <br />
      Nalgonda IT Tower
    </Popup>
  </Marker>
</MapContainer>
  </div>

  <a
    href={googleMapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-3 w-full"
  >
    <Button className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90">
      Open in Google Maps
    </Button>
  </a>
</div>

            <ContactUsMain
                open={isContactUsModalOpen}
                onOpenChange={setIsContactUsModalOpen} 
            />
        </div>
    );
};

export default ActionSidebar;