"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { theme } from "../../app/theme";
import { COMPANY_NAME } from "../../app/data/config";
import { updates } from "../data/updates";

export default function UpdatesPage() {
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

            {/* Updates Content */}
            <section className="py-12 md:py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${theme.typography.heading}`}>
                        Platform <span className={theme.colors.primary}>Updates</span>
                    </h1>
                    
                    <div className="space-y-6">
                        {updates.map((update, index) => (
                            <div key={index} className={`p-6 rounded-xl ${theme.shadows.card} ${theme.colors.cardBorder} relative transition-shadow`}>
                                {update.new && (
                                    <span className={`absolute top-4 right-4 ${theme.colors.primaryBg} text-white text-xs px-2 py-1 rounded-full`}>
                                        NEW
                                    </span>
                                )}
                                <div className={`text-sm font-medium ${theme.colors.primary} mb-1`}>
                                    {update.date}
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${theme.typography.subheading}`}>
                                    {update.title}
                                </h3>
                                <p className={`${theme.typography.body}`}>
                                    {update.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-12 text-center ${theme.typography.body}`}>
                        <p>Want to suggest a feature? <Link href="/contact" className={`${theme.colors.primary} hover:underline`}>Contact our product team</Link></p>
                    </div>
                </div>
            </section>
        </main>
    );
}