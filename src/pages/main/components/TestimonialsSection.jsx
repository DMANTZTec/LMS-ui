import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import { SuccessApi } from '@/api/success-story-controller';

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await SuccessApi.getAllStories();
                const data = response.data || [];
                const formattedData = data.map((item) => ({
                    id: item.id,
                    profileImg: item.profileImg,
                    name: item.studentName,
                    role: `${item.placedDesignation} at ${item.placedCompany?.trim() || ''}`,
                    quote: item.reviewMsg,
                }));
                setTestimonials(formattedData);
            } catch (error) {
                console.error("Failed to load success stories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (loading || !testimonials.length) {
        return null;
    }

    return (
        <section className="px-4 py-8 md:py-12 bg-white overflow-hidden">
            {/* Scoped CSS animation for self-contained continuous Marquee */}
            <style>{`
                @keyframes marquee-ltr {
                    100% {
                        transform: translateX(-50%);
                    }
                    0% {
                        transform: translateX(0%);
                    }
                }
                .animate-marquee-ltr {
                    display: flex;
                    width: max-content;
                    animation: marquee-ltr 35s linear infinite;
                }
                .animate-marquee-ltr:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-[1280px] mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-[#101828] text-center">
                    Success Stories
                </h2>
                <p className="text-[#4A5565] text-base text-center mt-3 max-w-2xl mx-auto">
                    Hear from our students who got trained and landed their dream jobs
                </p>

                {/* Marquee Wrapper */}
                <div className="mt-8 pb-8 relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <div className="animate-marquee-ltr gap-6">
                        {/* Render original list */}
                        <div className="flex gap-6 shrink-0">
                            {testimonials.map((testimonial, index) => (
                                <div key={`orig-${testimonial.id || index}`} className="w-[300px] md:w-[360px] shrink-0">
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </div>

                        {/* Render duplicated list for continuous loop */}
                        <div className="flex gap-6 shrink-0" aria-hidden="true">
                            {testimonials.map((testimonial, index) => (
                                <div key={`dup-${testimonial.id || index}`} className="w-[300px] md:w-[360px] shrink-0">
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;