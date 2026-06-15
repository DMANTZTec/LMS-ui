import React from 'react';
import TestimonialCard from './TestimonialCard';

const testimonials = [
    {
        initial: 'P',
        name: 'Priya Sharma',
        role: 'Software Engineer at TCS',
        quote: "The training here completely transformed my career. I came in as a complete beginner and now I'm working as a full-stack developer at TCS. The hands-on approach and supportive mentors made all the difference.",
    },
    {
        initial: 'R',
        name: 'Rajesh Kumar',
        role: 'Backend Developer at Infosys',
        quote: 'The advanced Java and Spring Boot course helped me land my dream job at Infosys. The real-world projects and interview preparation were invaluable. Highly recommend for anyone serious about their tech career.',
    },
    {
        initial: 'A',
        name: 'Anjali Patel',
        role: 'React Developer at Wipro',
        quote: 'After completing the React JS course, I got placed at Wipro within 2 months. The instructors are industry experts who teach practical skills that employers actually look for. Best investment in my career!',
    },
];

const TestimonialsSection = () => {
    return (
        <section className="px-4 py-8 md:py-12 bg-white">
            <div className="max-w-[1280px] mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-[#101828] text-center">
                    Success Stories
                </h2>
                <p className="text-[#4A5565] text-base text-center mt-3 max-w-2xl mx-auto">
                    Hear from our students who got trained and landed their dream jobs
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.name} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
