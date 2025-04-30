// Updated DemoModal.tsx with UI changes
"use client";

import { ComponentProps, ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { theme } from "@/app/theme";
import Image from "next/image";
import { COMPANY_LOGOS } from "@/app/data/companyLogos";

type ButtonProps = ComponentProps<typeof Button>;

interface DemoModalProps {
    buttonClassName?: string;
    buttonText?: ReactNode;
    buttonProps?: ButtonProps;
}

export const DemoModal = ({
    buttonClassName = "px-6 py-4 md:px-8 md:py-6 text-sm md:text-lg bg-transparent border-2 border-white hover:bg-blue-700 rounded-full",
    buttonText = "See Demo",
    buttonProps
}: DemoModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const microsoftDSAQuestions = [
        {
            question: "1. Implement a rate limiter",
            solutions: {
                python: `# Token Bucket implementation in Python
import time

class RateLimiter:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.time()

    def allow_request(self):
        now = time.time()
        time_passed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + time_passed * self.refill_rate)
        self.last_refill = now
        
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False`,
                java: `// Token Bucket implementation in Java
import java.time.Instant;

public class RateLimiter {
    private final int capacity;
    private double tokens;
    private final double refillRate;
    private Instant lastRefill;
    
    public RateLimiter(int capacity, double refillRate) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate;
        this.lastRefill = Instant.now();
    }
    
    public synchronized boolean allowRequest() {
        refillTokens();
        if (tokens >= 1) {
            tokens--;
            return true;
        }
        return false;
    }
    
    private void refillTokens() {
        Instant now = Instant.now();
        double seconds = (now.getEpochSecond() - lastRefill.getEpochSecond());
        tokens = Math.min(capacity, tokens + seconds * refillRate);
        lastRefill = now;
    }
}`
            }
        },
        {
            question: "2. Find median from data stream",
            solutions: {
                python: `# Using two heaps approach
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max heap (invert min heap)
        self.large = []  # min heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`,
                java: `// Using two priority queues
import java.util.*;

class MedianFinder {
    PriorityQueue<Integer> maxHeap;
    PriorityQueue<Integer> minHeap;

    public MedianFinder() {
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        minHeap = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        maxHeap.offer(num);
        minHeap.offer(maxHeap.poll());
        
        if (maxHeap.size() < minHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }
    
    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        }
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}`
            }
        },
        { question: "3. Design an LRU cache" },
        { question: "4. Serialize and deserialize a binary tree" },
        { question: "5. Implement Trie (Prefix Tree)" },
        { question: "6. Word search II (with Trie optimization)" },
        { question: "7. Minimum window substring" },
        { question: "8. Merge k sorted lists" },
        { question: "9. Longest increasing path in a matrix" },
        { question: "10. Alien dictionary (topological sort)" },
        { question: "11. Number of islands (DFS/BFS variations)" },
        { question: "12. Course schedule (cycle detection)" },
        { question: "13. Maximum product subarray" },
        { question: "14. Trapping rain water" },
        { question: "15. Regular expression matching" },
        { question: "16. Find all anagrams in a string" },
    ];

    const systemDesignQuestions = [
        {
            question: "1. Design Microsoft Teams (with focus on real-time features)",
            solution: `Key Components:
1. WebSocket servers for real-time communication
2. Signaling service for call setup
3. Media servers for audio/video processing
4. Horizontal scaling with load balancers
5. Redis for presence tracking
6. Database sharding for message history`
        },
        {
            question: "2. Design a distributed key-value store like Azure Cosmos DB",
            solution: `Key Considerations:
1. Partitioning strategy (consistent hashing)
2. Replication for fault tolerance
3. Consistency models (strong vs eventual)
4. Multi-region deployment
5. Conflict resolution mechanisms
6. Storage engine optimization`
        },
        { question: "3. Design a globally distributed cache system" },
        { question: "4. Design an API gateway for microservices" },
        { question: "5. Design a real-time collaborative document editor" },
        { question: "6. Design a scalable notification service" },
        { question: "7. Design a search autocomplete system" },
    ];

    const behavioralQuestions = [
        {
            question: "1. Tell me about a time you had a conflict with a team member",
            answer: `In my previous project, I disagreed with a teammate about our API design approach. I preferred a RESTful design while they advocated for GraphQL. I scheduled a 1:1 meeting where we:
- Listed pros/cons of each approach
- Evaluated our specific use cases
- Consulted with senior engineers
We ultimately chose REST for its simplicity given our requirements, but incorporated some GraphQL concepts for flexibility.`
        },
        {
            question: "2. Describe a time when you had to learn something new quickly",
            answer: `When our team adopted a new cloud technology, I took the initiative to:
- Complete official certification within 2 weeks
- Built a prototype to demonstrate key features
- Created documentation for other team members
This helped accelerate our migration timeline by 3 weeks.`
        },
        { question: "3. Tell me about a time you failed and what you learned" },
        { question: "4. Describe your most challenging project" },
        { question: "5. How do you handle competing priorities?" },
        { question: "6. Give an example of when you mentored someone" },
        { question: "7. Describe a time you improved an existing process" },
    ];

    const compensationData = {
        baseSalary: "₹35,00,000 - ₹45,00,000",
        stockOptions: "₹15,00,000 - ₹25,00,000 per year",
        bonus: "10-15% of base salary",
        benefits: [
            "Health insurance for family",
            "Annual wellness allowance",
            "Education reimbursement",
            "Relocation assistance",
            "401(k) matching"
        ]
    };

    const similarPositions = [
        {
            company: "Google",
            companyLogoName: "google",
            role: "Senior Software Engineer",
            location: "Bangalore",
            salary: "₹38,00,000 - ₹50,00,000"
        },
        {
            company: "Amazon",
            companyLogoName: "amazon",
            role: "SDE III",
            location: "Hyderabad",
            salary: "₹36,00,000 - ₹48,00,000"
        },
        {
            company: "Adobe",
            companyLogoName: "adobe",
            role: "Senior Computer Scientist",
            location: "Noida",
            salary: "₹32,00,000 - ₹42,00,000"
        },
        {
            company: "Uber",
            companyLogoName: "uber",
            role: "Senior Engineer II",
            location: "Bangalore",
            salary: "₹34,00,000 - ₹46,00,000"
        },
        {
            company: "Goldman Sachs",
            companyLogoName: "goldmansachs",
            role: "Vice President - Engineering",
            location: "Bengaluru",
            salary: "₹40,00,000 - ₹55,00,000"
        }
    ];

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className={buttonClassName}
                {...buttonProps}
            >
                {buttonText}
            </Button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="fixed top-6 right-6 p-2 rounded-full hover:bg-gray-100 bg-white shadow-md z-20"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>

                        <div className="overflow-y-auto flex-1 rounded-xl">
                            <div className="bg-yellow-400 text-gray-900 p-3 font-bold text-left mx-4 mt-4 rounded-md">
                                This is just a sample example. Actual roadmap will be customized based on your inputs with large number of real and accurate data.
                            </div>

                            <div className="p-6 md:p-8 space-y-6 text-black text-left">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <Image
                                            src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                                            alt="Microsoft Logo"
                                            width={120}
                                            height={40}
                                            className="mr-4"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-2xl font-bold">Senior Software Developer</h2>
                                        <p className="text-gray-600">Microsoft, India • 5+ years experience</p>
                                    </div>
                                </div>

                                {/* DSA Questions */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-blue-600">Recently asked DSA Questions</h3>
                                    <div className="space-y-4">
                                        {microsoftDSAQuestions.map((q, i) => (
                                            <div key={i} className="bg-gray-100 p-4 rounded-xl">
                                                <p className="font-medium text-lg">{q.question}</p>
                                                {q.solutions && (
                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-sm mb-1">Python Solution:</h4>
                                                            <pre className="bg-gray-800 text-white p-3 rounded-md text-xs overflow-x-auto">
                                                                <code>{q.solutions.python}</code>
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm mb-1">Java Solution:</h4>
                                                            <pre className="bg-gray-800 text-white p-3 rounded-md text-xs overflow-x-auto">
                                                                <code>{q.solutions.java}</code>
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-3 italic text-gray-500">...and 50+ more questions in your personalized roadmap</p>
                                </div>

                                {/* System Design */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-blue-600">System Design Questions</h3>
                                    <div className="space-y-4">
                                        {systemDesignQuestions.map((q, i) => (
                                            <div key={i} className="bg-gray-100 p-4 rounded-xl">
                                                <p className="font-medium text-lg">{q.question}</p>
                                                {q.solution && (
                                                    <div className="mt-2 text-sm bg-blue-50 p-3 rounded text-black">
                                                        <strong>Sample Solution:</strong>
                                                        <pre className="whitespace-pre-wrap mt-2">{q.solution}</pre>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-3 italic text-gray-500">...and 15+ more system design questions in your personalized roadmap</p>
                                </div>

                                {/* Behavioral Questions */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-blue-600">Behavioral Questions</h3>
                                    <div className="space-y-4">
                                        {behavioralQuestions.map((q, i) => (
                                            <div key={i} className="bg-gray-100 p-4 rounded-xl">
                                                <p className="font-medium text-lg">{q.question}</p>
                                                {q.answer && (
                                                    <div className="mt-2 text-sm bg-blue-50 p-3 rounded text-black">
                                                        <strong>Sample Answer:</strong>
                                                        <p className="whitespace-pre-wrap mt-1">{q.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-3 italic text-gray-500">...and 10+ more behavioral questions with model answers</p>
                                </div>

                                {/* Compensation & Similar Positions */}
                                <div className="bg-blue-50 p-6 rounded-xl">
                                    <h3 className="text-xl font-bold mb-4 text-blue-600">Compensation & Benefits</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold mb-2">Salary Structure</h4>
                                            <ul className="space-y-2">
                                                <li className="flex justify-between">
                                                    <span>Base Salary:</span>
                                                    <span className="font-medium">{compensationData.baseSalary}</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>Stock Options:</span>
                                                    <span className="font-medium">{compensationData.stockOptions}</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>Annual Bonus:</span>
                                                    <span className="font-medium">{compensationData.bonus}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-2">Benefits</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {compensationData.benefits.map((benefit, index) => (
                                                    <li key={index}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-blue-600">Similar Positions at Other Companies</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {similarPositions.map((position, index) => (
                                            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md text-center transition-shadow">
                                                <Image
                                                    src={COMPANY_LOGOS[position.companyLogoName.toLowerCase() as keyof typeof COMPANY_LOGOS]?.url || "/default-company-logo.png"}
                                                    alt={COMPANY_LOGOS[position.companyLogoName.toLowerCase() as keyof typeof COMPANY_LOGOS]?.alt || "Company Logo"}
                                                    width={50}
                                                    height={50}
                                                    className="mx-auto mb-2"
                                                />
                                                <h4 className="font-bold text-lg">{position.role}</h4>
                                                <p className="text-gray-700">{position.company}, {position.location}</p>
                                                <p className="text-green-600 font-medium mt-2">{position.salary}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 text-center">
                                    <Button
                                        className={`px-8 py-4 text-lg ${theme.colors.primaryBg} ${theme.colors.primaryHoverBg}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Get Your Personalized Roadmap
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};