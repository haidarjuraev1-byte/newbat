import { NextRequest, NextResponse } from 'next/server';
import { jobs, candidates } from '@/lib/data';

export async function POST(req: NextRequest) {
  const { candidateId } = await req.json();
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  }

  const matches = jobs
    .map((job) => ({
      job,
      score: job.skills.filter((s) => candidate.skills.includes(s)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.job);

  return NextResponse.json(matches);
}
