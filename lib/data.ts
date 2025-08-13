export interface Job {
  id: number;
  title: string;
  description: string;
  skills: string[];
  salary: number;
}

export interface Candidate {
  id: number;
  name: string;
  bio: string;
  skills: string[];
  salaryExpectation: number;
}

// In-memory stores for demo purposes.
export const jobs: Job[] = [];
export const candidates: Candidate[] = [];
