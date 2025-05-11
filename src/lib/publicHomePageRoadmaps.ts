export async function getRoadmapsConfig() {
    try {
      const response = await fetch('/api/config?key=publicHomePageRoadmaps');
      if (!response.ok) throw new Error('Failed to fetch roadmaps');
      const data = await response.json();
      return JSON.parse(data.publicHomePageRoadmaps);
    } catch (error) {
      console.error('Error loading roadmaps:', error);
      return [];
    }
  }