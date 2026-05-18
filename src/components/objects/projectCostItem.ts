export interface ProjectCostItem {
  id: string;
  project_id: string;
  section: 'Civil' | 'Electrical' | 'Plumbing' | 'Carpentry' | 'Painting' | 'Design' | 'Other';
  amount: number;
  date: string;
  description: string;
  vendorId: string;
  status: 'Paid' | 'Pending';
  attachment?: string;
}

export const INITIAL_COSTS: ProjectCostItem[] = [
  { id: 'cost1', project_id: 'PROJ-2024-07-001', section: 'Civil', amount: 65000, date: '2024-02-15', description: 'Foundation work & Masonry', vendorId: 'v1', status: 'Paid', attachment: 'invoice_v1_01.pdf' },
  { id: 'cost2', project_id: 'PROJ-2024-07-001', section: 'Electrical', amount: 25000, date: '2024-03-10', description: 'Concealed wiring & Board installation', vendorId: 'v2', status: 'Paid', attachment: 'invoice_v2_01.pdf' },
  { id: 'cost3', project_id: 'PROJ-2024-07-001', section: 'Carpentry', amount: 120000, date: '2024-04-05', description: 'Modular kitchen & Wardrobe carcass', vendorId: 'v3', status: 'Pending' },
  { id: 'cost4', project_id: 'PROJ-2024-07-001', section: 'Painting', amount: 18000, date: '2024-06-20', description: 'Wall putty & Primary coat', vendorId: 'v4', status: 'Paid', attachment: 'invoice_v4_01.pdf' },
  { id: 'cost5', project_id: 'PROJ-2024-07-001', section: 'Plumbing', amount: 12000, date: '2024-04-12', description: 'Pipe fittings', vendorId: 'v2', status: 'Paid', attachment: 'invoice_v2_02.pdf' },
  { id: 'cost6', project_id: 'PROJ-2024-07-001', section: 'Civil', amount: 15000, date: '2024-05-02', description: 'Tiling labor', vendorId: 'v1', status: 'Pending' },
];



