export type Division =
  'PTCAO' | 'ICTO' | 'PDD' | 'PLPP' | 'GAD' |
  'LEDIPO' | 'PWO' | 'MAO' | 'BUDGET' | 'HR';

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  dateCompletion?: Date;
  budget?: number;
  fundSource: string;
  images: string[];
  division: Division;
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
}
