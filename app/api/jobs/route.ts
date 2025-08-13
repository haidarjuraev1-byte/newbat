import { NextRequest, NextResponse } from 'next/server';
import { jobs, Job } from '@/lib/data';

export async function GET() {
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const job: Job = await req.json();
  job.id = jobs.length + 1;
  jobs.push(job);
  return NextResponse.json(job, { status: 201 });
}
