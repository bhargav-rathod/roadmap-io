// lib/publicHomePageTestimonials.ts
export async function getTestimonialsConfig() {
    try {
      const response = await fetch('/api/config?key=publicHomePageTestimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      return JSON.parse(data.publicHomePageTestimonials);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      return [];
    }
  }