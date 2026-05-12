
export type Role = string;

export interface User {
  id: string;
  name: string;
  role: Role;
}

export const INITIAL_ROLES: Role[] = ['client', 'accounts', 'project', 'sales', 'owner', 'designer', 'legal'];

export interface TabConfig {
  id: string;
  label: string;
  iconName: string; // Store name to map to lucide icons
}

export interface RolePermission {
  role: Role;
  allowedTabs: string[];
}

export const AVAILABLE_TABS: TabConfig[] = [
  { id: 'quotation', label: 'Quotation', iconName: 'FileText' },
  { id: 'design', label: 'Design', iconName: 'ImageIcon' },
  { id: 'material', label: 'Material', iconName: 'Package' },
  { id: 'weekly-status', label: 'Weekly Status', iconName: 'GanttChartSquare' },
  { id: 'billing', label: 'Daily Expenses', iconName: 'CreditCard' },
  { id: 'legal', label: 'Legal', iconName: 'ShieldCheck' },
  { id: 'accounts', label: 'Accounts', iconName: 'LayoutDashboard' },
  { id: 'settings', label: 'Settings', iconName: 'Settings' },
];

export const INITIAL_ROLE_PERMISSIONS: RolePermission[] = [
  { role: 'sales', allowedTabs: ['quotation'] },
  { role: 'designer', allowedTabs: ['quotation', 'design', 'material', 'weekly-status'] },
  { role: 'owner', allowedTabs: ['quotation', 'design', 'material', 'weekly-status', 'billing', 'legal', 'accounts', 'settings'] },
  { role: 'client', allowedTabs: ['design', 'material', 'weekly-status'] },
  { role: 'project', allowedTabs: ['design', 'weekly-status', 'billing'] },
  { role: 'accounts', allowedTabs: ['design', 'material', 'weekly-status', 'billing', 'accounts', 'settings'] },
  { role: 'legal', allowedTabs: ['legal'] },
];

export interface Project {
  id: string;
  year: number;
  month: string;
  clientId: string;
}

export interface DesignVersion {
  id: string;
  version: string;
  date: string;
  description: string;
  fileName: string;
  userId: string; // ID of the creator
}

export interface Expense {
  id: string;
  memberName: string;
  memberId: string;
  timestamp: string;
  mode: 'Transport' | 'Meals' | 'Other';
  subMode: string;
  startLocation?: string;
  endLocation?: string;
  amount: number;
  fileName: string;
  userId: string; // ID of the creator
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  starred: boolean;
}

export interface ProjectPayment {
  id: string;
  projectId: string;
  amount: number;
  date: string;
  tranche: string;
  status: 'received' | 'pending';
}

export interface ProjectCostItem {
  id: string;
  projectId: string;
  section: 'Civil' | 'Electrical' | 'Plumbing' | 'Carpentry' | 'Painting' | 'Design' | 'Other';
  amount: number;
  date: string;
  description: string;
  vendorId: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  address: string;
  state: string;
  city: string;
  poc: string;
  contactNumber: string;
  rating?: number;
}

export interface ClientMaster {
  id: string;
  name: string;
  address?: string;
  projectAddress: string;
  contactNumber: string;
  email: string;
}

export interface MaterialMaster {
  id: string;
  name: string;
  unit: string;
  rate: number;
  category: string;
  state: string;
  city: string;
}

export interface ManpowerMaster {
  id: string;
  type: string;
  ratePerDay: number;
  skillLevel: 'unskilled' | 'semi-skilled' | 'skilled' | 'highly-skilled';
  state: string;
  city: string;
}

export const INITIAL_PAYMENTS: ProjectPayment[] = [
  { id: 'pay1', projectId: 'PROJ-2024-07-001', amount: 50000, date: '2024-01-10', tranche: 'Advance', status: 'received' },
  { id: 'pay2', projectId: 'PROJ-2024-07-001', amount: 75000, date: '2024-03-20', tranche: 'Civil Completion', status: 'received' },
  { id: 'pay3', projectId: 'PROJ-2024-07-001', amount: 45000, date: '2024-05-15', tranche: 'Design & Fabrication', status: 'received' },
  { id: 'pay4', projectId: 'PROJ-2024-07-001', amount: 100000, date: '2024-07-01', tranche: 'Interim Payment', status: 'pending' },
];

