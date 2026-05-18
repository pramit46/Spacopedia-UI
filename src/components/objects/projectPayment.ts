export interface ProjectPayment {
  id: string;
  project_id: string;
  amount: number;
  date: string;
  tranche: string;
  status: 'received' | 'pending';
  description?: string;
  attachment?: string;
}




export const INITIAL_PAYMENTS: ProjectPayment[] = [
  { id: 'pay1', project_id: 'PROJ-2024-07-001', amount: 50000, date: '2024-01-10', tranche: 'Advance', status: 'received', description: 'Initial project kickoff advance', attachment: 'receipt_adv.pdf' },
  { id: 'pay2', project_id: 'PROJ-2024-07-001', amount: 75000, date: '2024-03-20', tranche: 'Civil Completion', status: 'received', description: 'Payment for structural work completion', attachment: 'receipt_civil.pdf' },
  { id: 'pay3', project_id: 'PROJ-2024-07-001', amount: 45000, date: '2024-05-15', tranche: 'Design & Fabrication', status: 'received', description: 'Design approval and material procurement', attachment: 'receipt_fab.pdf' },
  { id: 'pay4', project_id: 'PROJ-2024-07-001', amount: 100000, date: '2024-07-01', tranche: 'Interim Payment', status: 'pending', description: 'Scheduled phase 2 interim payment' },
];