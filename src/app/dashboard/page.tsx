'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <img src="/icons/aircraft_hot_air_balloon.svg" alt="Dream Icon" className="w-8 h-8" />
        <h1 className="text-3xl font-bold text-indigo-700">Let's Build That Dream Here - Your Career Blueprint</h1>
      </div>
      <p className="text-gray-600 text-lg">
        Welcome to your personal dashboard — whether you're into tech, design, HR, finance, or literally anything else,
        this is where the real glow-up begins.
      </p>

      <div className="bg-indigo-50 rounded-xl p-6 space-y-4 shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/icons/amusement_park_ferris_wheel.svg" alt="Ferris Icon" className="w-6 h-6" />
          <h2 className="text-2xl font-semibold text-indigo-800">What You Can Do Here:</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Create Custom Roadmaps:</strong> Pick a company, choose your dream role and boom — get a step-by-step game plan.</li>
          <li><strong>Choose Your Domain:</strong> IT or non-IT? Doesn't matter. You're the main character — we build the plot around you.</li>
          <li><strong>Track Your Journey:</strong> See your progress like a Netflix series. Binge-worthy and satisfying AF.</li>
          <li><strong>Real Career Insights:</strong> We're talking actual industry patterns, current hiring trends, and handpicked resources.</li>
          <li><strong>Recent Data:</strong> We're giving you the recent insights on interview patterns, questions and handpicked true compensations. No bluff!</li>
          <li><strong>Budget Friendly:</strong> Very chip. Yeah? Just like a one pizza treat. 😎</li>
        </ul>
      </div>

      <div className="bg-green-50 rounded-xl p-6 space-y-4 shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/icons/amusement_park_balloon.svg" alt="Balloon Icon" className="w-6 h-6" />
          <h2 className="text-2xl font-semibold text-green-800">Tips to Max Out Your Potential:</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Start with what you know — and be honest about where you're at. No shame in being a beginner.</li>
          <li>Consistency &gt; Perfection. Show up, even if it's messy.</li>
          <li>Use the roadmap as your daily/weekly compass. You don't have to do everything, just do the next thing.</li>
          <li>Use the resources listed in each step — they're curated so you don't waste time googling endlessly.</li>
          <li>Get into communities, groups, and events — most breakthroughs happen outside your bubble. 🫧</li>
        </ul>
      </div>

      <div className="bg-yellow-50 rounded-xl p-6 space-y-4 shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/icons/theater_masks.svg" alt="Motivation Icon" className="w-6 h-6" />
          <h2 className="text-2xl font-semibold text-yellow-700">And Here — The Motivation Booster</h2>
        </div>
        <p className="text-gray-700 text-lg">
          Whether you're switching careers, job-hunting, or just exploring — this space is for <b>you</b>.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>You're not “behind” — you're just on a different track. Your path is valid.</li>
          <li>Everyone starts from zero. Growth isn't linear, but progress is inevitable if you stay in the game.</li>
          <li>Breakdowns are normal. Breakthroughs are around the corner.</li>
          <li>Your dream job is not “too big.” Let's break it down, step by step.</li>
        </ul>
        <p className="text-gray-700 mt-4 font-medium">
          You've got the potential. We've got the plan. Let's make this your comeback era. 🔥
        </p>
      </div>

      <div className="text-center pt-6">
        <p className="text-gray-600 text-lg font-semibold">
          Ready to create your new roadmap and become the main character of your career?
        </p>
        {/* <button className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-full shadow-lg transition-all duration-200">
          🚀 Create Roadmap Now
        </button> */}
      </div>
    </div>
  );
}