export const INITIAL_COSTS: ProjectCostItem[] = [
  { id: 'cost1', projectId: 'PROJ-2024-07-001', section: 'Civil', amount: 65000, date: '2024-02-15', description: 'Foundation work & Masonry', vendorId: 'v1' },
  { id: 'cost2', projectId: 'PROJ-2024-07-001', section: 'Electrical', amount: 25000, date: '2024-03-10', description: 'Concealed wiring & Board installation', vendorId: 'v2' },
  { id: 'cost3', projectId: 'PROJ-2024-07-001', section: 'Carpentry', amount: 120000, date: '2024-04-05', description: 'Modular kitchen & Wardrobe carcass', vendorId: 'v3' },
  { id: 'cost4', projectId: 'PROJ-2024-07-001', section: 'Painting', amount: 18000, date: '2024-06-20', description: 'Wall putty & Primary coat', vendorId: 'v4' },
  { id: 'cost5', projectId: 'PROJ-2024-07-001', section: 'Plumbing', amount: 12000, date: '2024-04-12', description: 'Pipe fittings', vendorId: 'v2' },
  { id: 'cost6', projectId: 'PROJ-2024-07-001', section: 'Civil', amount: 15000, date: '2024-05-02', description: 'Tiling labor', vendorId: 'v1' },
];

export const VENDORS: Vendor[] = [
  { 
    id: 'v1', 
    name: 'BuildStrong Civil', 
    type: 'Civil Contractor', 
    address: '123 Construction Lane',
    state: 'Maharashtra',
    city: 'Mumbai',
    poc: 'Ramesh Kumar',
    contactNumber: '+91 98765 43210',
    rating: 4.8
  },
  { 
    id: 'v2', 
    name: 'Sparky Electricians', 
    type: 'Wiring & Components',
    address: '45 Voltage Blvd',
    state: 'Karnataka',
    city: 'Bangalore',
    poc: 'Suresh Raina',
    contactNumber: '+91 87654 32109',
    rating: 4.5
  },
  { 
    id: 'v3', 
    name: 'WoodWizard Carpentry', 
    type: 'Furniture & Woodwork',
    address: '78 Timber Road',
    state: 'Delhi',
    city: 'New Delhi',
    poc: 'Amit Singh',
    contactNumber: '+91 76543 21098',
    rating: 4.9
  },
  { 
    id: 'v4', 
    name: 'Perfect Finish Paints', 
    type: 'Wall Treatments',
    address: '12 Color Plaza',
    state: 'West Bengal',
    city: 'Kolkata',
    poc: 'Debashis Roy',
    contactNumber: '+91 65432 10987',
    rating: 4.2
  },
];

export const INITIAL_CLIENTS: ClientMaster[] = [
  {
    id: 'c1',
    name: 'Alice Client',
    address: 'Flat 402, Green Valley Apartments',
    projectAddress: 'Plot 12, Sector 5, HSR Layout, Bangalore',
    contactNumber: '+91 99887 76655',
    email: 'alice@example.com'
  },
  {
    id: 'c2',
    name: 'John Doe',
    projectAddress: 'Villa 7, Palm Jumeirah, Dubai (Offshore Project)',
    contactNumber: '+971 50 123 4567',
    email: 'john.doe@example.com'
  }
];

export interface WeeklyStatus {
  id: string;
  month: string;
  year: number;
  week: string;
  photos: string[];
  date: string;
  userId: string; // ID of the creator
  progressText?: string;
  comments?: ChatMessage[];
  auditMaterial?: 'verified' | 'pending' | 'failed';
  auditSafety?: 'certified' | 'pending' | 'failed';
}

export const USERS: User[] = [
  { id: 'u1', name: 'Pramit Owner', role: 'owner' },
  { id: 'u2', name: 'Alice Client', role: 'client' },
  { id: 'u3', name: 'Bob Accounts', role: 'accounts' },
  { id: 'u4', name: 'Charlie Project', role: 'project' },
  { id: 'u5', name: 'David Sales', role: 'sales' },
  { id: 'u6', name: 'Eve Designer', role: 'designer' },
  { id: 'u7', name: 'Frank Legal', role: 'legal' },
];

export const INITIAL_MATERIALS: MaterialMaster[] = [
  { id: 'm1', name: 'Cement', unit: 'Bag', rate: 450, category: 'Civil', state: 'Maharashtra', city: 'Mumbai' },
  { id: 'm2', name: 'TMT Steel', unit: 'Kg', rate: 75, category: 'Civil', state: 'Delhi', city: 'New Delhi' },
  { id: 'm3', name: 'Sand', unit: 'CFT', rate: 65, category: 'Civil', state: 'Karnataka', city: 'Bangalore' },
  { id: 'm4', name: 'Brick', unit: 'Pcs', rate: 12, category: 'Civil', state: 'West Bengal', city: 'Kolkata' },
  { id: 'm5', name: 'Paint (Apex)', unit: 'Litre', rate: 320, category: 'Painting', state: 'Tamil Nadu', city: 'Chennai' },
];

