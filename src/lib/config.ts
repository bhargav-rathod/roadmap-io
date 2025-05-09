export interface ConfigValues {
  [key: string]: string;
}

export async function getConfig(key?: string): Promise<ConfigValues> {
  const url = key ? `/api/config?key=${key}` : '/api/config';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Config fetch error:', error);
    throw error;
  }
}

export async function getConfigForPublic(): Promise<ConfigValues> {
  return getConfig();
}