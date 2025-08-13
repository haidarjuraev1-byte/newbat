import { NextRequest, NextResponse } from 'next/server';
import { candidates, Candidate } from '@/lib/data';

export async function GET() {
  return NextResponse.json(candidates);
}

export async function POST(req: NextRequest) {
  const candidate: Candidate = await req.json();
  candidate.id = candidates.length + 1;
  candidates.push(candidate);
  return NextResponse.json(candidate, { status: 201 });
}
