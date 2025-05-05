"use client";

import Link from "next/link";
import { useRef, useState, useEffect, RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { testimonials } from "../../app/data/testemonials";
import { roadMapLabel, roadmaps, roadmapSampleStructureQuestionsText } from "../../app/data/roadmaps";
import { pricingDescription, pricingPlans, pricingTitlePrefix, pricingTitleSuffix } from "../../app/data/pricingPlans";
import { features } from "../../app/data/features";
import { theme } from "../../app/theme";
import { bannerConfig } from "../../app/data/banner";
import { COMPANY_NAME, COMPANY_SLOGAN, GET_STARTED_BUTTON_TEXT, PAGE_HEADER_PREFIX } from "../../app/data/config";
import { DemoModal } from "./DemoModel";
import { DemoModal_Lazy } from "./DemoModel_Lazy";

export default function PublicHomePage() {
    const testimonialRef = useRef<HTMLDivElement>(null);
    const roadmapRef = useRef<HTMLDivElement>(null);
    const [testimonialScroll, setTestimonialScroll] = useState({ isStart: true, isEnd: false });
    const [roadmapScroll, setRoadmapScroll] = useState({ isStart: true, isEnd: false });

    type ScrollableRef = React.RefObject<HTMLDivElement>;

    const checkScrollPosition = (ref: React.RefObject<HTMLDivElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
        if (ref.current) {
            const { scrollLeft, scrollWidth, clientWidth } = ref.current;
            const isStart = scrollLeft === 0;
            const isEnd = scrollLeft + clientWidth >= scrollWidth - 1;
            setState({ isStart, isEnd });
        }
    };

    const scroll = (ref: ScrollableRef, direction: "left" | "right") => {
        if (ref.current) {
            const scrollAmount = ref.current.clientWidth * 0.8;
            ref.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });

            setTimeout(() => {
                if (ref === testimonialRef) {
                    checkScrollPosition(ref, setTestimonialScroll);
                } else {
                    checkScrollPosition(ref, setRoadmapScroll);
                }
            }, 300);
        }
    };

    useEffect(() => {
        checkScrollPosition(testimonialRef as RefObject<HTMLDivElement>, setTestimonialScroll);
        checkScrollPosition(roadmapRef as RefObject<HTMLDivElement>, setRoadmapScroll);

        const testimonialCurrent = testimonialRef.current;
        const roadmapCurrent = roadmapRef.current;

        const handleTestimonialScroll = () => checkScrollPosition(testimonialRef as RefObject<HTMLDivElement>, setTestimonialScroll);
        const handleRoadmapScroll = () => checkScrollPosition(roadmapRef as RefObject<HTMLDivElement>, setRoadmapScroll);

        testimonialCurrent?.addEventListener('scroll', handleTestimonialScroll);
        roadmapCurrent?.addEventListener('scroll', handleRoadmapScroll);

        return () => {
            testimonialCurrent?.removeEventListener('scroll', handleTestimonialScroll);
            roadmapCurrent?.removeEventListener('scroll', handleRoadmapScroll);
        };
    }, []);

    return (
        <main className="bg-white min-h-screen">

            {/* Header with Signup/Login buttons */}
            <header className="absolute top-0 right-0 p-4 md:p-6 z-10">
                <div className="flex gap-2 md:gap-4">
                    <Link href="/login">
                        <Button variant="outline" className="px-4 md:px-6 text-sm md:text-base">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className={`px-4 md:px-6 text-sm md:text-base ${theme.colors.primaryBg} ${theme.colors.primaryHoverBg}`}>
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="text-center pt-16 pb-12 md:pt-24 md:pb-16 px-4 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl ${theme.typography.heading} leading-tight`}>
                        {PAGE_HEADER_PREFIX} <span className={`${theme.colors.primary}`}>{COMPANY_NAME}</span>
                    </h1>
                    <p className="text-lg md:text-xl font-bold italic text-gray-600 mb-4 md:mb-6 px-2 mt-4">
                        {COMPANY_SLOGAN}
                    </p>
                    <Link href="/signup">
                        <Button className={`px-6 py-3 text-sm md:text-base ${theme.colors.primaryBg} ${theme.colors.primaryHoverBg}`}>
                            {GET_STARTED_BUTTON_TEXT}
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Banner Section */}
            {bannerConfig.isEnabled && (
                <div className={`${bannerConfig.content.bgColor} ${bannerConfig.content.textColor} ${bannerConfig.content.animation} py-2 px-4 text-center font-medium`}>
                    {bannerConfig.content.text}
                </div>
            )}

            {/* Features Section */}
            <section id="features" className="py-8 md:py-12 bg-white px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${theme.typography.heading}`}>
                        Platform <span className={theme.colors.primary}>Features</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className={`p-5 md:p-6 rounded-xl bg-white ${theme.shadows.card} ${theme.colors.cardBorder} transition-shadow`}>                                {feature.icon && (
                                <div className={`${theme.colors.primary} mb-3 text-2xl`}>
                                    {feature.icon}
                                </div>
                            )}
                                <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${theme.typography.subheading}`}>{feature.title}</h3>
                                <p className={`${theme.typography.body} text-sm md:text-base`}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roadmaps Section */}
            <section id="roadmaps" className="py-12 md:py-16 bg-gray-50 relative px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-6 ${theme.typography.heading}`}>
                        Sample <span className={theme.colors.primary}>Roadmaps</span>
                    </h2>

                    {/* Informational paragraph */}
                    <div className="mt-2 mb-8 text-center px-4 sm:px-0">
                        <p className={`${theme.typography.body} text-base md:text-lg max-w-5xl mx-auto leading-relaxed`}>
                            {roadMapLabel}
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => scroll(roadmapRef as ScrollableRef, "left")}
                            disabled={roadmapScroll.isStart}
                            className={`hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white p-2 md:p-3 rounded-full ${theme.shadows.card} transition-all ${roadmapScroll.isStart ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                        </button>

                        <div
                            ref={roadmapRef}
                            className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 pb-6 md:pb-8 scroll-smooth px-2"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {roadmaps.map((roadmap: any, idx: any) => (
                                <div key={idx} className={`flex-shrink-0 w-80 sm:w-96 bg-white p-6 md:p-8 rounded-2xl ${theme.shadows.card} ${theme.colors.cardBorder} transition-all`}>                                    <div className="flex flex-col items-center mb-4">
                                    <img
                                        src={roadmap.company}
                                        alt={roadmap.company.alt}
                                        className="object-contain mb-3"
                                        style={{ width: theme.sizes.companyLogo.width, height: theme.sizes.companyLogo.height }}
                                    />
                                    <h4 className={`font-bold text-lg md:text-xl text-center ${theme.typography.subheading}`}>{roadmap.title}</h4>
                                </div>
                                    <p className={`${theme.typography.caption} text-center mb-4`}>{roadmap.pattern}</p>

                                    <div className="mb-4">
                                        <h5 className={`mb-2 text-sm md:text-base ${theme.typography.subheading}`}>{roadmapSampleStructureQuestionsText}:</h5>
                                        <ul className={`list-disc list-inside text-xs md:text-sm ${theme.typography.body} space-y-1`}>
                                            {roadmap.questions.map((q: string, i: number) => (
                                                <li key={i}>{q}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className={`mb-2 text-sm md:text-base ${theme.typography.subheading}`}>Similar Interviews:</h5>
                                        <ul className={`text-xs md:text-sm ${theme.typography.body} space-y-1`}>
                                            {roadmap.similar.map((s: string, i: number) => (
                                                <li key={i}>• {s}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4">
                                        <h5 className={`mb-2 text-sm md:text-base ${theme.typography.subheading}`}>Interview Experience:</h5>
                                        <p className={`text-xs md:text-sm ${theme.typography.body}`}>{roadmap.experience}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scroll(roadmapRef as ScrollableRef, "right")}
                            disabled={roadmapScroll.isEnd}
                            className={`hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white p-2 md:p-3 rounded-full ${theme.shadows.card} transition-all ${roadmapScroll.isEnd ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-12 md:py-16 bg-white relative px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 ${theme.typography.heading}`}>
                        What Our <span className={theme.colors.primary}>Users Say</span>
                    </h2>

                    <div className="relative">
                        <button
                            onClick={() => scroll(testimonialRef as ScrollableRef, "left")}
                            disabled={testimonialScroll.isStart}
                            className={`hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white p-2 md:p-3 rounded-full ${theme.shadows.card} transition-all ${testimonialScroll.isStart ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                        </button>

                        <div
                            ref={testimonialRef}
                            className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 pb-6 md:pb-8 scroll-smooth px-2"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {testimonials.map((t, i) => (
                                <div key={i} className={`flex-shrink-0 w-72 sm:w-80 bg-white p-6 md:p-8 rounded-2xl ${theme.shadows.card} ${theme.colors.cardBorder} transition-all flex flex-col items-center text-center`}>
                                    <img
                                        src={t.company}
                                        alt={t.company}
                                        className="object-contain mb-3 md:mb-4"
                                        style={{ width: theme.sizes.companyLogo.width, height: theme.sizes.companyLogo.height }}
                                    />
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-12 h-12 md:w-16 md:h-16 rounded-full mb-3 md:mb-4 object-cover border-2 border-blue-100"
                                    />
                                    <p className={`italic mb-3 md:mb-4 ${theme.typography.body} text-sm md:text-base`}>"{t.message}"</p>
                                    <p className={`font-semibold ${theme.typography.subheading} text-sm md:text-base`}>{t.name}</p>
                                    <p className={`${theme.typography.caption}`}>{t.role}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scroll(testimonialRef as ScrollableRef, "right")}
                            disabled={testimonialScroll.isEnd}
                            className={`hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white p-2 md:p-3 rounded-full ${theme.shadows.card} transition-all ${testimonialScroll.isEnd ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-12 md:py-20 bg-gray-50 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${theme.typography.heading}`}>
                        {pricingTitlePrefix} <span className={theme.colors.primary}>{pricingTitleSuffix}</span>
                    </h2>
                    <p className={`text-lg md:text-xl text-center text-gray-600 mb-8 md:mb-16 max-w-3xl mx-auto`}>
                        {pricingDescription}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-col p-6 md:p-8 rounded-2xl bg-white ${theme.shadows.card} ${theme.colors.cardBorder} transition-all ${plan.popular ? `border-2 ${theme.colors.popularBorder}` : ""
                                    }`}
                            >
                                {plan.popular && (
                                    <div className={`absolute top-0 right-0 ${theme.colors.popularBadge} px-3 py-1 md:px-4 md:py-1 rounded-bl-lg rounded-tr-lg text-xs md:text-sm font-medium`}>
                                        Most Popular
                                    </div>
                                )}
                                <h3 className={`text-xl md:text-2xl font-bold mb-2 ${theme.typography.subheading}`}>{plan.name}</h3>
                                <p className={`text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 ${theme.typography.heading}`}>{plan.price}</p>
                                <p className={`${theme.typography.body} mb-4 md:mb-6 text-sm md:text-base`}>{plan.description}</p>
                                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className={`flex items-start text-sm md:text-base ${theme.typography.body}`}>
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {/* Button at bottom of card */}
                                <div className="mt-auto pt-4">
                                    <Button
                                        className={`w-full py-3 md:py-4 text-sm md:text-lg ${plan.popular
                                            ? `${theme.buttons.primary}`
                                            : "bg-gray-800 hover:bg-gray-900"
                                            }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-8 md:mt-12 text-center ${theme.typography.caption}`}>
                        <p>Need help choosing? <a href="#" className={`${theme.colors.primary} hover:underline`}>Contact our team</a></p>
                        <p className="mt-1 md:mt-2">All plans come with a 7-day money-back guarantee</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6`}>Ready to Ace Your Next Interview?</h2>
                    <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
                        Join thousands of candidates who've landed their dream jobs with our roadmaps.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                        <Link href="/signup">
                            <Button className={`px-6 py-4 md:px-8 md:py-6 text-sm md:text-lg rounded-full ${theme.buttons.secondary} ${theme.shadows.card}`}>
                                Get Started Free
                            </Button>
                        </Link>
                        <DemoModal_Lazy
                            buttonClassName="px-6 py-4 md:px-8 md:py-6 text-sm md:text-lg bg-transparent border-2 border-white hover:bg-blue-700 rounded-full"
                            buttonText="See Demo"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 md:py-16 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    <div>
                        <h4 className={`font-bold text-lg mb-3 md:mb-4 ${theme.colors.primary}`}>{COMPANY_NAME}</h4>
                        <p className={`${theme.typography.caption}`}>
                            {COMPANY_SLOGAN}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-3 md:mb-4 text-white">Product</h4>
                        <ul className={`${theme.typography.caption} space-y-1 md:space-y-2`}>
                            <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#roadmaps" className="hover:text-white transition-colors">Roadmaps</Link></li>
                            <li><Link href="#testimonials" className="hover:text-white transition-colors">Updates</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-3 md:mb-4 text-white">Support</h4>
                        <ul className={`${theme.typography.caption} space-y-1 md:space-y-2`}>
                            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms & Privacy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-3 md:mb-4 text-white">Connect</h4>
                        <div className="flex gap-3 md:gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                                <FaLinkedin className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                                <FaTwitter className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                                <FaInstagram className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                                <FaGithub className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`max-w-7xl mx-auto mt-8 md:mt-12 pt-6 border-t border-gray-800 text-center ${theme.typography.caption}`}>
                    © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
                </div>
            </footer>
        </main>
    );
}