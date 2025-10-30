import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, GiveawayWinner } from '../../db-utils';

// ✅ Next.js 15+ route handler format
// `params` must be awaited because it's now a Promise in the latest type definition.
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 await required
    const updates = await request.json();
    const data = await readData();

    const giveawayId = parseInt(id);
    const index = data.giveaways.findIndex((g: GiveawayWinner) => g.id === giveawayId);

    if (index === -1) {
      return NextResponse.json({ error: 'Giveaway not found' }, { status: 404 });
    }

    data.giveaways[index] = { ...data.giveaways[index], ...updates };
    await writeData(data);

    return NextResponse.json(data.giveaways[index]);
  } catch (error) {
    console.error('Error updating giveaway:', error);
    return NextResponse.json({ error: 'Failed to update giveaway' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 await required
    const data = await readData();

    const giveawayId = parseInt(id);
    const initialLength = data.giveaways.length;
    data.giveaways = data.giveaways.filter((g: GiveawayWinner) => g.id !== giveawayId);

    if (data.giveaways.length === initialLength) {
      return NextResponse.json({ error: 'Giveaway not found' }, { status: 404 });
    }

    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting giveaway:', error);
    return NextResponse.json({ error: 'Failed to delete giveaway' }, { status: 500 });
  }
}
