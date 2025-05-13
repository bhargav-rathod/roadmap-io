// dashboard/components/Layout/AboutModal.tsx
'use client'

import { COMPANY_NAME } from '@/app/data/config'
import { FiX, FiGithub, FiGlobe } from 'react-icons/fi'

interface AboutModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col shadow-xl overflow-hidden">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">About {COMPANY_NAME}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-6">
                        {/* Version Information */}
                        <div>
                            <h3 className="text-lg font-medium mb-2">Version Information</h3>
                            <div className="space-y-1 text-gray-700 text-[12px]">
                                <p><span className="font-medium">Version:</span> 1.0.0 (Stable)</p>
                                <p><span className="font-medium">Release Date:</span> January 2025</p>
                                <p><span className="font-medium">API Version:</span> v1.7.0</p>
                                <p><span className='font-medium'>AI Models integrated:</span> <b>llama-3.3-70b-versatile</b> | qwen-qwq-32b | whisper-large-v3-turbo</p>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-[12px]">
                            <h3 className="text-lg font-medium mb-2">Copyright</h3>
                            <p className="text-gray-700">
                                © 2025 {COMPANY_NAME} | All rights reserved.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div>
                            <h3 className="text-lg font-medium mb-2">Disclaimer</h3>
                            <p className="text-gray-700 mb-2 text-[12px]">
                                The information provided by Roadmap ("we," "us," or "our") is intended for general informational purposes only.
                                The roadmaps are generated based on user-provided inputs and insights derived from leading AI models available in the market.
                                While we strive to ensure accuracy, relevance, and usefulness, we make no guarantees or warranties, express or implied, regarding the completeness, reliability, or suitability of any roadmap for specific goals or outcomes.
                                Users are solely responsible for how they use or interpret the generated content, and we shall not be held liable for any direct, indirect, or consequential loss or damage arising from its use.
                                <br /><br />
                                All content, including roadmaps and related materials, is the intellectual property of Roadmap and is protected by applicable copyright laws.
                                Unauthorized reproduction, distribution, or commercial use of any content without prior written permission is strictly prohibited.
                            </p>
                        </div>

                        {/* Terms and Conditions */}
                        <div>
                            <h3 className="text-lg font-medium mb-2">Terms and Conditions</h3>
                            <div className="text-gray-700 space-y-2 text-[12px]">
                                <p>
                                    By accessing or using Roadmap ("the Service"), you agree to be bound by these Terms and Conditions.
                                    If you do not agree with any part of these terms, you must not use the Service. Please read them carefully.
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                                    <li>You agree not to use the Service for any unlawful or unauthorized purposes.</li>
                                    <li>We reserve the right to modify, suspend, or terminate the Service or any part of it at any time without prior notice.</li>
                                    <li>All roadmap content is provided "as is" without warranties of any kind, either express or implied.</li>
                                    <li>We do not guarantee that the generated roadmaps will result in success in interviews or job placements.</li>
                                    <li>All content generated or displayed is the intellectual property of Roadmap and may not be copied, distributed, or used commercially without permission.</li>
                                    <li>Your use of the Service is also subject to our Privacy Policy and Disclaimer.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="pt-4 flex space-x-4">
                            {/* <a
                                href="https://github.com/your-repo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <FiGithub className="mr-2" /> GitHub
                            </a>
                            <a
                                href="https://your-website.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <FiGlobe className="mr-2" /> Website
                            </a> */}
                            <a
                                href="/contact"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <FiGlobe className="mr-2" /> Contact Support
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}