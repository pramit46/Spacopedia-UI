import {User} from './user';
import {Role} from  './role';


export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  starred: boolean;
}

export interface WeeklyStatus {
  id: string;
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  photos: string[];
  date: string;
  userId: string; // ID of the creator
  project_id: string; // Associated project ID
  progressText?: string;
  comments?: ChatMessage[];
  auditMaterial?: 'verified' | 'pending' | 'failed';
  auditSafety?: 'certified' | 'pending' | 'failed';
  source?: 'external' | 'mock';
}

export const INITIAL_WEEKLY_STATUS: WeeklyStatus[] = [
  { 
    id: '1', 
    month: 'July', 
    year: 2024,
    startDate: '2024-07-07',
    endDate: '2024-07-13',
    date: '2024-07-14',
    userId: 'u4',
    project_id: 'PROJ-2024-07-001',
    photos: [
      'https://www.shutterstock.com/image-photo/cottage-under-construction-interior-unfinished-260nw-2311296329.jpg?w=500&auto=format&fit=crop&q=60',
      'https://www.shutterstock.com/image-photo/empty-under-construction-room-home-260nw-2170165485.jpg?w=500&auto=format&fit=crop&q=60'
    ],
    progressText: 'Tiling work is 80% complete. Electrical wiring for the living area started. Bathroom plumbing successfully pressure tested.',
    auditMaterial: 'verified',
    auditSafety: 'certified',
    source: 'mock',
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Alice Client', text: 'Looks great! Can we speed up the tiling process?', timestamp: '2024-07-14 10:00', starred: true },
      { id: 'c2', userId: 'u1', userName: 'Pramit Owner', text: 'We are working on it, Alice. More workers arriving Monday.', timestamp: '2024-07-14 11:30', starred: false },
    ]
  },
  { 
    id: '2', 
    month: 'July', 
    year: 2024,
    startDate: '2024-06-30',
    endDate: '2024-07-06',
    date: '2024-07-07',
    userId: 'u4',
    project_id: 'PROJ-2024-07-001',
    photos: [
      'https://media.istockphoto.com/id/2190448800/photo/drywall-installers-working-in-kitchen-renovation.jpg?s=612x612&w=0&k=20&c=fsexnZL5oN4Yh18xFVpL8ohH48_s4DmLEEJCEZtIkTo='
    ],
    progressText: 'Foundation wall painting in progress. Verification of shade consistency against Design v2.0 approved.',
    auditMaterial: 'verified',
    auditSafety: 'pending',
    source: 'mock',
    comments: [
      { id: 'c3', userId: 'u2', userName: 'Alice Client', text: 'Confirming the wall color is as per the final design?', timestamp: '2024-07-07 09:00', starred: false },
      { id: 'c4', userId: 'u4', userName: 'Charlie Project', text: 'Yes, it is the exact shade from Design v2.0.', timestamp: '2024-07-07 14:00', starred: true },
    ]
  },
];