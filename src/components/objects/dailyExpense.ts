export interface DailyExpense {
  id: string;
  project_id: string;
  memberName: string;
  memberId: string;
  timestamp: string;
  mode: 'Transport' | 'Meals' | 'Other';
  subMode: string;
  startLocation?: string;
  endLocation?: string;
  amount: number;
  fileName: string;
  comment?: string;
  userId: string; // ID of the creator
}



export type Expense = DailyExpense;
export const INITIAL_DAILY_EXPENSES: DailyExpense[] = [
  { 
    id: '1', 
    project_id: 'PROJ-2024-07-001',
    memberName: 'John Doe', 
    memberId: 'EMP101', 
    timestamp: '2024-07-15 09:30', 
    mode: 'Transport', 
    subMode: 'Taxi', 
    startLocation: 'Main Office', 
    endLocation: 'Project Site A', 
    amount: 445.50, 
    fileName: 'bill_taxi.pdf',
    comment: 'Travel for weekly site inspection and material verification.',
    userId: 'u4'
  },
  { 
    id: '2', 
    project_id: 'PROJ-2024-07-001',
    memberName: 'Jane Smith', 
    memberId: 'EMP102', 
    timestamp: '2024-07-15 13:00', 
    mode: 'Meals', 
    subMode: 'Lunch with Client', 
    amount: 1112.00, 
    fileName: 'bill_lunch.jpg',
    comment: 'Client meeting regarding final design approval for living room.',
    userId: 'u4'
  },
];
export const INITIAL_EXPENSES = INITIAL_DAILY_EXPENSES;
