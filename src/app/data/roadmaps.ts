import { COMPANY_LOGOS } from "./companyLogos";

export const roadMapLabel = "The roadmaps below are sample versions provided for demonstration purposes. The actual content offers significantly deeper insights, including previously asked questions, recent interview patterns, and hands-on exercises for thorough preparation.";

export const roadmapSampleStructureQuestionsText = "Recently Asked Questions";

export const roadmaps = [
    {
      title: "Amazon - SDE 3",
      pattern: "3 rounds: DSA + System Design + Behavioural",
      questions: [
        "Two Sum, LRU Cache, Median of Two Sorted Arrays",
        "Design BookMyShow, Rate Limiter",
        "Tell me about a time you failed"
      ],
      similar: [
        "Microsoft SDE 3, Flipkart Backend Developer, Uber Entry-Level Backend"
      ],
      experience: "Most Amazon interviews start with 1-2 DSA rounds focusing on Leetcode Medium/Hard, followed by a round on system design (even for SDE 1), and a strong focus on Amazon's leadership principles during behavioral rounds.",
      company: COMPANY_LOGOS.amazon,
    },
    {
      title: "Google - Network Engineer",
      pattern: "4 rounds: Program Sense + Technical Depth + Googliness",
      questions: [
        "How do you manage cross-functional dependencies?",
        "Explain a network roadmap you led.",
        "What's your leadership style?"
      ],
      similar: [
        "Meta Network Developer, Atlassian Network Lead"
      ],
      experience: "Google looks for structured thinkers. Emphasis is on stakeholder alignment, team coordination, and solving ambiguity. Technical depth is tested with architectural discussions and scenario-based questions.",
      company: COMPANY_LOGOS.google,
    },
    {
      title: "Meta - ML Engineer",
      pattern: "5 rounds: ML Concepts + System Design + Coding + Behavioural",
      questions: [
        "Implement Logistic Regression from scratch.",
        "Design a recommendation engine.",
        "DSA: Top K Frequent Words, Graph Traversals"
      ],
      similar: [
        "Google ML Engineer, Amazon Applied Scientist, Apple ML Research"
      ],
      experience: "Meta focuses on practical ML application, clean code, and scaling models. Expect case-study style rounds and in-depth technical discussions. Behavioral questions often involve past collaborations and outcomes.",
      company: COMPANY_LOGOS.meta,
    },
    {
      title: "Microsoft - DevOps Engineer",
      pattern: "4 rounds: Coding + DevOps Knowledge + Behavioral",
      questions: [
        "Design CI/CD pipeline for front-end app",
        "AWS, Azure and GCP Cloud Concepts",
        "Linux v/s Windows OS Build Implementation",
        "GitHub auto pipeline flows"
      ],
      similar: [
        "Google Support Engineer, Amazon DevOps Lead, Uber DevOps Engineer"
      ],
      experience: "Microsoft interviews focus on clean code, OOP principles, and system design at scale. Behavioral rounds emphasize collaboration and problem-solving approaches.",
      company: COMPANY_LOGOS.microsoft,
    },
    {
      title: "Apple - Human Resource, Recruiter",
      pattern: "3 rounds: Screening + HR/ Recruitement Depth + Take Home",
      questions: [
        "Hiring Steps",
        "IT Recruitment Skills",
        "How to improve candidate relations and candidate experience"
      ],
      similar: [
        "Spotify IT Recruiter, Netflix HR Department Lead"
      ],
      experience: "Apple HR interviews focus heavily on Recruitment, performance improvement, and attention to detail. HR role often involves Apple-specific behavioural questions.",
      company: COMPANY_LOGOS.apple,
    },
  ];