export async function createPrompt(data: any): Promise<string[]> {
    const prompts: string[] = [];
    
    // Base context with enhanced formatting
    const base = `for the role of **${data.role}** at **${data.company}**${data.country ? ' in ' + data.country : ''}`;
    const experienceLevel = data.isFresher ? 
        "a fresher" : 
        `someone with ${data.yearsOfExperience} years of experience`;

    // 1. Role Overview (enhanced with more specific requests)
    prompts.push(
        `1. Conduct comprehensive research using the most recent data to provide a detailed **Role Overview** ${base} and ${experienceLevel}.\n\n` +
        `- **Key Responsibilities**: List core responsibilities in bullet points\n` +
        `- **Essential Skills**: Categorize into:\n` +
        `  * Technical Skills (specific languages, frameworks, tools)\n` +
        `  * Soft Skills (communication, leadership, etc.)\n` +
        `- **Tools & Technologies**: Group by:\n` +
        `  * Must-have (primary tools used daily)\n` +
        `  * Nice-to-have (secondary/emerging technologies)\n` +
        `- **Industry Trends**: Mention 3-5 current trends affecting this role\n` +
        `- **Career Progression**: Typical next roles/promotion paths\n`+
        `(Skip the tile in Role Overview.)`

    );

    // 2. Interview Pattern (more structured request)
    prompts.push(
        `2. Conduct comprehensive research using the most recent data to provide a detailed and provide the exact **Interview Pattern** ${base} based on recent candidate reports (2023-2024).\n\n` +
        `- **Process Flow**: Step-by-step stages from application to offer\n` +
        `- **Round Details**: For each round include:\n` +
        `  * Type (Technical, HR, Case Study, etc.)\n` +
        `  * Duration\n` +
        `  * Participants (who conducts it)\n` +
        `  * Evaluation Criteria\n` +
        `- **Preparation Timeline**: Suggested study plan (1-week, 1-month, 3-month options)\n` +
        `- **Success Metrics**: What distinguishes top candidates?`
    );

    // IT-specific prompts
    if (data.roleType === 'IT') {
        // 3.1 DSA Questions (more organized)
        prompts.push(
            `3.1 Conduct comprehensive research using the most recent data and check whether this ${data.role}** at **${data.company} asking DSA questions or not, IFF yes then only provide a recently asked **200 unique DSA questions** ${base}. Structure as:\n\n` +
            `By Topic\n` +
            `Include difficulty indicators (★ to ★★★★)\n`
        );

        // 3.2 System Design (more detailed)
        prompts.push(
            `3.2. Conduct comprehensive research using the most recent data and check whether this ${data.role}** at **${data.company} asking System Design questions or not, IFF yes then only provide a detailed generate **150 system design questions** ${base} ` +
            `By Topic\n`+
            `Include difficulty indicators (★ to ★★★★)\n`
        );
    }
    else{
        prompts.push(
        `3. Conduct comprehensive research using the most recent data to provide a detailed **200 recently asked interview questions** ${base}. Organize as:\n\n` +
        `By Topic` +
        `- Include difficulty indicators (★ to ★★★★)\n` +
        `- Provide sample ideal answers for key questions`
    );
    }

    // Compensation data (more structured)
    if (data.includeCompensationData) {
        prompts.push(
            `4. Conduct comprehensive research using the most recent data and provide **Compensation Insights** ${base} data:\n\n` +
            `- **Salary Ranges**: Base, bonus, equity\n` +
            `  * By experience level\n` +
            `  * By location\n` +
            `- **Benefits**: Unique perks at ${data.company}\n` +
            `- **Negotiation Tips**: 5-7 proven strategies\n` +
            `- **Cost of Living**: If relevant to location`
        );
    }

    // Similar companies (more actionable)
    if (data.includeSimilarCompanies) {
        prompts.push(
            `5. Conduct comprehensive research using the most recent data and list **5 Comparable Roles** to ${base} at:\n\n` +
            `- Direct competitors\n` +
            `- Similar-sized companies\n` +
            `- Include:\n` +
            `  * Salary comparisons\n` +
            `  * Culture differences\n` +
            `  * Growth opportunities\n` +
            `  * Hiring bar relative to ${data.company}`
        );
    }

    // Additional details (better handling)
    if (data.includeOtherDetails && data.otherDetails.trim() !== '') {
        prompts.push(
            `6. Address these specific requirements:\n\n` +
            `"${data.otherDetails}"\n\n` +
            `- Provide actionable steps\n` +
            `- Suggest alternative approaches\n` +
            `- Include risk assessments where applicable`
        );
    }

    // Add consistency instruction to all prompts
    return prompts.map(prompt => 
        `${prompt}\n\n` +
        `Guidelines:\n` +
        `- Use markdown formatting with clear headings\n` +
        // `- Cite 2-3 sources for factual claims\n` +
        `- Prioritize recent data\n` +
        `- Maintain professional but approachable tone`
    );
}