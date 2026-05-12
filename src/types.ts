import { 
  User, 
  ProjectPayment, 
  ProjectCostItem, 
  Vendor 
} from './mockData';

export type AccountSubView = 'overview' | 'payments' | 'vendors' | 'materials' | 'cost-analysis';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  isCreatingStatus: boolean;
  setIsCreatingStatus: (val: boolean) => void;
}