export const INITIAL_MANPOWER: ManpowerMaster[] = [
  { id: 'mp1', type: 'Mason', ratePerDay: 850, skillLevel: 'skilled', state: 'Maharashtra', city: 'Mumbai' },
  { id: 'mp2', type: 'Helper', ratePerDay: 450, skillLevel: 'unskilled', state: 'Delhi', city: 'New Delhi' },
  { id: 'mp3', type: 'Electrician', ratePerDay: 900, skillLevel: 'highly-skilled', state: 'Karnataka', city: 'Bangalore' },
  { id: 'mp4', type: 'Painter', ratePerDay: 750, skillLevel: 'skilled', state: 'West Bengal', city: 'Kolkata' },
  { id: 'mp5', type: 'Plumber', ratePerDay: 850, skillLevel: 'skilled', state: 'Tamil Nadu', city: 'Chennai' },
];

export const PROJECTS: Project[] = [
  { id: 'PROJ-2024-07-001', year: 2024, month: 'July', clientId: 'c1' },
  { id: 'PROJ-2024-07-002', year: 2024, month: 'July', clientId: 'c1' },
  { id: 'PROJ-2024-06-001', year: 2024, month: 'June', clientId: 'c2' },
  { id: 'PROJ-2023-12-001', year: 2023, month: 'December', clientId: 'c2' },
];

export const INITIAL_DESIGN_VERSIONS: DesignVersion[] = [
  { id: '1', version: 'V1.0', date: '2024-07-01', description: 'Initial 2D layout and zoning', fileName: 'layout_v1.pdf', userId: 'u6' },
  { id: '2', version: 'V1.1', date: '2024-07-05', description: 'Updated 2D floor plan with electrical points', fileName: 'layout_v1.1.pdf', userId: 'u6' },
  { id: '3', version: 'V2.0', date: '2024-07-10', description: 'First 3D photorealistic Render (Living Room)', fileName: 'render_v2.jpg', userId: 'u6' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { 
    id: '1', 
    memberName: 'John Doe', 
    memberId: 'EMP101', 
    timestamp: '2024-07-15 09:30', 
    mode: 'Transport', 
    subMode: 'Taxi', 
    startLocation: 'Main Office', 
    endLocation: 'Project Site A', 
    amount: 45.50, 
    fileName: 'bill_taxi.pdf',
    userId: 'u4'
  },
  { 
    id: '2', 
    memberName: 'Jane Smith', 
    memberId: 'EMP102', 
    timestamp: '2024-07-15 13:00', 
    mode: 'Meals', 
    subMode: 'Lunch with Client', 
    amount: 112.00, 
    fileName: 'bill_lunch.jpg',
    userId: 'u4'
  },
];

export const INITIAL_WEEKLY_STATUS: WeeklyStatus[] = [
  { 
    id: '1', 
    month: 'July', 
    year: 2024,
    week: 'Week 2 (July 8 - July 14)', 
    date: '2024-07-14',
    userId: 'u4',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1503387762-592dee58c460?w=500&auto=format&fit=crop&q=60'
    ],
    progressText: 'Tiling work is 80% complete. Electrical wiring for the living area started. Bathroom plumbing successfully pressure tested.',
    auditMaterial: 'verified',
    auditSafety: 'certified',
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Alice Client', text: 'Looks great! Can we speed up the tiling process?', timestamp: '2024-07-14 10:00', starred: true },
      { id: 'c2', userId: 'u1', userName: 'Pramit Owner', text: 'We are working on it, Alice. More workers arriving Monday.', timestamp: '2024-07-14 11:30', starred: false },
    ]
  },
  { 
    id: '2', 
    month: 'July', 
    year: 2024,
    week: 'Week 1 (July 1 - July 7)', 
    date: '2024-07-07',
    userId: 'u4',
    photos: [
      'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?w=500&auto=format&fit=crop&q=60'
    ],
    progressText: 'Foundation wall painting in progress. Verification of shade consistency against Design v2.0 approved.',
    auditMaterial: 'verified',
    auditSafety: 'pending',
    comments: [
      { id: 'c3', userId: 'u2', userName: 'Alice Client', text: 'Confirming the wall color is as per the final design?', timestamp: '2024-07-07 09:00', starred: false },
      { id: 'c4', userId: 'u4', userName: 'Charlie Project', text: 'Yes, it is the exact shade from Design v2.0.', timestamp: '2024-07-07 14:00', starred: true },
    ]
  },
];
