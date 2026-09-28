import React, { useState, useEffect } from 'react';
import ContactUsMain from '@/pages/public/contactUs/contactUsMain';
import { GraduationCap, Phone, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from "react-router-dom";
import { socialmApi } from '@/api/social-media-controller';

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



const SOCIAL_PLATFORMS = [
    { platform: 'WHATSAPP', icon: MessageCircle, bg: 'bg-[#00C950]' },
    { platform: 'FACEBOOK', icon: FacebookIcon, bg: 'bg-[#155DFC]' },
    { platform: 'YOUTUBE', icon: YoutubeIcon, bg: 'bg-[#E7000B]' },
];

const ActionSidebar = () => {
    const googleMapsUrl = import.meta.env.VITE_GOOGLE_MAPS_URL || "https://maps.app.goo.gl/Dj9hYQEXuJyGjLsp7" ;
    const navigate = useNavigate();
    const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
    const [socialLinks, setSocialLinks] = useState([]);

    // Nalgonda IT Tower Coordinates
    const nalgondaITPos = [Number(import.meta.env.VITE_NALGONDA_LAT), Number(import.meta.env.VITE_NALGONDA_LNG)] ||[17.0834404, 79.2576912];

    const getSocialUrl = (platform) => {
        const link = socialLinks.find((l) => l.platform === platform && l.url);
        return link ? link.url : (import.meta.env?.[`VITE_${platform}_URL`]);
    };

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const response = await socialmApi.getAllLinks();
                const raw = response.data;
                setSocialLinks(Array.isArray(raw) ? raw : (Array.isArray(raw?.content) ? raw.content : []));
            } catch (error) {
                console.error("Failed to load social media links:", error);
            }
        };

        fetchSocialLinks();
    }, []);

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
                        {SOCIAL_PLATFORMS.filter(({ platform }) => getSocialUrl(platform)).map(({ platform, icon: Icon, bg }) => (
                            <a
                                key={platform}
                                href={getSocialUrl(platform)}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={platform.charAt(0) + platform.slice(1).toLowerCase()}
                                className={`${bg} rounded-full p-3 flex items-center justify-center`}
                            >
                                <Icon className="size-6 text-white" />
                            </a>
                        ))}
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