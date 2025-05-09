// lib/publicHomePageFeatures.ts
export async function getFeaturesConfig() {
  try {
    const response = await fetch('/api/config?key=publicHomePageFeatures');
    if (!response.ok) throw new Error('Failed to fetch features');
    const data = await response.json();
    return JSON.parse(data.publicHomePageFeatures);
  } catch (error) {
    console.error('Error loading features:', error);
    return [];
  }
}