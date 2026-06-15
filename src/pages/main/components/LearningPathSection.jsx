import React from 'react';
import { GraduationCap, Rocket, Code2, TrendingUp } from 'lucide-react';
import StudentCategoryCard from './StudentCategoryCard';
import ActionSidebar from './ActionSidebar';

const categories = [
    {
        Icon: GraduationCap,
        title: 'I am a Beginner',
        description: "Starting your journey in tech? We'll guide you from zero to confident coder.",
        items: [
            'Foundation-first approach with computer fundamentals and programming basics',
            'Hands-on learning with real examples and projects from day one',
            'Dedicated mentors who understand the challenges beginners face',
            'Flexible pace learning - take the time you need to master each concept',
            'Career guidance and roadmap planning tailored to your interests',
        ],
    },
    {
        Icon: Rocket,
        title: 'Advanced Learner',
        description: 'Already know the basics? Take your skills to the next level with advanced concepts.',
        items: [
            'Deep-dive into advanced frameworks and design patterns',
            'Performance optimization and best practices',
            'Industry-standard tools and workflows',
            'Code review sessions with experienced developers',
            'Preparation for technical interviews',
        ],
    },
    {
        Icon: Code2,
        title: 'Ready to do Projects',
        description: 'Put theory into practice with real-world projects that build your portfolio.',
        items: [
            'Build complete full-stack applications',
            'Work on industry-relevant projects',
            'Agile methodology and Git/GitHub workflows',
            'Deployment and DevOps (AWS, Docker)',
            'Team collaboration experience',
        ],
    },
    {
        Icon: TrendingUp,
        title: 'I want to Upskill',
        description: 'Stay ahead in your career with the latest tools, technologies and certifications.',
        items: [
            'Latest tech stacks and frameworks',
            'Cloud computing and microservices',
            'Professional certifications',
            'Weekend/evening batches',
            'Industry connections and job placement support',
        ],
    },
];

const LearningPathSection = () => {
    return (
        <section className="px-4 py-8 md:py-12">
            <div className="max-w-[1280px] mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-[#101828] text-center">
                    Find Your Perfect Learning Path
                </h2>
                <p className="text-[#4A5565] text-base text-center mt-3 max-w-2xl mx-auto">
                    We understand that every student has unique needs. Choose the category that best describes you.
                </p>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
                        {categories.map((category) => (
                            <StudentCategoryCard key={category.title} {...category} />
                        ))}
                    </div>
                    <ActionSidebar />
                </div>
            </div>
        </section>
    );
};

export default LearningPathSection;
