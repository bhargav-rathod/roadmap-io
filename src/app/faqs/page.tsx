"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { COMPANY_NAME } from "@/app/data/config";
import { theme } from "@/app/theme";
import { faqs } from "../data/faqs";

export default function FAQsPage() {

    return (
        <main className="bg-white min-h-screen">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className={`text-xl font-bold ${theme.colors.primary}`}>
                        {COMPANY_NAME}
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className={`${theme.colors.primaryBorder} ${theme.colors.primaryHoverBg}`}>
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* FAQ Content */}
            <section className="py-12 md:py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${theme.typography.heading}`}>
                        Frequently Asked <span className={theme.colors.primary}>Questions</span>
                    </h1>
                    
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`p-6 rounded-xl ${theme.shadows.card} ${theme.colors.cardBorder} transition-shadow`}>
                                <h3 className={`text-lg md:text-xl font-bold mb-2 ${theme.colors.primary}`}>
                                    {faq.question}
                                </h3>
                                <p className={`${theme.typography.body}`}>
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-12 text-center ${theme.typography.body}`}>
                        <p>Still have questions? <Link href="/contact" className={`${theme.colors.primary} hover:underline`}>Contact our support team</Link></p>
                    </div>
                </div>
            </section>
        </main>
    );
}