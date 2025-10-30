import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, Testimonial } from '../db-utils';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data.testimonials);
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const testimonialData = await request.json();
    const data = await readData();
    
    const newTestimonial: Testimonial = {
      ...testimonialData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      verified: false
    };
    
    data.testimonials.unshift(newTestimonial);
    await writeData(data);
    
    return NextResponse.json(newTestimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}