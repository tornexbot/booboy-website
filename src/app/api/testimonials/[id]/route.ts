import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, Testimonial } from '../../db-utils';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const updates = await request.json();
    const data = await readData();
    
    const testimonialId = parseInt(params.id);
    const index = data.testimonials.findIndex((t: Testimonial) => t.id === testimonialId);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    data.testimonials[index] = { ...data.testimonials[index], ...updates };
    await writeData(data);
    
    return NextResponse.json(data.testimonials[index]);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const data = await readData();
    
    const testimonialId = parseInt(params.id);
    const initialLength = data.testimonials.length;
    data.testimonials = data.testimonials.filter((t: Testimonial) => t.id !== testimonialId);
    
    if (data.testimonials.length === initialLength) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}