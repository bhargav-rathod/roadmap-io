"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { theme } from "../../app/theme";
import { COMPANY_NAME, COMPANY_SUPPORT_EMAIL } from "../../app/data/config";

export default function ContactPage() {
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

            {/* Contact Content */}
            <section className="py-12 md:py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${theme.typography.heading}`}>
                        Contact <span className={theme.colors.primary}>Us</span>
                    </h1>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className={`p-6 rounded-xl ${theme.shadows.card} ${theme.colors.cardBorder}`}>
                            <h3 className={`text-xl font-bold mb-4 ${theme.typography.subheading}`}>Get in Touch</h3>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className={`block mb-1 ${theme.typography.body}`}>For any queries, concerns, suggestions, please drop an email to <b>{COMPANY_SUPPORT_EMAIL}</b> and we will revert you as quickly as possible.</label>
                                </div>
                                {/* <div>
                                    <label htmlFor="name" className={`block mb-1 ${theme.typography.body}`}>Name</label>
                                    <input type="text" id="name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className={`block mb-1 ${theme.typography.body}`}>Email</label>
                                    <input type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className={`block mb-1 ${theme.typography.body}`}>Message</label>
                                    <textarea id="message" rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>
                                <Button type="submit" className={`w-full ${theme.buttons.primary}`}>
                                    Send Message
                                </Button> */}
                            </form>
                        </div>
                        
                        <div className={`p-6 rounded-xl ${theme.shadows.card} ${theme.colors.cardBorder}`}>
                            <h3 className={`text-xl font-bold mb-4 ${theme.typography.subheading}`}>Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className={`font-semibold ${theme.typography.subheading}`}>Email</h4>
                                    <p className={`${theme.typography.body}`}>{COMPANY_SUPPORT_EMAIL}</p>
                                </div>
                                {/* <div>
                                    <h4 className={`font-semibold ${theme.typography.subheading}`}>Phone</h4>
                                    <p className={`${theme.typography.body}`}>+1 (555) 123-4567</p>
                                </div> */}
                                <div>
                                    <h4 className={`font-semibold ${theme.typography.subheading}`}>Office Hours</h4>
                                    <p className={`${theme.typography.body}`}>24 x 7 Email Support</p>
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${theme.typography.subheading}`}>Address</h4>
                                    <p className={`${theme.typography.body}`}>123 Interview Lane, Suite 456<br />Tech City, TC 10001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}