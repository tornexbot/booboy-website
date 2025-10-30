import fs from 'fs/promises';
import path from 'path';

export interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  date: string;
  verified: boolean;
}

export interface GiveawayWinner {
  id: number;
  name: string;
  prize: string;
  date: string;
  tx: string;
}

export interface DatabaseData {
  testimonials: Testimonial[];
  giveaways: GiveawayWinner[];
}

const dataFilePath = path.join(process.cwd(), 'data', 'database.json');

// Ensure data directory exists
export async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read data from file
export async function readData(): Promise<DatabaseData> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Return default structure if file doesn't exist
    return {
      testimonials: [],
      giveaways: []
    };
  }
}

// Write data to file
export async function writeData(data: DatabaseData): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}