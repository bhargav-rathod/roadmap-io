export async function createPrompt(roadmapData: any): Promise<string> {
    try {
        let prompt = `Conduct in-depth deep research, web search and generate a comprehensive, detailed roadmap for the role of \
      ${roadmapData.role} at ${roadmapData.company},`;

        if (roadmapData.country) {
            prompt += `for the country ${roadmapData.country}.`;
        }

        prompt += `The roadmap should be highly structured and tailored to real-world expectations, including the following sections:\n\n\
                    1. Role Overview - Responsibilities, required skills, and tools/technologies commonly used.\n\
                    2. Interview Pattern - Provide a detailed breakdown of the interview process (number of rounds, types of interviews, etc.).\n\
                    3. Interview Questions & Answers - Include over 150+ recently asked interview questions across all rounds, each with detailed and accurate answers.\n`;

        if (roadmapData.isFresher) {
            prompt += `\n4. Experience Level - Structure the roadmap specifically for freshers (0 years of experience).\n`;
        } else {
            prompt += `\n4. Experience Level - Tailor this roadmap for a candidate with approximately ${roadmapData.yearsOfExperience} years of experience.\n`;
        }

        if (roadmapData.roleType === 'IT') {
            prompt += `\n (If DSA is required and asked in the interview then only add this point 5) 5. DSA & System Design Questions - Include at least **150+ Data Structures and Algorithms (DSA)** and **System Design** questions with clear and appropriate answers.`;
            if (roadmapData.programmingLanguage) {
                prompt += ` Ensure all code solutions are in ${roadmapData.programmingLanguage}.`;
            }
            prompt += '\n';
        }

        if (roadmapData.includeCompensationData) {
            prompt += `\n6. Compensation Insights - Provide details of recent compensation packages (salary, bonuses, stock options, etc.) from 5 to 6 verified sources for the same or similar role at ${roadmapData.company}.\n`;
        }

        if (roadmapData.includeSimilarCompanies) {
            prompt += `\n7. Comparable Opportunities - List similar roles at other top companies, including responsibilities, requirements, and compensation (if available).\n`;
        }

        if (roadmapData.includeOtherDetails && roadmapData.otherDetails.trim() !== '') {
            prompt += `\n8. Additional Instructions - ${roadmapData.otherDetails}\n`;
        }

        prompt += `\nMake sure the roadmap is clear, long, structured, and practically applicable. Include bullet points, sections, and formatting where necessary (skip the title).`;

        return prompt;
    } catch (error) {
        throw new Error('Failed to generate prompt');
    }
}
