
export interface ManpowerMaster {
  id: string;
  type: string;
  ratePerDay: number;
  skillLevel: 'unskilled' | 'semi-skilled' | 'skilled' | 'highly-skilled';
  state: string;
  city: string;
}

export const INITIAL_MANPOWER: ManpowerMaster[] = [
  { id: 'mp1', type: 'Mason', ratePerDay: 850, skillLevel: 'skilled', state: 'Maharashtra', city: 'Mumbai' },
  { id: 'mp2', type: 'Helper', ratePerDay: 450, skillLevel: 'unskilled', state: 'Delhi', city: 'New Delhi' },
  { id: 'mp3', type: 'Electrician', ratePerDay: 900, skillLevel: 'highly-skilled', state: 'Karnataka', city: 'Bangalore' },
  { id: 'mp4', type: 'Painter', ratePerDay: 750, skillLevel: 'skilled', state: 'West Bengal', city: 'Kolkata' },
  { id: 'mp5', type: 'Plumber', ratePerDay: 850, skillLevel: 'skilled', state: 'Tamil Nadu', city: 'Chennai' },
];