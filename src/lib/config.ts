// lib/config.ts
import { getSession } from 'next-auth/react';

export interface ConfigValues {
  [key: string]: string;
}

export async function getConfig(key?: string): Promise<ConfigValues> {
  const url = key ? `/api/config?key=${key}` : '/api/config';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }

  return response.json();
}

export async function getConfigForPublic(): Promise<ConfigValues> {
  const response = await fetch('/api/config', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch public config: ${response.statusText}`);
  }

  return response.json();
}