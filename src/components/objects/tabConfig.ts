
export interface TabConfig {
  id: string;
  label: string;
  iconName: string; // Store name to map to lucide icons
}


export const AVAILABLE_TABS: TabConfig[] = [
  { id: 'design', label: 'Design', iconName: 'ImageIcon' },
  { id: 'quotation', label: 'Quotation', iconName: 'FileText' },
  { id: 'material', label: 'Material', iconName: 'Package' },
  { id: 'billing', label: 'Daily Expenses', iconName: 'CreditCard' },
  { id: 'weekly-status', label: 'Weekly Status', iconName: 'GanttChartSquare' },
  { id: 'legal', label: 'Legal', iconName: 'ShieldCheck' },
  { id: 'accounts', label: 'Accounts', iconName: 'LayoutDashboard' },
  { id: 'settings', label: 'Settings', iconName: 'Settings' },
  { id: 'execDash', label: 'Executive Dashboard', iconName: 'ExecutiveDashboard' }
];


