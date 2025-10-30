import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, GiveawayWinner } from '../db-utils';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data.giveaways);
  } catch (error) {
    console.error('Error reading giveaways:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const giveawayData = await request.json();
    const data = await readData();
    
    const newGiveaway: GiveawayWinner = {
      ...giveawayData,
      id: Date.now()
    };
    
    data.giveaways.unshift(newGiveaway);
    await writeData(data);
    
    return NextResponse.json(newGiveaway);
  } catch (error) {
    console.error('Error creating giveaway:', error);
    return NextResponse.json({ error: 'Failed to create giveaway' }, { status: 500 });
  }
}