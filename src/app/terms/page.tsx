"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { theme } from "../../app/theme";
import { COMPANY_NAME } from "../../app/data/config";

export default function TermsPage() {
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

            {/* Terms Content */}
            <section className="py-12 md:py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${theme.typography.heading}`}>
                        Terms & <span className={theme.colors.primary}>Privacy</span>
                    </h1>
                    
                    <div className={`p-6 rounded-xl ${theme.shadows.card} ${theme.colors.cardBorder} space-y-6`}>
                        <div>
                            <h2 className={`text-xl font-bold mb-3 ${theme.typography.subheading}`}>1. Terms of Service</h2>
                            <p className={`${theme.typography.body} mb-4`}>
                                By accessing our platform, you agree to be bound by these Terms of Service. Our services are provided for personal, non-commercial use to assist with interview preparation.
                            </p>
                            <p className={`${theme.typography.body}`}>
                                You may not reproduce, duplicate, copy, sell, resell or exploit any portion of our content without express written permission from {COMPANY_NAME}.
                            </p>
                        </div>
                        
                        <div>
                            <h2 className={`text-xl font-bold mb-3 ${theme.typography.subheading}`}>2. Privacy Policy</h2>
                            <p className={`${theme.typography.body} mb-4`}>
                                We collect personal information you provide when registering, including name, email address, and payment details. This information is used solely to provide and improve our services.
                            </p>
                            <p className={`${theme.typography.body}`}>
                                We implement security measures to protect your data, but no method of transmission over the Internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
                            </p>
                        </div>
                        
                        <div>
                            <h2 className={`text-xl font-bold mb-3 ${theme.typography.subheading}`}>3. Data Usage</h2>
                            <p className={`${theme.typography.body}`}>
                                We may use anonymized, aggregated data to improve our services, conduct research, or for marketing purposes. We will never sell your personal information to third parties.
                            </p>
                        </div>
                        
                        <div>
                            <h2 className={`text-xl font-bold mb-3 ${theme.typography.subheading}`}>4. Changes to Terms</h2>
                            <p className={`${theme.typography.body}`}>
                                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
                            </p>
                        </div>
                        
                        <div className={`mt-8 ${theme.typography.caption}`}>
                            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}